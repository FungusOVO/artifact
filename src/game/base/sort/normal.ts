import { Artifact } from "@/game/base/artifact";

class Ord {
    private data: { [key: string]: number } = {};
    set(key: string, value: number) {
        this.data[key] = value;
    }
    get(key: string) {
        if (key in this.data) return this.data[key];
        else return -1;
    }
}

export abstract class NormalSort {
    SetOrd: Ord;
    SlotOrd: Ord;
    MainOrd: Ord;

    constructor() {
        this.SetOrd = new Ord();
        this.SlotOrd = new Ord();
        this.MainOrd = new Ord();
    }

    /**
     * 按套装、部位、主词条、等级为关键字的标准排序
     * @param arts 待排序的圣遗物列表，会被修改
     */
    sort(arts: Artifact[]) {
        arts.sort((a, b) => {
            let delta = 0;

            delta = this.SetOrd.get(a.set) - this.SetOrd.get(b.set);
            if (delta) return delta;

            delta = this.SlotOrd.get(a.slot) - this.SlotOrd.get(b.slot);
            if (delta) return delta;

            delta = this.MainOrd.get(a.mainKey) - this.MainOrd.get(b.mainKey);
            if (delta) return delta;

            return -a.level + b.level;
        });
    }
}
