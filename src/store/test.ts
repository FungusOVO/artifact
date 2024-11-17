import { gameManager } from "@/game/GameManager";
import { gameUtils } from "@/game/GameUtils";
import { CharacterData } from "@/game/sr/data";

// const charKeys = ["Traveler"].concat(
//     Object.keys(CharacterData).filter((k) => !k.startsWith("Traveler"))
// );

// window.gameManager = gameManager;
// gameManager.setGame("sr");

const charKeys = Object.keys(CharacterData).filter(
    (k) => !k.startsWith("Traveler"),
);

const testArts =
    process.env.NODE_ENV == "development"
        ? charKeys.map((key) => {
              let a = gameUtils.randArtifact({});
              a.location = key;
              return a;
          })
        : [];

export { testArts };
