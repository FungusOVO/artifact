<script lang="ts" setup>
import SectionTitle from "@/components/sections/SectionTitle.vue";
import SingleSelect from "@/components/widgets/SingleSelect.vue";
import MultiSelect from "@/components/widgets/MultiSelect.vue";
import CharSelect from "@/components/widgets/CharSelect.vue";
import CharSort from "@/components/widgets/CharSort.vue";
import BuildLoader from "@/components/dialogs/BuildLoader.vue";
import BuildEditor from "@/components/dialogs/BuildEditor.vue";
import ValueButton from "@/components/widgets/ValueButton.vue";
import AffnumTable from "../dialogs/AffnumTable.vue";
import { computed, ref, watch } from "vue";
import { useArtifactStore, SortByKeys } from "@/store";
import { i18n } from "@/i18n";
import type { IOption, ICharOption } from "@/store/types";

const artStore = useArtifactStore();

// 排序方式
const sortByOptions = SortByKeys.filter((key) => {
    if (artStore.game == "sr") {
        if (["avgpro"].includes(key)) {
            return false;
        }
    }
    return true;
}).map((key) => ({
    key,
    label: i18n.global.t(`sort.${key}.name`),
}));

// 按满级期望词条数
const multiplierOptions = [
    {
        key: "1",
        label: i18n.global.t("ui.multiplier_max"),
    },
    {
        key: "1/0.85",
        label: i18n.global.t("ui.multiplier_avg"),
    },
    {
        key: "7.8",
        label: i18n.global.t("ui.multiplier_crit"),
    },
];

// 按角色适配概率（多人）
const charOptions = computed(() => {
    return artStore.builds.map((b) => ({ key: b.key, name: b.name }));
});
const pBuildSortByOptions = ["max", "owner"].map((key) => ({
    key,
    label: i18n.global.t(`sort.pmulti.sortBy.${key}`),
}));
const artiWeightCalTypeOptions = [
    {
        key: "prob",
        label: i18n.global.t("sort.index.prob"),
    },
    {
        key: "mark",
        label: i18n.global.t("sort.index.mark"),
    },
];

const artiProbCalTypeOptions = [
    {
        key: "avg",
        label: i18n.global.t("ui.avg"),
    },
    {
        key: "max",
        label: i18n.global.t("ui.max"),
    },
    {
        key: "min",
        label: i18n.global.t("ui.min"),
    },
];

// 按角色适配概率（单人）
const setsOptions = computed(() => {
    return Object.keys(artStore.artifactData.setGroups)
        .map((key) => ({
            key,
            label: i18n.global.t(`artifact.${artStore.game}.set_group.${key}`),
        }))
        .concat(
            artStore.artifactData.setKeys.map((key: string) => ({
                key,
                label: i18n.global.t(`artifact.${artStore.game}.set.${key}`),
                icon: `./assets/artifacts/${artStore.game}/${key}/flower.webp`,
            })),
        );
});

const adjustSlotOptions = computed(() => {
    let options: {
        [slotKey: string]: IOption[];
    } = {};
    artStore.artifactData.adjustSlotKeys.map((slotKey) => {
        options[slotKey] = artStore.artifactData.mainKeys[slotKey].map(
            (m: any) => ({
                key: m,
                label: i18n.global.t(`artifact.${artStore.game}.affix.${m}`),
            }),
        );
    });
    return options;
});

// 按上位替代数
// 按装备提升概率
const pEquipCharOptions = ref<ICharOption[]>([]);
watch(
    () => artStore.artifacts,
    () => {
        const options: ICharOption[] = [],
            equipCount = new Map<string, number>();
        artStore.artifacts.forEach(
            (a: { rarity: number; level: number; location: string }) => {
                if (a.rarity != 5) {
                    if (artStore.game == "gs" && a.level != 20) {
                        return;
                    }
                    if (artStore.game == "sr" && a.level != 15) {
                        return;
                    }
                }
                if (!a.location || !(a.location in artStore.characterData))
                    return;
                if (!equipCount.has(a.location)) {
                    equipCount.set(a.location, 0);
                }
                equipCount.set(a.location, equipCount.get(a.location)! + 1);
            },
        );
        equipCount.forEach((count, charKey) => {
            options.push({
                key: charKey,
                name: i18n.global.t(`character.${artStore.game}.${charKey}`),
                tip: count.toString(),
            });
        });
        pEquipCharOptions.value = options;
        artStore.pEquipCharKeys = options.map((o) => o.key);
    },
    { immediate: true },
);
// 不排序

// 配装加载窗口
const showBuildLoader = ref(false);
const openBuildLoader = () => (showBuildLoader.value = true);

const showBuildEditor = ref(false);
const openBuildEditor = () => (showBuildEditor.value = true);

const showAffnumTable = ref(false);
const openAffnumTable = () => (showAffnumTable.value = true);

const showBuildOrderEditor = ref(false);
const openBuildOrderEditor = () => (showBuildOrderEditor.value = true);

const isShowIgnoreIndividual = computed(() => {
    return ["pmulti", "psingle", "pequip"].includes(artStore.sort.by);
});

const isShowBuildEditor = computed(() => {
    return ["pmulti"].includes(artStore.sort.by);
});

const isShowArtiWeightCalType = computed(() => {
    return ["pmulti", "psingle", "porder"].includes(artStore.sort.by);
});
</script>

<template>
    <div class="section">
        <section-title :title="$t('ui.sort')" />
        <div class="content">
            <single-select
                class="row"
                v-model="artStore.sort.by"
                :options="sortByOptions"
                :title="$t('ui.sortby')"
            />
            <div
                v-if="
                    artStore.sort.by == 'avg' ||
                    artStore.sort.by == 'min' ||
                    artStore.sort.by == 'max'
                "
            >
                <p class="row small" v-text="$t('sort.avg.desc')" />
                <p class="row small">
                    <span
                        class="text-btn"
                        @click="openBuildLoader"
                        v-text="$t('ui.load_preset')"
                        role="button"
                    />
                </p>
                <p
                    class="info"
                    style="margin-top: 10px"
                    v-text="$t('ui.weight_btn_help')"
                />
                <value-button
                    class="weight-button"
                    v-for="(_, key) in artStore.sort.weight"
                    v-model="artStore.sort.weight[key]"
                >
                    {{ $t(`artifact.${artStore.game}.affix.${key}`) }}
                </value-button>
                <single-select
                    :title="$t('ui.multiplier')"
                    :options="multiplierOptions"
                    v-model="artStore.affnumMultiplierKey"
                    style="margin-top: 10px"
                />
            </div>
            <div v-else-if="artStore.sort.by == 'avgpro'">
                <p class="row small" v-text="$t('sort.avg.desc')" />
                <p class="row small" v-text="$t('sort.avgpro.desc')" />
                <p class="row small">
                    <span
                        class="text-btn"
                        v-text="$t('ui.edit_table')"
                        @click="openAffnumTable"
                    />
                </p>
                <single-select
                    :title="$t('ui.multiplier')"
                    :options="multiplierOptions"
                    v-model="artStore.affnumMultiplierKey"
                    style="margin-top: 10px"
                />
            </div>
            <div v-else-if="artStore.sort.by == 'pmulti'">
                <p class="row small" v-text="$t('sort.pmulti.desc')" />
                <p class="row small" v-html="$t('sort.pmulti.desc2')" />
                <p class="row small">
                    <span
                        class="text-btn"
                        @click="openBuildEditor"
                        v-text="$t('ui.edit_builds')"
                        role="button"
                    />
                </p>
                <single-select
                    :title="$t('ui.pbuild_sort_by')"
                    :options="pBuildSortByOptions"
                    v-model="artStore.pBuildSortBy"
                    style="margin-top: 10px"
                />
            </div>
            <div v-else-if="artStore.sort.by == 'psingle'">
                <p class="row small" v-text="$t('sort.pmulti.desc')" />
                <p class="row small">
                    <span
                        class="text-btn"
                        @click="openBuildEditor"
                        style="margin-right: 8px"
                        v-text="$t('ui.edit_builds')"
                        role="button"
                    />
                    <span
                        class="text-btn"
                        @click="openBuildLoader"
                        v-text="$t('ui.load_build')"
                        role="button"
                    />
                </p>
                <p
                    class="info"
                    style="margin-top: 10px"
                    v-text="$t('ui.weight_btn_help')"
                />
                <value-button
                    class="weight-button"
                    v-for="(_, key) in artStore.sort.weight"
                    :key="key"
                    v-model="artStore.sort.weight[key]"
                >
                    {{ $t(`artifact.${artStore.game}.affix.${key}`) }}
                </value-button>
                <multi-select
                    class="row"
                    v-model="artStore.sort.set"
                    :options="setsOptions"
                    :title="$t('sort.psingle.set')"
                />
                <multi-select
                    class="row"
                    v-for="slotKey in artStore.artifactData.adjustSlotKeys"
                    :key="slotKey"
                    v-model="artStore.sort.mainKey[slotKey]"
                    :options="adjustSlotOptions[slotKey]"
                    :title="
                        $t(`artifact.${artStore.game}.slot.${slotKey}`) +
                        $t(`sort.psingle.set`)
                    "
                />
            </div>
            <div v-else-if="artStore.sort.by == 'pequip'">
                <p class="row small" v-text="$t('sort.pequip.desc')" />
                <p class="row small">
                    <span
                        class="text-btn"
                        @click="openBuildEditor"
                        style="margin-right: 8px"
                        v-text="$t('ui.edit_builds')"
                        role="button"
                    />
                </p>
                <char-select
                    class="row"
                    :title="$t('ui.equip_char_filter')"
                    :options="pEquipCharOptions"
                    v-model="artStore.pEquipCharKeys"
                />
            </div>
            <div v-else-if="artStore.sort.by == 'defeat'">
                <p class="row small" v-text="$t('sort.defeat.desc')" />
            </div>
            <div v-show="isShowBuildEditor">
                <char-select
                    class="row"
                    :title="$t('ui.build')"
                    :options="charOptions"
                    v-model="artStore.sort.buildKeys"
                />
            </div>
            <div v-show="artStore.sort.by == 'porder'">
                <div class="info" style="margin-top: 10px">
                    {{ $t("ui.porder_update_help") }}
                </div>
                <p class="row small">
                    <span
                        class="text-btn"
                        @click="openBuildEditor"
                        v-text="$t('ui.edit_builds')"
                        role="button"
                    />
                </p>
                <char-sort
                    class="row"
                    @click="openBuildOrderEditor"
                    v-model="artStore.customizedBuildSorts"
                />
            </div>
            <div v-show="isShowArtiWeightCalType">
                <single-select
                    :title="$t('ui.arti_weight_cal_type')"
                    :options="artiWeightCalTypeOptions"
                    :desc="$t('sort.index.weight_cal_desc')"
                    v-model="artStore.calArtiWeightType"
                    style="margin-top: 10px"
                />
            </div>
            <div v-show="isShowArtiWeightCalType">
                <single-select
                    :title="$t('ui.arti_prob_cal_type')"
                    :options="artiProbCalTypeOptions"
                    v-model="artStore.calArtiProbType"
                    style="margin-top: 10px"
                />
            </div>
            <div v-show="isShowIgnoreIndividual">
                <p style="text-align: center">
                    <el-checkbox
                        v-model="artStore.pBuildIgnoreIndividual"
                        :label="$t('ui.pbuild_ignore_individual')"
                    />
                </p>
            </div>
            <div v-show="isShowArtiWeightCalType">
                <p style="text-align: center">
                    <el-checkbox
                        v-model="artStore.pBuildIgnoreSmallWeight"
                        :label="$t('ui.pbuild_ignore_update_small_weight')"
                    />
                </p>
            </div>
        </div>
    </div>
    <build-loader v-model="showBuildLoader" />
    <build-editor v-model="showBuildEditor" />
    <affnum-table v-model="showAffnumTable" />
    <build-order-editor v-model="showBuildOrderEditor" />
</template>

<style lang="scss" scoped>
.info-wrapper {
    font-size: 12px;

    p {
        margin: 4px;
    }
}

.content {
    margin-top: 24px;
    padding: 0 10px;

    .row {
        margin-top: 15px;
    }

    .small {
        font-size: 12px;
        color: gray;
        margin-top: 10px;
        text-align: center;
    }

    .text-btn {
        color: $primary-color;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .weight-button {
        margin: 10px 10px 0 0;
    }
}
</style>
