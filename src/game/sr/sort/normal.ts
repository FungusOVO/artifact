import { NormalSort } from "@/game/base/sort/normal";
import { ArtifactData } from "../data";

export class SrNormalSort extends NormalSort {
    constructor() {
        super();
        ArtifactData.setKeys.forEach((set, i) => this.SetOrd.set(set, i));
        ArtifactData.slotKeys.forEach((slot, i) => this.SlotOrd.set(slot, i));
        ArtifactData.mainKeys.all.forEach((main, i) =>
            this.MainOrd.set(main, i),
        );
    }
}
