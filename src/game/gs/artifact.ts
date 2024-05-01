import { Artifact, Affix } from "@/game/base/artifact";
import { ArtifactData } from "./data";

export class GsAffix extends Affix {
    valueString() {
        if (["hp", "atk", "def", "em"].includes(this.key)) {
            return this.value.toFixed(0);
        } else {
            return this.value.toFixed(1) + "%";
        }
    }
}

export class GsArtifact extends Artifact {
    constructor(o?: any) {
        super(o);
        this.ArtifactData = ArtifactData;
    }
}
