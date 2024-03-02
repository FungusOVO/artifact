import { Artifact } from "../artifact";
import { calcAffnumFull, calcAffnumCur } from "./affnum";
import { SimpleCache } from "../utils";
import type { IWeight, ICharKey, ICharBaseAttr, ISlotKey } from "../types";
import { ArtifactData, CharacterData } from "../data";
import { getAffnumPdf } from "../gacha/reliq";
import { toCDF } from "../gacha/utils";
import lodash from "lodash";
import { useArtifactStore } from "@/store";

export interface IBuild {
    key: string;
    name: string;
    set: string[];
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

type ICalProbType = "avg" | "max" | "min";

let calProbType: ICalProbType = "avg";

const AffnumCDFCache = new SimpleCache(
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
        ArtifactData.minorKeys.forEach((key) => {
            w[key] ||= 0;
        });
        let pdf = getAffnumPdf(mainKey, w, rarity);
        return toCDF(pdf);
    },
);

// AvgAffnumCache记录不同权重下圣遗物的满级期望词条数
const AvgAffnumCache = new SimpleCache(
    ({
        art,
        weight,
        calProbType,
    }: {
        art: Artifact;
        weight: IWeight;
        calProbType: ICalProbType;
    }) => {
        return calcAffnumFull(art, weight)[calProbType] * 10;
    },
);
// ProbCache记录不同权重下的（无套装）适配概率
const ProbCache = new SimpleCache(
    ({
        art,
        weight,
        calProbType,
    }: {
        art: Artifact;
        weight: IWeight;
        calProbType: ICalProbType;
    }) => {
        let p = (ArtifactData.mainProbs as any)[art.slot][art.mainKey] / 5,
            a = AvgAffnumCache.get({ art, weight, calProbType }),
            d = AffnumCDFCache.get({
                mainKey: art.mainKey,
                weight,
                rarity: art.rarity,
            }),
            x = a >= d.length ? 1 : d[Math.round(a)];
        return p * x + 1 - p;
    },
);

export function setIncludes(set: string[], target: string) {
    for (let s of set) {
        if (s.startsWith("s:")) {
            if (
                s in ArtifactData.setGroups &&
                ArtifactData.setGroups[
                    s as keyof typeof ArtifactData.setGroups
                ].includes(target)
            )
                return true;
        } else if (s === target) return true;
    }
    return false;
}

function calcPBuild(
    art: Artifact,
    builds: IBuild[],
    {
        threshold = 0.001,
        numInSet = 100,
        numIndividual = 200,
        ignoreIndividual = false,
    }: {
        threshold?: number;
        numInSet?: number;
        numIndividual?: number;
        ignoreIndividual?: boolean;
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
            ["sands", "goblet", "circlet"].includes(art.slot) &&
            !b.main[art.slot].includes(art.mainKey)
        )
            continue;
        // if not in recommanded set, and should ignore individual artifact, skip
        let inSet = setIncludes(b.set, art.set);
        if (!inSet && ignoreIndividual) continue;
        // 更新小词条weight
        let attrs = MarkAttrCache.get(b);

        for (let key in b.weight) {
            b.weight[key] = attrs[key]
                ? attrs[key].weight / 100
                : b.weight[key];
        }

        // set factor
        let nSet = inSet ? numInSet : numIndividual;
        // prob
        let prob =
            ProbCache.get({ art, weight: b.weight, calProbType }) ** nSet;
        // update result
        if (prob < threshold) continue;
        ret.maxProb = Math.max(ret.maxProb, prob);
        ret.buildProbs[b.key] = prob;
        // 计算评分
        let score = MarkCalCache.get({ arti: art, itemBuild: b, attrs });
        ret.maxScore = Math.max(ret.maxScore, score);
        ret.mark[b.key] = {
            score: score,
            class: getMarkClass(score),
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
export function sort(
    arts: Artifact[],
    allBuilds: IBuild[],
    selectedBuildKeys: string[],
    {
        sortBy = "max",
        threshold = 0.001,
        numInSet = 100,
        numIndividual = 200,
        ignoreIndividual = false,
    }: {
        sortBy?: IPBuildSortBy;
        threshold?: number;
        numInSet?: number;
        numIndividual?: number;
        ignoreIndividual?: boolean;
    },
) {
    const results = new Map<Artifact, IPBuildResult>(),
        // 勾选的配装
        builds = allBuilds.filter((b) => selectedBuildKeys.includes(b.key));
    const artStore = useArtifactStore();
    calProbType = artStore.calArtiProbType as ICalProbType;

    for (let art of arts) {
        let _builds = [...builds];
        // 拼接有装备的配装
        if (sortBy == "owner") {
            _builds = _builds.concat(
                allBuilds.filter((b) => b.key === art.location),
            );
        }

        let pbuild = calcPBuild(art, _builds, {
            threshold,
            numInSet,
            numIndividual,
            ignoreIndividual,
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
        if (artStore.calArtiWeightType == "prob") {
            calKey = "maxProb";
        } else if (artStore.calArtiWeightType == "mark") {
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

    return results;
}

function getMarkClass(mark: number) {
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
function getMaxMark(attrs: IAttr) {
    let ret: {
        [key: string]: number;
    } = {};

    let mainAttr = ArtifactData.mainKeys;
    let subAttr = ArtifactData.minorKeys;
    let setKeys: Array<ISlotKey> = ArtifactData.slotKeys as [ISlotKey];

    for (let idx = 1; idx <= 5; idx++) {
        let totalMark = 0;
        let mMark = 0;
        let mAttr = "";

        if (idx === 1) {
            mAttr = "hp";
        } else if (idx === 2) {
            mAttr = "atk";
        } else if (idx >= 3) {
            mAttr = getMaxAttr(attrs, mainAttr[setKeys[idx - 1]])[0];
            mMark = attrs[mAttr].weight;
            totalMark += attrs[mAttr].weight * 2;
        }

        let sAttr = getMaxAttr(attrs, subAttr, 4, mAttr);
        lodash.forEach(sAttr, (attr, aIdx) => {
            totalMark += attrs[attr].weight * (aIdx === 0 ? 6 : 1);
        });
        ret[idx] = totalMark;
        ret["m" + idx] = mMark;
    }
    return ret;
}

// 获取最高分的属性
function getMaxAttr(
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
        if (ArtifactData.elementKeys.includes(attr)) {
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

const MarkAttrCache = new SimpleCache((build: IBuild) => {
    let char = CharacterData[build.key as ICharKey] || {};
    let weight = build.weight;

    let attrWeight: {
        [key: string]: number;
    } = {};

    lodash.forEach(build.main.goblet, (value) => {
        if (value.includes("DB")) {
            if (ArtifactData.elementKeys.includes(value)) {
                attrWeight["elementalDB"] = 100;
            } else if ("physicalDB" == value) {
                attrWeight["physicalDB"] = 100;
            }
        }
    });

    if (build.main.circlet.includes("hb")) {
        attrWeight["hb"] = 100;
    }

    for (let key in weight) {
        attrWeight[key] = weight[key] * 100;
    }

    let attrs: IAttr = {};
    let baseAttr = char.baseAttr || { hp: 14000, atk: 230, def: 700 };

    let attrMap = ArtifactData.minorStatsR5;
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

const MarkCalCache = new SimpleCache(
    ({
        arti,
        itemBuild,
        attrs,
    }: {
        arti: Artifact;
        itemBuild: IBuild;
        attrs: IAttr;
    }) => {
        let ret = 0;
        let mAttr = {
            key: arti.mainKey,
            value: (<number[]>arti.mainStats)[arti.level],
        };

        let posMaxMark = getMaxMark(attrs);

        let key: string = arti.mainKey;
        if (!key) {
            return 0;
        }
        let fixPct = 1;
        let idx = ArtifactData.slotKeys.indexOf(arti.slot) + 1;
        if (idx >= 3) {
            let mainKey = key;
            if (key !== "er") {
                if (
                    idx === 4 &&
                    ArtifactData.elementKeys.includes(mainKey) &&
                    itemBuild.main.goblet.includes(mainKey)
                ) {
                    mainKey = "elementalDB";
                }
                fixPct = Math.max(
                    0,
                    Math.min(
                        1,
                        (attrs[mainKey]?.weight || 0) / posMaxMark["m" + idx],
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
                ArtifactData.minorStatsR5[mainKey as ICharBaseAttr] /
                4;
        }

        ret +=
            AvgAffnumCache.get({
                art: arti,
                weight: itemBuild.weight,
                calProbType,
            }) * 10;

        return ((ret * (1 + fixPct)) / 2 / posMaxMark[idx]) * 66;
    },
);

interface IAttr {
    [key: string]: {
        weight: number;
    };
}
