<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { i18n } from "@/i18n";
import { useArtifactStore } from "@/store";
import ArtifactCard from "@/components/widgets/ArtifactCard.vue";
import { Affix, Artifact } from "@/game/base/artifact";
import { GsArtifact } from "@/game/gs/artifact";
import { SrArtifact } from "@/game/sr/artifact";
import { gameManager } from "@/game/GameManager";

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
const affixes = computed(() => {
    return artStore.artifactData.minorKeys.map((key) => ({
        value: key,
        label: i18n.global.t(`artifact.${artStore.game}.affix.${key}`),
    }));
});

// 圣遗物对象
let defaultArt = new GsArtifact();
const art = ref<Artifact>(defaultArt);

// 套装
const sets = computed(() => {
    return artStore.artifactData.setKeys.map((key) => ({
        value: key,
        label: i18n.global.t(`artifact.${artStore.game}.set.${key}`),
    }));
});
// 部位
const slots = computed(() => {
    return artStore.artifactData.slotKeys.map((key) => ({
        value: key,
        label: i18n.global.t(`artifact.${artStore.game}.slot.${key}`),
    }));
});
const slot = computed({
    get() {
        return art.value.slot;
    },
    set(newSlot: string) {
        art.value.slot = newSlot;
        // 自动纠正主词条
        if (
            !artStore.artifactData.mainKeys[newSlot].includes(art.value.mainKey)
        ) {
            art.value.mainKey = artStore.artifactData.mainKeys[newSlot][0];
        }
    },
});
// 主词条（可选项依赖部位）
const mains = computed(() => {
    if (art.value.slot in artStore.artifactData.mainKeys) {
        return artStore.artifactData.mainKeys[art.value.slot].map(
            (key: string) => ({
                value: key,
                label: i18n.global.t(`artifact.${artStore.game}.affix.${key}`),
            }),
        );
    } else {
        return [];
    }
});
// 副词条（这里就不检查合法性了，太麻烦）
const minor1key = computed<string>({
    get() {
        return art.value.minors.length >= 1 ? art.value.minors[0].key : "";
    },
    set(key) {
        if (art.value.minors.length >= 1) art.value.minors[0].key = key;
        else art.value.minors.push(new Affix({ key, value: 0 }));
    },
});
const minor1value = computed<number>({
    get() {
        return art.value.minors.length >= 1 ? art.value.minors[0].value : 0;
    },
    set(value) {
        if (art.value.minors.length >= 1) art.value.minors[0].value = value;
        else art.value.minors.push(new Affix({ key: "atk", value }));
    },
});
const minor2key = computed<string>({
    get() {
        return art.value.minors.length >= 2 ? art.value.minors[1].key : "";
    },
    set(key) {
        if (art.value.minors.length >= 2) art.value.minors[1].key = key;
        else art.value.minors.push(new Affix({ key, value: 0 }));
    },
});
const minor2value = computed<number>({
    get() {
        return art.value.minors.length >= 2 ? art.value.minors[1].value : 0;
    },
    set(value) {
        if (art.value.minors.length >= 2) art.value.minors[1].value = value;
        else art.value.minors.push(new Affix({ key: "atk", value }));
    },
});
const minor3key = computed<string>({
    get() {
        return art.value.minors.length >= 3 ? art.value.minors[2].key : "";
    },
    set(key) {
        if (art.value.minors.length >= 3) art.value.minors[2].key = key;
        else art.value.minors.push(new Affix({ key, value: 0 }));
    },
});
const minor3value = computed<number>({
    get() {
        return art.value.minors.length >= 3 ? art.value.minors[2].value : 0;
    },
    set(value) {
        if (art.value.minors.length >= 3) art.value.minors[2].value = value;
        else art.value.minors.push(new Affix({ key: "atk", value }));
    },
});
const minor4key = computed<string>({
    get() {
        return art.value.minors.length >= 4 ? art.value.minors[3].key : "";
    },
    set(key) {
        if (key == "") {
            // 删除
            if (art.value.minors.length == 4) {
                art.value.minors.pop();
            }
        } else {
            if (art.value.minors.length >= 4) art.value.minors[3].key = key;
            else art.value.minors.push(new Affix({ key, value: 0 }));
        }
    },
});
const minor4value = computed<number>({
    get() {
        return art.value.minors.length >= 4 ? art.value.minors[3].value : 0;
    },
    set(value) {
        if (art.value.minors.length >= 4) art.value.minors[3].value = value;
        else art.value.minors.push(new Affix({ key: "atk", value }));
    },
});
// 简单检查圣遗物合法性，如果合法就添加该圣遗物
const valid = computed(() => {
    return (
        artStore.artifactData.setKeys.includes(art.value.set) &&
        art.value.minors.length >= 3
    );
});
const save = () => {
    // 必须新建一个对象
    let artifact;
    let artifactObj = gameManager.getArtifactObj();
    artifact = new artifactObj({
        set: art.value.set,
        slot: art.value.slot,
        level: art.value.level,
        mainKey: art.value.mainKey,
        minors: art.value.minors.map((m) => new Affix(m)),
    });
    artStore.addArtifacts([artifact]);
    emit("update:modelValue", false);
};
</script>

<template>
    <el-dialog v-model="show" :title="$t('ui.add_art_manually')" top="8vh">
        <el-divider>{{ $t("ui.main_attrs") }}</el-divider>
        <el-row :gutter="20">
            <el-col :span="3">
                <span>{{ $t("ui.art_set") }}</span>
            </el-col>
            <el-col :span="9">
                <el-select v-model="art.set">
                    <el-option
                        v-for="o in sets"
                        :value="o.value"
                        :label="o.label"
                    />
                </el-select>
            </el-col>
            <el-col :span="3">
                <span>{{ $t("ui.art_main") }}</span>
            </el-col>
            <el-col :span="9">
                <el-select v-model="art.mainKey">
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
                <span>{{ $t("ui.art_slot") }}</span>
            </el-col>
            <el-col :span="9">
                <el-select v-model="slot">
                    <el-option
                        v-for="o in slots"
                        :value="o.value"
                        :label="o.label"
                    />
                </el-select>
            </el-col>
            <el-col :span="3">
                <span>{{ $t("ui.art_level") }}</span>
            </el-col>
            <el-col :span="9">
                <el-input-number v-model="art.level" :min="0" :max="20" />
            </el-col>
        </el-row>
        <el-divider>{{ $t("ui.minor_affixes") }}</el-divider>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-select v-model="minor1key">
                    <el-option
                        v-for="o in affixes"
                        :label="o.label"
                        :value="o.value"
                    />
                </el-select>
            </el-col>
            <el-col :span="12">
                <el-input-number v-model="minor1value" :precision="1" />
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-select v-model="minor2key">
                    <el-option
                        v-for="o in affixes"
                        :label="o.label"
                        :value="o.value"
                    />
                </el-select>
            </el-col>
            <el-col :span="12">
                <el-input-number v-model="minor2value" :precision="1" />
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-select v-model="minor3key">
                    <el-option
                        v-for="o in affixes"
                        :label="o.label"
                        :value="o.value"
                    />
                </el-select>
            </el-col>
            <el-col :span="12">
                <el-input-number v-model="minor3value" :precision="1" />
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-select v-model="minor4key">
                    <el-option :label="$t('ui.empty')" value="" />
                    <el-option
                        v-for="o in affixes"
                        :label="o.label"
                        :value="o.value"
                    />
                </el-select>
            </el-col>
            <el-col :span="12">
                <el-input-number v-model="minor4value" :precision="1" />
            </el-col>
        </el-row>
        <el-divider>{{ $t("ui.preview") }}</el-divider>
        <el-row justify="center">
            <artifact-card :artifact="art" :readonly="true" />
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
