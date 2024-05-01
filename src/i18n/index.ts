import { createI18n } from "vue-i18n";
import zhCN from "./zhCN.json";
import { gameManager } from "@/game/GameManager";

export const i18n = createI18n({
    locale: "zhCN",
    messages: {
        zhCN,
    },
    modifiers: {
        artifact: (v) => {
            if (gameManager.game == "gs") {
                return "圣遗物";
            }
            if (gameManager.game == "sr") {
                return "遗器";
            }
            return "";
        },
    },
});
