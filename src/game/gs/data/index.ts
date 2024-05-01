import { IArtifactData } from "@/game/base/data/type";
import { default as artifactData } from "./artifactData.json";
export { default as CharacterData } from "./characterData.json";
export { default as DefaultAffixWeightTable } from "./defaultAffixWeightTable.json";
export { default as DefaultSetBonusTable } from "./defaultSetBonusTable.json";

const ArtifactData: IArtifactData = Object.assign(
    {
        setKeys: [],
    },
    artifactData,
);
ArtifactData.adjustSlotKeys = artifactData.slotKeys.filter((key) => {
    if (
        artifactData.mainKeys[key as keyof typeof artifactData.mainKeys]
            .length > 1
    ) {
        return true;
    }
    return false;
});

export { ArtifactData };
