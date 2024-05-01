import { Artifact, Affix } from "@/game/base/artifact";
import { ArtifactData } from "./data";

export class SrAffix extends Affix {
    valueString() {
        if (["hp", "atk", "def"].includes(this.key)) {
            return this.value.toFixed(0);
        } else {
            return this.value.toFixed(1) + "%";
        }
    }
}

export class SrArtifact extends Artifact {
    constructor(o?: any) {
        super(o);
        this.ArtifactData = ArtifactData;
    }

    get nMinorsUpgraded(): number {
        return Math.floor(this.level / 3);
    }

    get nMinorsToUpgrade() {
        return this.rarity - this.nMinorsUpgraded;
    }
}
