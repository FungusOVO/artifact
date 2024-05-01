<script lang="ts" setup>
import type { ICharOption } from "@/store/types";
import { IAvatar } from "@/game/base/types";
import { useArtifactStore } from "@/store";

const artStore = useArtifactStore();

const props = defineProps<{
    modelValue: IAvatar[];
    title?: string;
}>();
const emit = defineEmits<{
    (e: "update:modelValue", v: string[]): void;
}>();

const icon = (o: ICharOption) => {
    if (o.key == "") {
        return "./assets/forbidden.webp";
    } else if (o.key.startsWith("0")) {
        return `./assets/char_faces/${artStore.game}/default.webp`;
    } else if (o.key.startsWith("Traveler")) {
        return `./assets/char_faces/${artStore.game}/Traveler.webp`;
    } else {
        return `./assets/char_faces/${artStore.game}/${o.key}.webp`;
    }
};
</script>

<template>
    <div class="drop-select" ref="rootEl" tabindex="-1" role="button">
        <transition-group
            class="selected-options-wrapper"
            name="list"
            tag="div"
        >
            <img
                class="tag"
                v-for="o in modelValue"
                :src="icon(o)"
                alt=""
                :key="o.key"
            />
        </transition-group>
        <span class="title">{{ $t("ui.char_sort") }}</span>
    </div>
</template>

<style lang="scss" scoped>
.selected-options-wrapper {
    flex: 1;
    line-height: 0;
    // box-shadow: 0 0 1px 0 black;

    img.tag {
        display: inline-block;
        transition: all 100ms ease;
        height: 32px;
        margin: 2px;
        width: 32px;
        object-fit: contain;
    }
}

.drop-select {
    position: relative;
    display: inline-block;
    // height: $widget-height;
    box-shadow: 0 0 0 0 $primary-color;
    border: 2px solid $primary-color;
    // background-color: white;
    color: $primary-color;
    display: flex;
    align-items: center;
    padding: 8px;
    font-weight: unset;
    // border-radius: 3px;
    user-select: none;
    cursor: pointer;

    .selected-wrapper {
        flex: 1;
    }

    .select-arrow {
        margin: 0 2px;
        transform: rotate(0deg);
        transition: transform 200ms ease;
    }

    &.show {
        box-shadow: 0 0 4px 0 $primary-color;
        transition: box-shadow 100ms ease;

        .select-arrow {
            transform: rotate(180deg);
        }
    }

    .title {
        position: absolute;
        top: 0;
        left: 5px;
        font-size: 12px;
        font-weight: 100;
        transform: translateY(-50%);
        background-color: $right-bgcolor;
        line-height: 1;
        padding: 0 5px;
    }
}
</style>
