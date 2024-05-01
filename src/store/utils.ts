import { RemovableRef, useLocalStorage } from "@vueuse/core";
import { gameManager } from "@/game/GameManager";
import { ComputedRef, ReactiveEffect, Ref, ref, UnwrapRef, watch } from "vue";
export function assign(a: { [k: string]: any }, b: any) {
    if (!b || typeof b != "object") return false;
    Object.keys(b).forEach((key) => {
        if (a.hasOwnProperty(key)) {
            (a as any)[key] = b[key];
        }
    });
    return true;
}

export function isSameArray(a: any[], b: any[]) {
    if (a.length != b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

export function isSameObject(a: any, b: any) {
    let aKeys = Object.keys(a);
    let bKeys = Object.keys(b);
    if (aKeys.length != bKeys.length) return false;
    for (let i = 0; i < aKeys.length; i++) {
        let key = aKeys[i];
        if (bKeys.indexOf(key) < 0) return false;
        if (a[key] != b[key]) return false;
    }
    return true;
}

export function isSame(a: any, b: any) {
    if (a == b) return true;
    if (a instanceof Array && b instanceof Array) {
        return isSameArray(a, b);
    } else if (typeof a == "object" && typeof b == "object") {
        return isSameObject(a, b);
    }
    return false;
}

export function gameLocalStorage<T>(
    key: string,
    defaultValue: T | { [key: string]: T },
): Ref<T> {
    let getDefaultValue = function (
        game: string,
        defaultValue: T | { [key: string]: T },
    ): T {
        if (
            defaultValue instanceof Object &&
            defaultValue.hasOwnProperty(game)
        ) {
            return (defaultValue as { [key: string]: T })[game] as T;
        } else {
            return defaultValue as T;
        }
    };

    let ret: Ref<T> = ref(defaultValue) as Ref<T>;
    let gameList: string[] = gameManager.getGameList();
    const storageList: Ref<T>[] = [];
    for (let game of gameList) {
        let fixKey = key;
        if (game != "gs") {
            fixKey = game + "." + key;
        }
        let storage;
        let fixDefaultVal = getDefaultValue(game, defaultValue) as T;
        storage = useLocalStorage(fixKey, fixDefaultVal);

        let curGame = gameManager.getGame();
        if (curGame == game) {
            ret.value = storage.value;
            for (let key in fixDefaultVal) {
                if (!ret.value[key] && fixDefaultVal[key]) {
                    ret.value[key] = fixDefaultVal[key];
                }
            }
        }
        storageList.push(storage);
    }

    watch(
        ret,
        (val) => {
            let curGame = gameManager.getGame();
            let storageIndex = gameList.indexOf(curGame);
            if (storageIndex > -1) {
                storageList[storageIndex].value = val;
            }
        },
        { immediate: true, deep: true },
    );

    watch(
        gameManager.getGameRef(),
        (curGame) => {
            let storageIndex = gameList.indexOf(curGame);
            if (storageIndex > -1) {
                ret.value = storageList[storageIndex].value;
            }
        },
        { immediate: true },
    );

    return ret;
}
