<script lang="ts" setup>
import { ref, computed, watch, reactive } from "vue";
import { CharacterData } from "@/ys/data";
import { useArtifactStore, useUiStore } from "@/store";
import { i18n } from "@/i18n";
import type { ICharKey } from "@/ys/types";
import draggable from "vuedraggable";

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits<{
    (e: "update:modelValue", v: boolean): void;
}>();

const artStore = useArtifactStore();

const groupOrigin = reactive({
    name: "itxst",
    put: false,
    pull: true,
});

const groupOutput = reactive({
    name: "itxst",
    put: true,
    pull: true,
});

const show = computed<boolean>({
    get() {
        return props.modelValue;
    },
    set(v) {
        emit("update:modelValue", v);
    },
});

const elements = ["pyro", "hydro", "cryo", "electro", "anemo", "geo", "dendro"]
    .map((e) => ({
        element: e,
        icon: `./assets/game_icons/${e}.webp`,
        text: i18n.global.t("element." + e),
    }))
    .concat([
        {
            element: "custom",
            icon: "",
            text: i18n.global.t("ui.custom"),
        },
    ]);

interface IAvatar {
    key: string;
    element: string;
    text: string;
    icon: string;
    rarity: number;
    bg: string;
}

function getAvatars() {
    let ret: { [e: string]: IAvatar[] } = {};
    let sotrageKeys = [];
    for (let a of artStore.customizedBuildSorts) {
        sotrageKeys.push(a.key);
    }

    for (let b of artStore.builds) {
        let element, icon, rarity, data;
        if (b.key.startsWith("0")) {
            element = "custom";
            icon = "./assets/char_faces/default.webp";
            rarity = 1;
        } else {
            data = CharacterData[b.key as ICharKey];
            element = data.element;
            icon = b.key.startsWith("Traveler")
                ? "./assets/char_faces/Traveler.webp"
                : `./assets/char_faces/${b.key}.webp`;
            rarity = data.rarity;
        }
        if (!(element in ret)) ret[element] = [] as IAvatar[];
        if (sotrageKeys.includes(b.key)) {
            continue;
        }

        ret[element].push({
            key: b.key,
            element: element,
            text: b.name,
            icon,
            rarity,
            bg: `./assets/bg${rarity}.webp`,
        });
    }
    for (let e in ret) {
        ret[e].sort((a: any, b: any) => b.rarity - a.rarity);
    }
    return ret;
}

const avatars = ref(getAvatars());
let a: any[] = [];
const outputAvatars = ref(artStore.customizedBuildSorts);

watch(
    outputAvatars,
    (newVal, oldVal) => {
        artStore.customizedBuildSorts = outputAvatars.value;
    },
    { deep: true },
);

const itemDbClick = (avatar: IAvatar) => {
    let originList = avatars.value;
    let outputList = outputAvatars.value;

    if (originList[avatar.element].includes(avatar)) {
        originList[avatar.element].splice(
            originList[avatar.element].indexOf(avatar),
            1,
        );
        outputList.push(avatar);
    } else if (outputList.includes(avatar)) {
        originList[avatar.element].push(avatar);
        originList[avatar.element].sort((a, b) => b.rarity - a.rarity);
        outputList = outputList.splice(outputList.indexOf(avatar), 1);
    }
};
</script>

<template>
    <el-dialog v-model="show" :title="$t('ui.char_sort')" top="2vh" width="90%">
        <div id="root">
            <div id="left">
                <div id="left-top">
                    <span>{{ $t("ui.build_order_editor_tip1") }}</span>
                </div>
                <div id="left-body">
                    <el-scrollbar>
                        <div
                            class="char-group"
                            :key="e.text"
                            v-for="e in elements"
                        >
                            <div class="group-hdr">
                                <img
                                    class="element-icon"
                                    :src="e.icon"
                                    v-if="e.icon"
                                />
                                <span class="element-text">{{ e.text }}</span>
                            </div>
                            <draggable
                                :list="avatars[e.element]"
                                animation="300"
                                item-key="text"
                                :group="groupOrigin"
                            >
                                <template #item="{ element }">
                                    <div
                                        class="avatar"
                                        @dblclick="itemDbClick(element)"
                                    >
                                        <span class="icon-wrapper">
                                            <img class="bg" :src="element.bg" />
                                            <img
                                                class="icon"
                                                :src="element.icon"
                                                :alt="element.text"
                                            />
                                        </span>
                                        <span>{{ element.text }}</span>
                                    </div>
                                </template>
                            </draggable>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
            <div id="right">
                <div id="right-top">
                    <span>{{ $t("ui.build_order_editor_tip2") }}</span>
                </div>
                <draggable
                    :list="outputAvatars"
                    animation="300"
                    item-key="text"
                    :group="groupOutput"
                    style="
                        width: 100%;
                        min-height: 60px;
                        border: 2px solid #1058ac;
                        color: #1058ac;
                    "
                >
                    <template #item="{ element }">
                        <div class="avatar" @dblclick="itemDbClick(element)">
                            <span class="icon-wrapper">
                                <img class="bg" :src="element.bg" />
                                <img
                                    class="icon"
                                    :src="element.icon"
                                    :alt="element.text"
                                />
                            </span>
                            <span>{{ element.text }}</span>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
#root {
    display: flex;
    align-items: stretch;
    height: 80vh;

    .avatar {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding: 5px;
        cursor: pointer;

        &.selected {
            background-color: #ffffeb;
            box-shadow: 0 0 0 1px #ac9710;
            border-radius: 5px;
        }

        .icon-wrapper {
            width: 60px;
            height: 60px;
            border-radius: 5px;
            overflow: hidden;
            position: relative;

            img {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 100%;
            }

            img.icon {
                margin-left: auto;
                margin-right: auto;
                transition: scale 100ms ease;
            }
        }

        &:hover > .icon-wrapper > img.icon {
            scale: 1.1;
        }
    }

    #left {
        border-right: 1px solid lightgray;
        flex: 0.5;
        display: flex;
        flex-flow: column;

        #left-top {
            height: 30px;

            .button {
                text-decoration: underline;
                margin-right: 10px;
                margin-bottom: 2px;
                cursor: pointer;

                &:hover {
                    color: #409eff;
                }
            }
        }

        #left-body {
            flex: 1;
            overflow: hidden;

            .char-group {
                padding-left: 2px;

                .group-hdr {
                    display: flex;
                    align-items: center;
                    background: rgb(255, 249, 238);
                    background: linear-gradient(
                        90deg,
                        rgba(255, 249, 238, 1) 0%,
                        rgba(255, 255, 255, 1) 100%
                    );

                    .element-icon {
                        width: 30px;
                    }

                    .element-text {
                        margin-left: 10px;
                    }
                }
            }
        }
    }

    #right {
        flex: 0.5;
        padding-left: 10px;
        overflow-y: hidden;

        .code {
            font-family: "Courier New", Courier, monospace;
        }

        #right-top {
            height: 30px;

            .button {
                text-decoration: underline;
                margin-right: 10px;
                margin-bottom: 2px;
                cursor: pointer;

                &:hover {
                    color: #409eff;
                }
            }
        }
    }
}
</style>
