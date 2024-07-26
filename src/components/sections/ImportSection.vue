<script lang="ts" setup>
import SectionTitle from "@/components/sections/SectionTitle.vue";
import TextButton from "@/components/widgets/TextButton.vue";
import ExportPreview from "@/components/dialogs/ExportPreview.vue";
import YasConfigurator from "../dialogs/YasConfigurator.vue";
import { nextTick, ref } from "vue";
import { useArtifactStore, useUiStore, useYasStore } from "@/store";
import { Artifact } from "@/game/base/artifact";
import { testArts } from "@/store/test";
import { i18n } from "@/i18n";
import * as GsFormat from "@/game/gs/ext";
import * as SrFormat from "@/game/sr/ext";
import { gameManager } from "@/game/GameManager";
import { ElMessageBox } from "element-plus";

const artStore = useArtifactStore();
const yasStore = useYasStore();
const uiStore = useUiStore();

const msg = ref("");
const ok = ref(false);

const importArts = async () => {
    if (yasStore.connected) {
        yasStore.sendScanReq();
        return;
    }

    try {
        let text = (await uiStore.importFile("text")) as string;
        let artifacts: Artifact[] = [],
            canExport = false,
            game = "gs";
        try {
            artifacts = GsFormat.GoodFormat.loads(text);
            canExport = artifacts.length > 0;
        } catch (e) {
            try {
                artifacts = GsFormat.MonaFormat.loads(text);
            } catch (e) {
                try {
                    artifacts = GsFormat.GenmoFormat.loads(text);
                } catch (e: any) {
                    try {
                        artifacts = SrFormat.MonaFormat.loads(text);
                        game = "sr";
                    } catch (e: any) {
                        try {
                            artifacts = SrFormat.HsrFormat.loads(text);
                            canExport = artifacts.length > 0;
                            game = "sr";
                        } catch (e: any) {
                            console.error(e);
                            msg.value = String(e);
                            ok.value = false;
                            return;
                        }
                    }
                }
            }
        }
        msg.value = i18n.global.t("ui.art_imported", {
            count: artifacts.length,
        });
        ok.value = true;
        artStore.setArtifacts(artifacts, canExport, game);
    } catch (e) {
        msg.value = String(e);
        ok.value = false;
    }
};
const openTutorial = () => {
    window.open("https://ideless.github.io/artifact/tutorial/", "_blank");
};
// 预览对话框
const showPreview = ref(false);
// 预览Yas配置器
const showYasConfig = ref(false);
// 测试
nextTick(() => {
    artStore.setArtifacts(testArts, false, "gs");
});
</script>

<template>
    <div class="section">
        <section-title :title="$t('ui.import')">
            <span
                @click="showYasConfig = true"
                v-if="yasStore.connected"
                v-text="$t('yas.config.name')"
            />
            <span @click="openTutorial" v-text="$t('ui.tutorial')" />
        </section-title>
        <div class="section-content">
            <template v-if="yasStore.connected">
                <text-button @click="importArts" v-text="$t('yas.scan.name')" />
                <text-button
                    style="margin-left: 20px"
                    @click="showPreview = true"
                    v-text="$t('yas.lock.name')"
                />
            </template>
            <template v-else>
                <text-button @click="importArts" v-text="$t('ui.import')" />
                <text-button
                    style="margin-left: 20px"
                    @click="showPreview = true"
                    :disabled="!artStore.canExport"
                    v-text="$t('ui.export')"
                />
            </template>
            <p
                :class="{
                    'import-msg': true,
                    ok,
                }"
                v-text="msg"
            />
        </div>
    </div>
    <export-preview v-model="showPreview" />
    <yas-configurator v-model="showYasConfig" />
</template>

<style lang="scss">
.import-msg {
    color: red;
    margin-top: 10px;

    &.ok {
        color: $green;
    }
}

.hidden {
    position: fixed;
    top: -999px;
}
</style>
