import { gameUtils } from "@/game/GameUtils";
import { IArtifactData } from "@/game/base/data/type";
import { Artifact } from "@/game/base/artifact";
import type { IBuild, IPBuildSortBy } from "../../base/types";
import {
    ICalProbType,
    ICalWeightType,
    IPBuildResult,
    PBuildSort,
} from "@/game/base/sort/pbuild";

import lodash from "lodash";
import { i18n } from "@/i18n";
import { gameManager } from "@/game/GameManager";

interface IAvatar {
    key: string;
    text: string;
    icon: string;
    rarity: number;
    bg: string;
}

interface ISlotSetBestArt {
    [slotKey: string]: {
        [key: string]: IBestArt;
    };
}

interface IBestArt {
    set: string;
    art: Artifact;
    score: number;
    scoreDesc: string;
}

export interface ISlotBestArt {
    [slotKey: string]: IBestArt;
}

export type IPOrderResults = {
    key: string;
    bestArt: ISlotBestArt;
    bestScore: number;
    bestScoreDesc: string;
}[];

export abstract class POrder {
    abstract ArtifactData: IArtifactData;
    abstract game: string;
    abstract orderSize: number;

    // 获取每个部位每种套装最高评分的圣遗物
    getSlotSetBestArt(
        charName: string,
        artMap: Map<Artifact, IPBuildResult>,
        sets: string[],
        {
            calArtiWeightType = "mark",
        }: {
            calArtiWeightType: string;
        },
    ): ISlotSetBestArt {
        let ret: ISlotSetBestArt = {};
        for (let slotName of this.ArtifactData.slotKeys) {
            ret[slotName] = {};
        }

        artMap.forEach((buildResult, art) => {
            let setName = "other";
            if (gameUtils.isInSetGroup(sets, art.set)) {
                setName = art.set;
            }

            let score = 0;
            let scoreDesc = "";
            let pBuildSort = gameManager.getSort<PBuildSort>(PBuildSort);

            if (calArtiWeightType == "mark") {
                score = buildResult.mark[charName]?.score || 0;
                scoreDesc =
                    score.toFixed(2) +
                    " (" +
                    pBuildSort.getMarkClass(score) +
                    ")";
            }
            if (calArtiWeightType == "prob") {
                score = buildResult.buildProbs[charName] * 100 || 0;
                scoreDesc = score.toFixed(2) + "%";
            }

            let lastArt = ret[art.slot][setName];
            if (!lastArt || lastArt.score < score) {
                ret[art.slot][setName] = {
                    set: art.set,
                    art: art,
                    score: score,
                    scoreDesc,
                };
            }

            let lastOtherArt = ret[art.slot]["other"];
            if (!lastOtherArt || lastOtherArt.score < score) {
                ret[art.slot]["other"] = {
                    set: art.set,
                    art: art,
                    score: score,
                    scoreDesc,
                };
            }
        });

        return ret;
    }

    calSlotBestArts(
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
        for (let slotKey of this.ArtifactData.slotKeys) {
            let setName = "other";
            let score = 0;
            let slot = buildSlotSetBestArt[slotKey] || {};

            for (let name in slot) {
                if (slot[name]?.score > score) {
                    score = slot[name]?.score;
                    setName = name;
                }
            }
            bestOrder.push(setName);
        }

        // 尝试每一种套装的组合,使用每一种套装里最高分的装备,得到最高分的套装
        for (let order of orderList) {
            let score = 0;
            for (let i = 0; i < order.length; i++) {
                score +=
                    buildSlotSetBestArt[this.ArtifactData.slotKeys[i]][order[i]]
                        ?.score || -1000;
            }

            if (score > bestScore) {
                bestScore = score;
                bestOrder = order;
            }
        }

        let bestArt: ISlotBestArt = {};

        for (let i = 0; i < bestOrder.length; i++) {
            let slotName = this.ArtifactData.slotKeys[i];
            bestArt[slotName] = buildSlotSetBestArt[slotName][bestOrder[i]];
        }
        return { bestArt, bestScore, bestOrder };
    }

    // 通过配装信息获取每个部位可能的配装
    getOrderListBySetList(setList: string[][]) {
        let orderList: string[][] = [];

        for (let sets of setList) {
            // 如果仅有1种配置,且是相同的2+2时
            if (
                sets.length == 1 &&
                Object.keys(this.ArtifactData.setGroups).includes(sets[0])
            ) {
                // 更新二件套别名的套装
                let originSets = [...sets];
                sets = [];
                for (let set of originSets) {
                    if (
                        Object.keys(this.ArtifactData.setGroups).includes(set)
                    ) {
                        sets = [...sets, ...this.ArtifactData.setGroups[set]];
                    } else {
                        sets.push(set);
                    }
                }
            }

            // 排列可能的套装组合
            let searchObj: { [key: string]: number } = {};
            if (sets.length == 0) {
                searchObj = { other: 5 };
            } else if (sets.length == 1) {
                searchObj[sets[0]] = 4;
                searchObj["other"] = 1;
            } else if (sets.length > 1) {
                for (let key of sets) {
                    searchObj[key] = 2;
                }
                searchObj["other"] = 1;
            }

            let curOrderList = this.permutation(searchObj, this.orderSize);
            // 将2件套组合的名称转换原始套装名
            curOrderList = this.convertSetGroup(
                this.convertSetGroup(curOrderList),
            );
            orderList = curOrderList.concat(orderList);
        }
        return orderList;
    }

    convertSetGroup(originList: string[][]) {
        let setList: string[][] = [];
        for (let sets of originList) {
            let setGroup = sets.find((set) => {
                return Object.keys(this.ArtifactData.setGroups).includes(set);
            });
            if (setGroup) {
                for (let setName of this.ArtifactData.setGroups[setGroup]) {
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

    permutation(
        obj: { [key: string]: number },
        maxLen: number,
        originObj: { [key: string]: number } | null = null,
        curArr: string[] = [],
        ret: string[][] = [],
    ) {
        if (!originObj) {
            originObj = obj;
        }
        if (curArr.length == maxLen) {
            let isSet = true;
            // 判断套装数量是不是已经被用完了
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
                ret = this.permutation(
                    nextObj,
                    maxLen,
                    originObj,
                    [...curArr, key],
                    ret,
                );
            }
        }
        return ret;
    }

    sort(
        arts: Artifact[],
        builds: IBuild[],
        buildOrder: IAvatar[],
        {
            calArtiWeightType = "prob",
            calProbType = "avg",
        }: {
            calArtiWeightType?: ICalWeightType;
            calProbType?: ICalProbType;
        },
    ) {
        let selectedBuildKeys = buildOrder.map((b) => b.key);
        let pBuildSort = gameManager.getSort<PBuildSort>(PBuildSort);
        let artScoreResult: Map<Artifact, IPBuildResult> = pBuildSort.sort(
            arts,
            builds,
            selectedBuildKeys,
            {
                ignoreIndividual: false,
                calArtiWeightType,
                calProbType,
            },
        );
        let artScoreMap = new Map(artScoreResult);
        let ret: IPOrderResults = [];

        lodash.forEach(buildOrder, (avator) => {
            let build = builds.filter((b) => b.key == avator.key)[0];
            let orderList = this.getOrderListBySetList(
                build.setList as string[][],
            );
            // 当前配置下,每个部位每个套装最佳的圣遗物
            let buildSlotSetBestArt = this.getSlotSetBestArt(
                build.key,
                artScoreMap,
                build.set,
                {
                    calArtiWeightType,
                },
            );
            // 每个部位最佳的圣遗物
            let { bestArt, bestScore, bestOrder } = this.calSlotBestArts(
                orderList as string[][],
                buildSlotSetBestArt,
            );

            let bestScoreDesc = this.getOrderDesc(bestOrder) + " ";
            let avgScore = bestScore / this.orderSize;
            if (calArtiWeightType == "prob") {
                bestScoreDesc += avgScore.toFixed(2) + "%";
            }
            if (calArtiWeightType == "mark") {
                bestScoreDesc +=
                    bestScore.toFixed(2) +
                    " (" +
                    pBuildSort.getMarkClass(bestScore / this.orderSize) +
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

    // 获取预设中的套装中文名
    getSetOrderName(set: string[]) {
        if (set.length == 1) {
            let key = set[0];
            if (Object.keys(this.ArtifactData.setGroups).includes(key)) {
                return (
                    i18n.global.t(`artifact.${this.game}.set_group.${key}`) +
                    "+" +
                    i18n.global.t(`artifact.${this.game}.set_group.${key}`)
                );
            } else {
                return i18n.global.t(`artifact.${this.game}.set.${key}`) + "4";
            }
        } else {
            let ret = [];
            for (let key of set) {
                if (Object.keys(this.ArtifactData.setGroups).includes(key)) {
                    ret.push(
                        i18n.global.t(`artifact.${this.game}.set_group.${key}`),
                    );
                } else {
                    ret.push(
                        i18n.global.t(`artifact.${this.game}.set.${key}`) + "2",
                    );
                }
            }
            return ret.join("+");
        }
    }

    // 获取搭配好的套装中文名
    getOrderDesc(order: string[]) {
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
                retArr.push(
                    i18n.global.t(`artifact.${this.game}.set.${set}`) + "4",
                );
            }
            if (countMap[set] == 2) {
                retArr.push(
                    i18n.global.t(`artifact.${this.game}.set.${set}`) + "2",
                );
            }
        }
        return retArr.join(" + ");
    }
}
