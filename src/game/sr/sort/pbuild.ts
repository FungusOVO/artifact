import { ArtifactData, CharacterData } from "../data";
import { IArtifactData, ICharacterData } from "@/game/base/data/type";
import { PBuildSort } from "@/game/base/sort/pbuild";

export class SrPBuildSort extends PBuildSort {
    ArtifactData: IArtifactData = ArtifactData;
    CharacterData: ICharacterData = CharacterData;
}
