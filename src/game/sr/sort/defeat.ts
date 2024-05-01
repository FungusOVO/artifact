import { DefeatSort } from "@/game/base/sort/defeat";

export class SrDefeatSort extends DefeatSort {
    VecIndices: { [key: string]: number } = {
        cr: 0,
        cd: 1,
        spd: 2,
        er: 3,
        atkp: 4,
        defp: 5,
        hpp: 6,
    };
}
