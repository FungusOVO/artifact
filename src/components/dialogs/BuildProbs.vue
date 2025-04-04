<script lang="ts" setup>
import { computed, watch, ref } from "vue";
import { useArtifactStore } from "@/store";
import { i18n } from "@/i18n";
import { Artifact } from "@/game/base/artifact";
import { IPBuildResult } from "@/game/base/sort";

const props = defineProps<{
    modelValue: boolean;
    art?: Artifact;
}>();
const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();
const show = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const artStore = useArtifactStore();

const buildProbsData = ref<
    Array<{
        name: string;
        prob: string;
    }>
>([]);

function updBuildProbsData() {
    if (!props.art) return false;
    if (!artStore.sortResults) return false;
    if (
        artStore.sortResultType !== "pbuild" &&
        artStore.sortResultType !== "porder"
    )
        return false;
    const result = artStore.sortResults.get(props.art) as IPBuildResult;
    if (!result) return false;
    let probs = [];
    for (let buildKey in result.buildProbs) {
        let b = artStore.builds.filter((b) => b.key == buildKey)[0];
        probs.push({
            name: b ? b.name : i18n.global.t("ui.unknown"),
            prob: result.buildProbs[buildKey],
            markScore: result.mark[buildKey].score,
            markClass: result.mark[buildKey].class,
        });
    }
    probs.sort((a, b) => b.prob - a.prob);
    buildProbsData.value = probs.map((x) => ({
        name: x.name,
        prob: (x.prob * 100).toFixed(1) + "%",
        markScore: x.markScore.toFixed(2),
        markClass: x.markClass,
    }));

    return true;
}

watch(
    () => props.modelValue,
    (value) => {
        if (!value) return;
        if (!updBuildProbsData()) {
            show.value = false;
        }
    },
);
</script>

<template>
    <el-dialog v-model="show" :title="$t('ui.build_probs_title')">
        <el-table :data="buildProbsData">
            <el-table-column prop="name" :label="$t('ui.build_name')" />
            <el-table-column prop="prob" :label="$t('ui.build_prob')" />
            <el-table-column prop="markScore" label="分数" />
            <el-table-column prop="markClass" label="评级" />
        </el-table>
    </el-dialog>
</template>
