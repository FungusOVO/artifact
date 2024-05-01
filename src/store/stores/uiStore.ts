import { defineStore } from "pinia";
import { ref } from "vue";
import { i18n } from "@/i18n";
import { ElMessageBox, ElMessage } from "element-plus";
import type { FormItemRule } from "element-plus";
import { useLocalStorage } from "@vueuse/core";

type AlertType = "info" | "success" | "warning" | "error";

export const useUiStore = defineStore("ui", () => {
    // show loading indicator or not
    const loading = ref(false);
    const nReload = ref(0);
    // user onboarding
    const onboarding = useLocalStorage("onboarding", {
        importArts: true,
        selectArts: true,
    });

    /** run a worker function with a delay */
    function run(worker: () => void, delay = 250) {
        loading.value = true;
        setTimeout(() => {
            try {
                worker();
            } catch (e) {
                console.error(e);
                alert(String(e), "error");
            }
            loading.value = false;
            nReload.value++;
        }, delay);
    }

    /** show a message */
    function alert(message: string, type: AlertType = "info") {
        ElMessage({ message, type });
    }

    /** pop confirm box */
    function popConfirm(msg: string) {
        return ElMessageBox.confirm(msg, i18n.global.t("ui.warning"), {
            confirmButtonText: i18n.global.t("ui.confirm"),
            cancelButtonText: i18n.global.t("ui.cancel"),
            type: "warning",
        });
    }

    /** ElFormItem rule */
    function getFormRule(
        required = true,
        validator?: any,
        trigger = "blur",
    ): FormItemRule[] {
        if (validator) {
            return [
                {
                    required,
                    validator,
                    trigger,
                },
            ];
        } else {
            return [
                {
                    required,
                    message: i18n.global.t("ui.required"),
                    trigger,
                },
            ];
        }
    }

    /** pop onboarding dialog */
    function popOnboardingDialog(key: string) {
        if (!(key in onboarding.value) || !(onboarding.value as any)[key])
            return Promise.resolve();
        return ElMessageBox.confirm(i18n.global.t("onboarding." + key), "", {
            confirmButtonText: i18n.global.t("ui.do_not_show_again"),
            showCancelButton: false,
            dangerouslyUseHTMLString: true,
            type: "info",
        })
            .then(() => {
                (onboarding.value as any)[key] = false;
            })
            .catch(() => {});
    }

    /** open and read file */
    function importFile(type: "buffer" | "text") {
        return new Promise((resolve, reject) => {
            const input: HTMLInputElement = document.createElement("input");

            // config
            input.type = "file";
            input.multiple = false;

            input.onchange = (ev) => {
                if (!input.files || input.files.length == 0) return;

                const file = input.files[0];
                const reader = new FileReader();

                reader.onload = (ev) => resolve(reader.result);
                reader.onerror = (ev) => reject(reader.error);

                if (type == "buffer") {
                    reader.readAsArrayBuffer(file);
                } else if (type == "text") {
                    reader.readAsText(file, "utf-8");
                } else {
                    reject("unknown type");
                }
            };

            input.click();
        });
    }

    /** save text as file */
    function exportFile(filename: string, content: string) {
        let element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(content),
        );
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return {
        loading,
        nReload,
        run,
        alert,
        popConfirm,
        getFormRule,
        popOnboardingDialog,
        importFile,
        exportFile,
    };
});
