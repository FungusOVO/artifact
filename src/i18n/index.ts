import { createI18n } from "vue-i18n";
import zhCN from "./zhCN.json";
import { gameManager } from "@/game/GameManager";
import { useLocalStorage } from "@vueuse/core";

let gsCustomerArtifactSet = useLocalStorage("customerArtifactSet", {});

zhCN.artifact.gs.set = Object.assign(
    {},
    zhCN.artifact.gs.set,
    gsCustomerArtifactSet.value,
);

let srCustomerArtifactSet = useLocalStorage("sr.customerArtifactSet", {});
zhCN.artifact.sr.set = Object.assign(
    {},
    zhCN.artifact.sr.set,
    srCustomerArtifactSet.value,
);

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
