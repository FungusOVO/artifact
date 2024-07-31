import { gameUtils } from "@/game/GameUtils";
import { IArtifactData, ICharacterData } from "@/game/base/data/type";
import { Artifact } from "@/game/base/artifact";
import { SimpleCache } from "@/utils";
import type { IWeight, ICharKey, ICharBaseAttr } from "../../base/types";
import { getAffnumPdf } from "../../gacha/reliq";
import { toCDF } from "../../gacha/utils";
import lodash from "lodash";
import { gameManager } from "@/game/GameManager";

export interface IBuild {
    key: string;
    name: string;
    set: string[];
    setList?: string[][];
    main: {
        [slotKey: string]: string[];
    };
    weight: {
        [affixKey: string]: number;
    };
}

export interface IPBuildResult {
    maxProb: number;
    buildProbs: { [key: string]: number };
    maxScore: number;
    mark: { [key: string]: { score: number; class: string } };
}

export type IPBuildResults = Map<Artifact, IPBuildResult>;

export type IPBuildSortBy = "max" | "owner";

export type ICalProbType = "avg" | "max" | "min";

export type ICalWeightType = "prob" | "mark";

interface IAttr {
    [key: string]: {
        weight: number;
    };
}

export abstract class PBuildSort {
    abstract ArtifactData: IArtifactData;
    abstract CharacterData: ICharacterData;

    AffnumCDFCache = new SimpleCache(
        ({
            mainKey,
            weight,
            rarity,
        }: {
            mainKey: string;
            weight: IWeight;
            rarity: number;
        }) => {
            let w = { ...weight };
            this.ArtifactData.minorKeys.forEach((key) => {
                w[key] ||= 0;
            });
            let pdf = getAffnumPdf(mainKey, w, rarity);
            return toCDF(pdf);
        },
    );

    // AvgAffnumCache记录不同权重下圣遗物的满级期望词条数
    AvgAffnumCache = new SimpleCache(
        ({
            art,
            weight,
            calProbType,
        }: {
            art: Artifact;
            weight: IWeight;
            calProbType: ICalProbType;
        }) => {
            return gameUtils.calcAffnumFull(art, weight)[calProbType] * 10;
        },
    );
    // ProbCache记录不同权重下的（无套装）适配概率
    ProbCache = new SimpleCache(
        ({
            art,
            weight,
            calProbType,
        }: {
            art: Artifact;
            weight: IWeight;
            calProbType: ICalProbType;
        }) => {
            let p = this.ArtifactData.mainProbs[art.slot][art.mainKey] / 5,
                a = this.AvgAffnumCache.get({ art, weight, calProbType }),
                d = this.AffnumCDFCache.get({
                    mainKey: art.mainKey,
                    weight,
                    rarity: art.rarity,
                }),
                x = a >= d.length ? 1 : d[Math.round(a)];
            return p * x + 1 - p;
        },
    );

    MarkAttrCache = new SimpleCache((build: IBuild) => {
        let char = this.CharacterData[build.key as ICharKey] || {};
        let weight = build.weight;

        let attrWeight: {
            [key: string]: number;
        } = {};
        for (let slotKey of this.ArtifactData.adjustSlotKeys) {
            for (let mainAttr of build.main[slotKey]) {
                if (mainAttr.includes("DB")) {
                    if (this.ArtifactData.elementDBKeys.includes(mainAttr)) {
                        attrWeight["elementalDB"] = 100;
                    } else if ("physicalDB" == mainAttr) {
                        attrWeight["physicalDB"] = 100;
                    }
                }
                if (mainAttr.includes("hb")) {
                    attrWeight["hb"] = 100;
                }
            }
        }

        for (let key in weight) {
            attrWeight[key] = weight[key] * 100;
        }

        let attrs: IAttr = {};
        let baseAttr = char.baseAttr || { hp: 14000, atk: 230, def: 700 };

        let attrMap = this.ArtifactData.minorStatsR5;
        lodash.forEach(attrMap, (attrVal, key) => {
            let baseKey;
            if (["hp", "atk", "def"].includes(key)) {
                baseKey = key + "p";
            }
            let weight = attrWeight[baseKey || key];
            if (!weight) {
                weight = 0;
            }
            let ret = {
                value: attrVal,
                weight,
            };
            if (baseKey) {
                let plus = baseKey === "atkp" ? 520 : 0;
                ret.weight =
                    ((weight * attrVal) /
                        attrMap[baseKey as ICharBaseAttr] /
                        (baseAttr[key as ICharBaseAttr] + plus)) *
                    100;
            }
            attrs[key] = ret;
        });
        return attrs;
    });

    MarkCalCache = new SimpleCache(
        ({
            arti,
            itemBuild,
            attrs,
            calProbType,
        }: {
            arti: Artifact;
            itemBuild: IBuild;
            attrs: IAttr;
            calProbType: ICalProbType;
        }) => {
            let ret = 0;
            let mAttr = {
                key: arti.mainKey,
                value: (<number[]>arti.mainStats)[arti.level],
            };
            let posMaxMark = this.getMaxMark(attrs);

            let key: string = arti.mainKey;
            if (!key) {
                return 0;
            }
            let fixPct = 1;
            let slotKey = arti.slot;

            if (this.ArtifactData.adjustSlotKeys.includes(slotKey)) {
                let mainKey = key;
                if (key !== "er") {
                    for (let slotKey of this.ArtifactData.adjustSlotKeys) {
                        if (
                            this.ArtifactData.elementDBKeys.includes(mainKey) &&
                            itemBuild.main[slotKey].includes(mainKey)
                        ) {
                            mainKey = "elementalDB";
                        }
                    }
                    fixPct = Math.max(
                        0,
                        Math.min(
                            1,
                            (attrs[mainKey]?.weight || 0) /
                                posMaxMark["m" + slotKey],
                        ),
                    );
                    if (
                        ["atkp", "hpp", "defp"].includes(mainKey) &&
                        attrs[mainKey]?.weight >= 75
                    ) {
                        fixPct = 1;
                    }
                }
                ret +=
                    ((attrs[mainKey]?.weight || 0) * (mAttr.value || 0)) /
                    this.ArtifactData.minorStatsR5[mainKey as ICharBaseAttr] /
                    4;
            }

            ret +=
                this.AvgAffnumCache.get({
                    art: arti,
                    weight: itemBuild.weight,
                    calProbType,
                }) * 10;

            return ((ret * (1 + fixPct)) / 2 / posMaxMark[slotKey]) * 66;
        },
    );

    calcPBuild(
        art: Artifact,
        builds: IBuild[],
        {
            threshold = 0.001,
            numInSet = 100,
            numIndividual = 200,
            ignoreIndividual = false,
            pBuildIgnoreSmallWeight = false,
            calProbType = "avg",
        }: {
            threshold?: number;
            numInSet?: number;
            numIndividual?: number;
            ignoreIndividual?: boolean;
            pBuildIgnoreSmallWeight?: boolean;
            calProbType?: ICalProbType;
        },
    ) {
        const ret: IPBuildResult = {
            maxProb: 0,
            maxScore: 0,
            buildProbs: {},
            mark: {},
        };

        for (const b of builds) {
            // if artifact type is not recommanded, skip
            if (
                this.ArtifactData.adjustSlotKeys.includes(art.slot) &&
                !b.main[art.slot]?.includes(art.mainKey)
            )
                continue;
            // if not in recommanded set, and should ignore individual artifact, skip
            let inSet = gameUtils.isInSetGroup(b.set, art.set);
            if (!inSet && ignoreIndividual) continue;
            // 更新小词条weight
            let attrs = this.MarkAttrCache.get(b);

            if (!pBuildIgnoreSmallWeight) {
                for (let key in b.weight) {
                    b.weight[key] = attrs[key]
                        ? attrs[key].weight / 100
                        : b.weight[key];
                }
            }

            // set factor
            let nSet = inSet ? numInSet : numIndividual;
            // prob
            let prob =
                this.ProbCache.get({ art, weight: b.weight, calProbType }) **
                nSet;
            // update result
            if (prob < threshold) continue;
            ret.maxProb = Math.max(ret.maxProb, prob);
            ret.buildProbs[b.key] = prob;
            // 计算评分
            let score = this.MarkCalCache.get({
                arti: art,
                itemBuild: b,
                attrs,
                calProbType,
            });
            ret.maxScore = Math.max(ret.maxScore, score);
            ret.mark[b.key] = {
                score: score,
                class: this.getMarkClass(score),
            };
        }

        return ret;
    }

    /**
     * 按配装适配概率从大到小排序。圣遗物a对配装b的适配概率定义为，刷100个满级圣遗物，
     * 其中和a同部位同主词条的圣遗物得分均不超过a的满级期望得分的概率。
     * 如果a对b是散件则是200个。
     * @param arts 圣遗物列表，会被修改
     * @param allBuilds 配装列表
     * @param selectedBuildKeys 选中的配装key
     * @param sortBy 排序依据
     *   - max: 最大适配概率
     *   - owner: 如果已装配，按装配者的概率排序，否则按最大适配概率排序
     * @returns results
     */
    sort(
        arts: Artifact[],
        allBuilds: IBuild[],
        selectedBuildKeys: string[],
        {
            sortBy = "max",
            threshold = 0.001,
            numInSet = 100,
            numIndividual = 200,
            ignoreIndividual = false,
            pBuildIgnoreSmallWeight = false,
            calArtiWeightType = "prob",
            calProbType = "avg",
        }: {
            sortBy?: IPBuildSortBy;
            threshold?: number;
            numInSet?: number;
            numIndividual?: number;
            ignoreIndividual?: boolean;
            pBuildIgnoreSmallWeight?: boolean;
            calArtiWeightType?: ICalWeightType;
            calProbType?: ICalProbType;
        },
    ) {
        const results = new Map<Artifact, IPBuildResult>(),
            // 勾选的配装
            builds = allBuilds.filter((b) => selectedBuildKeys.includes(b.key));
        if (calArtiWeightType == "mark") {
            threshold = 0;
        }
        for (let art of arts) {
            let _builds = [...builds];
            // 拼接有装备的配装
            if (sortBy == "owner") {
                _builds = _builds.concat(
                    allBuilds.filter((b) => b.key === art.location),
                );
            }

            let pbuild = this.calcPBuild(art, _builds, {
                threshold,
                numInSet,
                numIndividual,
                ignoreIndividual,
                pBuildIgnoreSmallWeight,
                calProbType,
            });
            results.set(art, pbuild);
        }
        arts.sort((a, b) => {
            let pbuildA = results.get(a),
                pbuildB = results.get(b);
            if (pbuildA === undefined || pbuildB === undefined) {
                throw new Error("Unexpected undefined");
            }

            let calKey: keyof IPBuildResult = "maxProb";
            if (calArtiWeightType == "prob") {
                calKey = "maxProb";
            } else if (calArtiWeightType == "mark") {
                calKey = "maxScore";
            }

            if (sortBy === "max") {
                return pbuildB[calKey] - pbuildA[calKey];
            } else if (sortBy === "owner") {
                let pa = a.location
                        ? pbuildA.buildProbs[a.location] || 0
                        : pbuildA[calKey],
                    pb = b.location
                        ? pbuildB.buildProbs[b.location] || 0
                        : pbuildB[calKey];
                return pb - pa;
            } else {
                throw new Error("Unexpected sortBy");
            }
        });
        console.log;
        return results;
    }

    getMarkClass(mark: number) {
        let scoreMap: Array<[string, number]> = [
            ["D", 7],
            ["C", 14],
            ["B", 21],
            ["A", 28],
            ["S", 35],
            ["SS", 42],
            ["SSS", 49],
            ["ACE", 56],
            ["MAX", 70],
            ["MAX", 100],
        ];
        for (let idx = 0; idx < scoreMap.length; idx++) {
            if (mark < scoreMap[idx][1]) {
                return scoreMap[idx][0];
            }
        }
        return "E";
    }

    // 获取位置最高分;
    getMaxMark(attrs: IAttr) {
        let ret: {
            [key: string]: number;
        } = {};

        let mainAttr = this.ArtifactData.mainKeys;
        let subAttr = this.ArtifactData.minorKeys;
        let slotKeys = this.ArtifactData.slotKeys;

        for (let slotKey of slotKeys) {
            let totalMark = 0;
            let mMark = 0;
            let mAttr = mainAttr[slotKey][0];

            if (this.ArtifactData.adjustSlotKeys.includes(slotKey)) {
                mAttr = this.getMaxAttr(attrs, mainAttr[slotKey])[0];
                mMark = attrs[mAttr].weight;
                totalMark += attrs[mAttr].weight * 2;
            }

            let sAttr = this.getMaxAttr(attrs, subAttr, 4, mAttr);
            lodash.forEach(sAttr, (attr, aIdx) => {
                totalMark += attrs[attr].weight * (aIdx === 0 ? 6 : 1);
            });
            ret[slotKey] = totalMark;
            ret["m" + slotKey] = mMark;
        }
        return ret;
    }

    // 获取最高分的属性
    getMaxAttr(
        attrs: IAttr = {},
        list2: string[] = [],
        maxLen = 1,
        banAttr = "",
    ) {
        let tmp: Array<{
            attr?: string;
            mark?: number;
        }> = [];

        lodash.forEach(list2, (attr) => {
            if (this.ArtifactData.elementDBKeys.includes(attr)) {
                attr = "elementalDB";
            }
            if (attr === banAttr) return;
            if (!attrs[attr]) return;
            tmp.push({ attr, mark: attrs[attr].weight });
        });
        tmp = lodash.sortBy(tmp, "mark");
        tmp = tmp.reverse();
        let ret: Array<string> = [];
        lodash.forEach(tmp, (ds) => ret.push(ds.attr as string));
        return ret.slice(0, maxLen);
    }
}
