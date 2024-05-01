import { POrder } from "@/game/base/sort/porder";
import { ArtifactData } from "@/game/sr/data";
import * as ArtifactDataOrigin from "@/game/sr/data/artifactData.json";

export class SrPOrder extends POrder {
    game = "sr";
    ArtifactData = ArtifactData;
    orderSize = 6;

    // 通过配装信息获取每个部位可能的配装
    getOrderListBySetList(setList: string[][]) {
        let orderList: string[][] = [];

        for (let sets of setList) {
            let setGroup4 = sets.filter((set) => {
                return ArtifactDataOrigin.setKeysGroup4.includes(set);
            });
            let setGroup2 = sets.filter((set) => {
                return ArtifactDataOrigin.setKeysGroup2.includes(set);
            });

            // 如果仅有1种配置,且是相同的2+2时
            if (
                setGroup4.length == 1 &&
                Object.keys(this.ArtifactData.setGroups).includes(setGroup4[0])
            ) {
                // 更新二件套别名的套装
                let originSets = [...setGroup4];
                setGroup4 = [];
                for (let set of originSets) {
                    if (
                        Object.keys(this.ArtifactData.setGroups).includes(set)
                    ) {
                        setGroup4 = [
                            ...sets,
                            ...this.ArtifactData.setGroups[set],
                        ];
                    } else {
                        setGroup4.push(set);
                    }
                }
            }

            // 排列可能的套装组合
            let searchObj4: { [key: string]: number } = {};
            if (setGroup4.length == 0) {
                searchObj4 = { other: 4 };
            } else if (setGroup4.length == 1) {
                searchObj4[setGroup4[0]] = 4;
            } else if (setGroup4.length > 1) {
                for (let key of setGroup4) {
                    searchObj4[key] = 2;
                }
            }

            let searchObj2: { [key: string]: number } = {};
            if (setGroup2.length == 0) {
                searchObj2 = { other: 2 };
            } else if (setGroup2.length == 1) {
                searchObj2[setGroup2[0]] = 2;
            } else if (setGroup2.length > 1) {
                for (let key of setGroup2) {
                    searchObj2[key] = 2;
                }
            }

            let curOrderList4 = this.permutation(searchObj4, 4);
            let curOrderList2 = this.permutation(searchObj2, 2);
            let curOrderList = [];
            // 将2件套组合的名称转换原始套装名
            for (let order4 of curOrderList4) {
                for (let order2 of curOrderList2) {
                    curOrderList.push([...order4, ...order2]);
                }
            }
            curOrderList = this.convertSetGroup(
                this.convertSetGroup(curOrderList),
            );
            orderList = curOrderList.concat(orderList);
        }
        return orderList;
    }
}
