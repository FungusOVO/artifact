import { gameUtils } from "@/game/GameUtils";
import { Artifact } from "@/game/base/artifact";
import { gameManager } from "@/game/GameManager";
import { CharacterData, ArtifactData } from "@/game/gs/data";
import { choice } from "@/utils";

// const charKeys = ["Traveler"].concat(
//     Object.keys(CharacterData).filter((k) => !k.startsWith("Traveler"))
// );

const charKeys = Object.keys(CharacterData).filter(
    (k) => !k.startsWith("Traveler"),
);

const testArts =
    process.env.NODE_ENV == "development"
        ? charKeys.map((key) => {
              let a = gameUtils.randArtifact({
                  set: choice(ArtifactData.setKeys),
              });
              a.location = key;
              return a;
          })
        : [];

export { testArts };
