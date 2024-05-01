import { ArtifactData, CharacterData } from "@/game/gs/data";
import { IArtifactData, ICharacterData } from "@/game/base/data/type";
import { PBuildSort } from "@/game/base/sort/pbuild";

export class GsPBuildSort extends PBuildSort {
    ArtifactData: IArtifactData = ArtifactData;
    CharacterData: ICharacterData = CharacterData;
}
