<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useArtifactStore } from "@/store";

const artStore = useArtifactStore();

interface IOption {
    value: string | number;
    label: string;
}

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();
const show = computed<boolean>({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});
const element = ref("");
const character = ref("");
watch(
    () => artStore.game,
    () => {
        character.value = "";
    },
);
const characters = computed<IOption[]>(() => {
    let ret = [];
    for (let b of artStore.builds) {
        if (
            (b.key.startsWith("0") && element.value == "custom") ||
            (b.key in artStore.characterData &&
                artStore.characterData[b.key].element == element.value)
        ) {
            ret.push({
                value: b.key,
                label: b.name,
            });
        }
    }
    return ret;
});
const changeElement = () => {
    character.value = "";
};
const valid = computed(() => {
    return !!character.value;
});
const apply = () => {
    let b = artStore.builds.find((b) => b.key == character.value);
    if (b) {
        artStore.sort.set = [...b.set];
        artStore.artifactData.adjustSlotKeys.forEach((slotKey) => {
            artStore.sort.mainKey[slotKey] = [...b!.main[slotKey]];
        });
        artStore.sort.weight = { ...b.weight } as any;
    }
    emit("update:modelValue", false);
};
</script>

<template>
    <el-dialog :title="$t('ui.build_loader_title')" v-model="show">
        <p class="info" v-html="$t('ui.default_builds_source')" />
        <el-row justify="space-between">
            <el-col :span="8" v-text="$t(`ui.${artStore.elementType}`)" />
            <el-col :span="8">
                <el-select v-model="element" @change="changeElement">
                    <el-option
                        v-for="e in artStore.artifactData.elementKeys"
                        :label="
                            $t(
                                `artifact.${artStore.game}.${artStore.elementType}.${e}`,
                            )
                        "
                        :value="e"
                    />
                    <el-option :label="$t('ui.custom')" value="custom" />
                </el-select>
            </el-col>
        </el-row>
        <el-row justify="space-between">
            <el-col :span="8" v-text="$t('ui.character')" />
            <el-col :span="8">
                <el-select v-model="character">
                    <el-option
                        v-for="o in characters"
                        :label="o.label"
                        :value="o.value"
                    />
                </el-select>
            </el-col>
        </el-row>
        <el-row justify="center" style="margin-top: 30px">
            <el-button
                type="primary"
                @click="apply"
                :disabled="!valid"
                v-text="$t('ui.confirm')"
            />
        </el-row>
    </el-dialog>
</template>
