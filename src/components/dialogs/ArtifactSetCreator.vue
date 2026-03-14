<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useArtifactStore } from "@/store";
import { i18n } from "@/i18n";
import { choice } from "@/utils";
import { gameUtils } from "@/game/GameUtils";
import { Artifact } from "@/game/base/artifact";
import zhCN from "@/i18n/zhCN.json";
import { gameManager } from "@/game/GameManager";
import { ta } from "element-plus/es/locale";

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

const artStore = useArtifactStore();

type ArtifactSetConfig = {
    id: string;
    name: string;
    isEdit: boolean;
};

const defaultArtifactSetData = zhCN.artifact[gameManager.getGame()].set;
const customerArtifactSetData = artStore.customerArtifactSet;
let artifactSetData = Object.assign(
    defaultArtifactSetData,
    customerArtifactSetData,
);
let tableData = ref<ArtifactSetConfig[]>([]);
for (let key in artifactSetData) {
    tableData.value.push({
        id: key,
        name: artifactSetData[key],
        isEdit: false,
    });
}

const show = computed({
    get() {
        return props.modelValue;
    },
    set(value: boolean) {
        emit("update:modelValue", value);
    },
});

const add = () => {
    tableData.value.push({
        id: "",
        name: "",
        isEdit: true,
    });
};

const save = () => {
    for (let item of tableData.value) {
        if (item.isEdit) {
            if (!item.id || !item.name) {
                alert("ID和套装名不能为空");
                return;
            }
        }
    }
    for (let key in customerArtifactSetData) {
        delete customerArtifactSetData[key];
    }
    for (let item of tableData.value) {
        customerArtifactSetData[item.id] = item.name;
    }
    emit("update:modelValue", false);
    location.reload();
};
</script>

<template>
    <el-dialog v-model="show" :title="$t('ui.artifact_set_create')" top="8vh">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="ID">
                <template #default="scope">
                    <div v-if="!scope.row.isEdit">{{ scope.row.id }}</div>
                    <el-input v-else v-model="scope.row.id" />
                </template>
            </el-table-column>
            <el-table-column prop="name" label="套装名">
                <template #default="scope">
                    <div v-if="!scope.row.isEdit">{{ scope.row.name }}</div>
                    <el-input v-else v-model="scope.row.name" />
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template #default="scope">
                    <el-button
                        size="small"
                        @click="scope.row.isEdit = true"
                        v-text="$t('ui.edit_table')"
                    ></el-button>
                    <el-button
                        size="small"
                        type="danger"
                        @click="tableData.splice(scope.$index, 1)"
                        v-text="$t('ui.del')"
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row :gutter="20"></el-row>
        <el-row justify="center" style="margin-top: 30px">
            <el-button @click="add" v-text="$t('ui.add')" />
            <el-button type="primary" @click="save" v-text="$t('ui.confirm')" />
        </el-row>
    </el-dialog>
</template>

<style lang="scss"></style>
