import { Artifact } from "../artifact";
import { calcAffnumFull } from "./affnum";
import * as PBuildSort from "./pbuild";
import { SimpleCache } from "../utils";
import type {
    IWeight,
    IBuild,
    ICharKey,
    ICharBaseAttr,
    ISlotKey,
} from "../types";
import { ArtifactData, CharacterData } from "../data";
import { getAffnumPdf } from "../gacha/reliq";
import { toCDF } from "../gacha/utils";
import lodash from "lodash";
import { build } from "vite";
import { i18n } from "@/i18n";

interface IAvatar {
    key: string;
    text: string;
    icon: string;
    rarity: number;
    bg: string;
}

interface ISlotSetBestArt {
    flower: {
        [key: string]: { set: string; art: Artifact; score: number };
    };
    plume: {
        [key: string]: { set: string; art: Artifact; score: number };
    };
    sands: {
        [key: string]: { set: string; art: Artifact; score: number };
    };
    goblet: {
        [key: string]: { set: string; art: Artifact; score: number };
    };
    circlet: {
        [key: string]: { set: string; art: Artifact; score: number };
    };
}

export interface ISlotBestArt {
    flower: {
        set: string;
        art: Artifact;
        score: number;
    } | null;
    plume: {
        set: string;
        art: Artifact;
        score: number;
    } | null;
    sands: {
        set: string;
        art: Artifact;
        score: number;
    } | null;
    goblet: {
        set: string;
        art: Artifact;
        score: number;
    } | null;
    circlet: {
        set: string;
        art: Artifact;
        score: number;
    } | null;
}

// 获取每个部位每种套装最高评分的圣遗物
function getSlotSetBestArt(
    charName: string,
    artMap: Map<Artifact, PBuildSort.IPBuildResult>,
    sets: string[],
    {
        calArtiWeightType = "mark",
    }: {
        calArtiWeightType: string;
    },
): ISlotSetBestArt {
    let ret: ISlotSetBestArt = {
        flower: {},
        plume: {},
        sands: {},
        goblet: {},
        circlet: {},
    };
    artMap.forEach((buildResult, art) => {
        let setName = "other";
        if (PBuildSort.setIncludes(sets, art.set)) {
            setName = art.set;
        }

        let score = 0;
        if (calArtiWeightType == "mark") {
            score = buildResult.mark[charName]?.score || 0;
        }
        if (calArtiWeightType == "prob") {
            score = buildResult.buildProbs[charName] * 100 || 0;
        }

        let lastArt = ret[art.slot as keyof ISlotSetBestArt][setName];
        if (!lastArt || lastArt.score < score) {
            ret[art.slot as keyof ISlotSetBestArt][setName] = {
                set: art.set,
                art: art,
                score: score,
            };
        }

        let lastOtherArt = ret[art.slot as keyof ISlotSetBestArt]["other"];
        if (!lastOtherArt || lastOtherArt.score < score) {
            ret[art.slot as keyof ISlotSetBestArt]["other"] = {
                set: art.set,
                art: art,
                score: score,
            };
        }
    });

    return ret;
}

function calSlotBestArts(
    orderList: string[][],
    buildSlotSetBestArt: ISlotSetBestArt,
): {
    bestArt: ISlotBestArt;
    bestScore: number;
    bestOrder: string[];
} {
    let bestScore = 0;
    let bestOrder: string[] = [];

    // 先根据有什么圣遗物搭配一套
    for (let i = 0; i < 5; i++) {
        let setName = "other";
        let score = 0;
        let slot =
            buildSlotSetBestArt[
                ArtifactData.slotKeys[i] as keyof ISlotSetBestArt
            ];

        for (let name in slot) {
            if (slot[name]?.score > score) {
                score = slot[name]?.score;
                setName = name;
            }
        }
        bestOrder.push(setName);
    }

    for (let order of orderList) {
        let score = 0;
        for (let i = 0; i < order.length; i++) {
            score +=
                buildSlotSetBestArt[
                    ArtifactData.slotKeys[i] as keyof ISlotSetBestArt
                ][order[i]]?.score || -1000;
        }

        if (score > bestScore) {
            bestScore = score;
            bestOrder = order;
        }
    }

    let bestArt: ISlotBestArt = {
        flower: null,
        plume: null,
        sands: null,
        goblet: null,
        circlet: null,
    };

    for (let i = 0; i < bestOrder.length; i++) {
        let slotName = ArtifactData.slotKeys[i] as ISlotKey;
        bestArt[slotName] = buildSlotSetBestArt[slotName][bestOrder[i]];
    }
    return { bestArt, bestScore, bestOrder };
}

// 通过配装信息获取每个部位可能的配装
function getOrderListBySetList(setList: string[][]) {
    let orderList: string[][] = [];

    for (let sets of setList) {
        // 如果仅有1种配置,且是相同的2+2时
        if (
            sets.length == 1 &&
            Object.keys(ArtifactData.setGroups).includes(sets[0])
        ) {
            // 更新二件套别名的套装
            let originSets = [...sets];
            sets = [];
            for (let set of originSets) {
                if (Object.keys(ArtifactData.setGroups).includes(set)) {
                    sets = [
                        ...sets,
                        ...ArtifactData.setGroups[
                            set as keyof typeof ArtifactData.setGroups
                        ],
                    ];
                } else {
                    sets.push(set);
                }
            }
        }

        // 排列可能的套装组合
        let searchObj: { [key: string]: number } = {};
        if (sets.length == 0) {
            searchObj = { other: 4 };
        } else if (sets.length == 1) {
            searchObj[sets[0]] = 4;
            searchObj["other"] = 1;
        } else if (sets.length > 1) {
            for (let key of sets) {
                searchObj[key] = 2;
            }
            searchObj["other"] = 1;
        }

        let curOrderList = permutation(searchObj);
        // 将2件套组合的名称转换原始套装名
        curOrderList = convertSetGroup(convertSetGroup(curOrderList));
        orderList = curOrderList.concat(orderList);
    }
    return orderList;
}

function convertSetGroup(originList: string[][]) {
    let setList: string[][] = [];
    for (let sets of originList) {
        let setGroup = sets.find((set) => {
            return Object.keys(ArtifactData.setGroups).includes(set);
        });
        if (setGroup) {
            for (let setName of ArtifactData.setGroups[
                setGroup as keyof typeof ArtifactData.setGroups
            ]) {
                let newSets = sets.map((set) => {
                    if (set == setGroup) {
                        return setName;
                    } else {
                        return set;
                    }
                });
                setList.push(newSets);
            }
        } else {
            setList.push(sets);
        }
    }
    return setList;
}

function permutation(
    obj: { [key: string]: number },
    originObj: { [key: string]: number } | null = null,
    maxLen: number = 5,
    curArr: string[] = [],
    ret: string[][] = [],
) {
    if (!originObj) {
        originObj = obj;
    }
    if (curArr.length == maxLen) {
        let isSet = true;
        for (let key in obj) {
            if (obj[key] != originObj[key] && obj[key] != 0) {
                isSet = false;
            }
        }
        if (isSet) {
            ret.push(curArr);
        }
        return ret;
    }

    for (let key in obj) {
        if (obj[key] > 0) {
            let nextObj = Object.assign({}, obj);
            nextObj[key]--;
            ret = permutation(
                nextObj,
                originObj,
                maxLen,
                [...curArr, key],
                ret,
            );
        }
    }
    return ret;
}

export type IPOrderResults = {
    key: string;
    bestArt: ISlotBestArt;
    bestScore: number;
    bestScoreDesc: string;
}[];

export function sort(
    arts: Artifact[],
    builds: IBuild[],
    buildOrder: IAvatar[],
    {
        calArtiWeightType = "mark",
    }: {
        calArtiWeightType?: string;
    },
) {
    let selectedBuildKeys = buildOrder.map((b) => b.key);
    let artScoreResult = PBuildSort.sort(arts, builds, selectedBuildKeys, {});
    let artScoreMap = new Map(artScoreResult);
    let ret: IPOrderResults = [];

    lodash.forEach(buildOrder, (avator) => {
        let build = builds.filter((b) => b.key == avator.key)[0];
        let orderList = getOrderListBySetList(build.setList || []);

        // 当前配置下,每个部位每个套装最佳的圣遗物
        let buildSlotSetBestArt = getSlotSetBestArt(
            build.key,
            artScoreMap,
            build.set,
            {
                calArtiWeightType,
            },
        );
        // 每个部位最佳的圣遗物
        let { bestArt, bestScore, bestOrder } = calSlotBestArts(
            orderList as string[][],
            buildSlotSetBestArt,
        );

        let bestScoreDesc = getOrderDesc(bestOrder) + " ";
        let avgScore = bestScore / 5;
        if (calArtiWeightType == "prob") {
            bestScoreDesc += avgScore.toFixed(2) + "%";
        }
        if (calArtiWeightType == "mark") {
            bestScoreDesc +=
                bestScore.toFixed(2) +
                " (" +
                PBuildSort.getMarkClass(avgScore) +
                ")";
        }

        ret.push({ key: avator.key, bestArt, bestScore, bestScoreDesc });

        // 过滤已被使用的圣遗物
        for (let slotName in bestArt) {
            let art = bestArt[slotName as keyof ISlotBestArt]?.art;
            if (art && artScoreMap.has(art)) {
                artScoreMap.delete(art);
            }
        }
    });
    return { sortResults: artScoreResult, orderResults: ret };
}

export function getSetOrderName(set: string[]) {
    if (set.length == 1) {
        let key = set[0];
        if (Object.keys(ArtifactData.setGroups).includes(key)) {
            return (
                i18n.global.t("artifact.set_group." + key) +
                "+" +
                i18n.global.t("artifact.set_group." + key)
            );
        } else {
            return i18n.global.t("artifact.set." + key) + "4";
        }
    } else {
        let ret = [];
        for (let key of set) {
            if (Object.keys(ArtifactData.setGroups).includes(key)) {
                ret.push(i18n.global.t("artifact.set_group." + key));
            } else {
                ret.push(i18n.global.t("artifact.set." + key) + "2");
            }
        }
        return ret.join("+");
    }
}

export function getOrderDesc(order: string[]) {
    let countMap: {
        [key: string]: number;
    } = {};
    for (let set of order) {
        countMap[set] = (countMap[set] || 0) + 1;
    }
    if (countMap["other"] > 1) {
        return "散件";
    }
    let retArr: string[] = [];
    for (let set in countMap) {
        if (countMap[set] == 4) {
            retArr.push(i18n.global.t("artifact.set." + set) + "4");
        }
        if (countMap[set] == 2) {
            retArr.push(i18n.global.t("artifact.set." + set) + "2");
        }
    }
    return retArr.join(" + ");
}
