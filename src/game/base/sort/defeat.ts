import { Artifact } from "@/game/base/artifact";

export interface IDefeatResult {
    defeat: number;
    by: Artifact[];
}

export type IDefeatResults = Map<Artifact, IDefeatResult>;

export abstract class DefeatSort {
    abstract VecIndices: { [key: string]: number };

    /**
     * 按上位替代数从小到大排序。圣遗物b是圣遗物a的上位替代，如果它们类型相同，
     * 且a的所有副词条（除小攻/小生/小防外）b都有而且数值更大。
     * @param arts 圣遗物列表，会被修改
     * @returns results
     */
    sort(arts: Artifact[]): IDefeatResults {
        const results = new Map<Artifact, IDefeatResult>(),
            mvecs = new Map<Artifact, number[]>();

        let bins: { [key: string]: Artifact[] } = {};
        // categorize artifacts into bins, and update defeat and mvec for each artifact
        for (let a of arts) {
            let categoryKey =
                a.slot + "," + a.mainKey + "," + Math.floor(a.level / 4);
            if (categoryKey in bins) {
                bins[categoryKey].push(a);
            } else {
                bins[categoryKey] = [a];
            }
            results.set(a, { defeat: 0, by: [] });
            // a: [0,0,0,0,0,0,0]
            mvecs.set(
                a,
                new Array(Object.keys(this.VecIndices).length).fill(0),
            );
            for (let m of a.minors) {
                // ignore atk, def and hp
                if (m.key in this.VecIndices)
                    mvecs.get(a)![this.VecIndices[m.key]] = m.value;
            }
        }
        // enumerate inside each category (O(n^2))
        for (let categoryKey in bins) {
            let len = bins[categoryKey].length;
            for (let i = 0; i < len - 1; ++i) {
                for (let j = i + 1; j < len; ++j) {
                    let a = bins[categoryKey][i],
                        b = bins[categoryKey][j];
                    // a Pareto comparison
                    let cnt_a_over_b = 0,
                        cnt_b_over_a = 0;
                    let countNum = Object.keys(this.VecIndices).length;
                    for (let k = 0; k < countNum; ++k) {
                        if (mvecs.get(a)![k] >= mvecs.get(b)![k])
                            cnt_a_over_b++;
                        if (mvecs.get(b)![k] >= mvecs.get(a)![k])
                            cnt_b_over_a++;
                    }
                    // only if these one cnt is 7 and the other <7, update defeat
                    if (cnt_a_over_b == countNum && cnt_b_over_a < countNum) {
                        results.get(b)!.defeat++;
                        results.get(b)!.by.push(a);
                    } else if (
                        cnt_b_over_a == countNum &&
                        cnt_a_over_b < countNum
                    ) {
                        results.get(a)!.defeat++;
                        results.get(a)!.by.push(b);
                    }
                }
            }
        }
        // sort by defeat, break ties arbitrarily
        arts.sort((a, b) => results.get(a)!.defeat - results.get(b)!.defeat);

        return results;
    }
}
