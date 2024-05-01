import { IArtifactData, ICharacterData } from "@/game/base/data/type";
import { default as artifactData } from "./artifactData.json";
import { default as characterData } from "./characterData.json";

const ArtifactData: IArtifactData = Object.assign(
    {
        setKeys: [],
    },
    artifactData,
);
ArtifactData.setKeys = [
    ...artifactData.setKeysGroup4,
    ...artifactData.setKeysGroup2,
];
ArtifactData.adjustSlotKeys = artifactData.slotKeys.filter((key) => {
    if (
        artifactData.mainKeys[key as keyof typeof artifactData.mainKeys]
            .length > 1
    ) {
        return true;
    }
    return false;
});

const CharacterData: ICharacterData = Object.assign({}, characterData);
for (let charName in CharacterData) {
    let char = CharacterData[charName];
    char.build.set = [...new Set(char.build.setList.flat())];
}

export type ISrElementType = "element" | "path";

export function setElementType(type: ISrElementType) {
    let charElementKey = "";
    if (type == "element") {
        ArtifactData.elementKeys = artifactData.elementKeys;
        charElementKey = "element";
    }
    if (type == "path") {
        ArtifactData.elementKeys = artifactData.pathKeys;
        charElementKey = "path";
    }
    for (let charName in CharacterData) {
        let char = CharacterData[charName];
        let originChar = characterData[charName as keyof typeof characterData];
        char.element = originChar[charElementKey as ISrElementType];
    }
}

export { ArtifactData, CharacterData };
