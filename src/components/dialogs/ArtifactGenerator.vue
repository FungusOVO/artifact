<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useArtifactStore } from "@/store";
import { i18n } from "@/i18n";
import { choice } from "@/utils";
import { gameUtils } from "@/game/GameUtils";
import { Artifact } from "@/game/base/artifact";

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

const artStore = useArtifactStore();

const show = computed({
    get() {
        return props.modelValue;
    },
    set(value: boolean) {
        emit("update:modelValue", value);
    },
});
// 套装
const sets = computed(() => {
    return artStore.artifactData.setKeys.map((key) => ({
        value: key,
        label: i18n.global.t(`artifact.${artStore.game}.set.${key}`),
    }));
});
const setCands = ref<string[]>([]);
// 部位
const slots = computed(() => {
    return artStore.artifactData.slotKeys.map((key) => ({
        value: key,
        label: i18n.global.t(`artifact.${artStore.game}.slot.${key}`),
    }));
});
const slot = ref(""); // ''表示任意部位
watch(slot, () => {
    if (slot.value in artStore.artifactData.mainKeys) {
        if (!artStore.artifactData.mainKeys[slot.value].includes(mainKey.value))
            mainKey.value = "";
    } else {
        mainKey.value = "";
    }
});
// 主词条（可选项依赖部位）
const mains = computed(() => {
    if (slot.value in artStore.artifactData.mainKeys) {
        return artStore.artifactData.mainKeys[slot.value].map(
            (key: string) => ({
                value: key,
                label: i18n.global.t(`artifact.${artStore.game}.affix.${key}`),
            }),
        );
    } else {
        return [];
    }
});
const mainKey = ref(""); // ''表示任意主词条
// 等级
const level = ref(0);
// 个数
const count = ref(1);
// 简单检查合法性
const valid = computed(() => {
    return setCands.value.length;
});
const save = () => {
    let artifacts: Artifact[] = [];
    for (let i = 0; i < count.value; ++i) {
        let set = choice(setCands.value),
            rarity = artStore.artifactData.setKeysR4?.includes(set) ? 4 : 5;
        artifacts.push(
            gameUtils.randArtifact({
                set,
                slot: slot.value,
                mainKey: mainKey.value,
                rarity,
                level: level.value,
            }),
        );
    }
    artStore.addArtifacts(artifacts);
    emit("update:modelValue", false);
};
</script>

<template>
    <el-dialog v-model="show" :title="$t('ui.rand_art_generator')" top="8vh">
        <el-row :gutter="20">
            <el-col :span="3">
                <span>{{ $t("ui.art_set") }}</span>
            </el-col>
            <el-col :span="21">
                <el-select
                    v-model="setCands"
                    multiple
                    clearable
                    style="width: 100%"
                >
                    <el-option
                        v-for="o in sets"
                        :value="o.value"
                        :label="o.label"
                    />
                </el-select>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="3">
                <span>{{ $t("ui.art_slot") }}</span>
            </el-col>
            <el-col :span="9">
                <el-select v-model="slot">
                    <el-option value="" :label="$t('ui.any')" />
                    <el-option
                        v-for="o in slots"
                        :value="o.value"
                        :label="o.label"
                    />
                </el-select>
            </el-col>
            <el-col :span="3">
                <span>{{ $t("ui.art_main") }}</span>
            </el-col>
            <el-col :span="9">
                <el-select v-model="mainKey">
                    <el-option value="" :label="$t('ui.any')" />
                    <el-option
                        v-for="o in mains"
                        :value="o.value"
                        :label="o.label"
                    />
                </el-select>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="3">
                <span>{{ $t("ui.art_level") }}</span>
            </el-col>
            <el-col :span="9">
                <el-input-number v-model="level" :min="0" :max="20" />
            </el-col>
            <el-col :span="3">
                <span>{{ $t("ui.count") }}</span>
            </el-col>
            <el-col :span="9">
                <el-input-number v-model="count" :min="1" />
            </el-col>
        </el-row>
        <el-row justify="center" style="margin-top: 30px">
            <el-button
                type="primary"
                :disabled="!valid"
                @click="save"
                v-text="$t('ui.confirm')"
            />
        </el-row>
    </el-dialog>
</template>

<style lang="scss"></style>
