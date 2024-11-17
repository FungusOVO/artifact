import { ISrElementType } from "./../../game/sr/data/index";
import { IArtifactData, ICharacterData } from "@/game/base/data/type";
import { NormalSort } from "@/game/base/sort/normal";
import { IElementType, IGameKey, gameManager } from "@/game/GameManager";
import { Affix, Artifact } from "@/game/base/artifact";
import { defineStore } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import { useUiStore } from "./uiStore";
import filterRules from "../filterRules";
import { useLocalStorage } from "@vueuse/core";
import { i18n } from "@/i18n";
import {
    IAffixWeightTable,
    IAffnumResults,
    IBuild,
    ICharKey,
    IDefeatResults,
    IPBuildResults,
    IPBuildSortBy,
    IPEquipResults,
    IPOrderResults,
    ISetBonusTable,
} from "@/game/base/types";
import { DefaultAffixWeightTable, DefaultSetBonusTable } from "@/game/gs/data";
import {
    AffnumSort,
    DefeatSort,
    ICalProbType,
    ICalWeightType,
    ISlotBestArt,
    PBuildSort,
    PEquipSort,
    POrder,
} from "@/game/base/sort";
import { gameLocalStorage } from "../utils";

export const SortByKeys = [
    "avg",
    "avgpro",
    "min",
    "max",
    "psingle",
    "pmulti",
    "pequip",
    "porder",
    "defeat",
    "set",
    "index",
] as const;

export type ISortBy = (typeof SortByKeys)[number];

// 排序方式
export type ISortResultType =
    | "affnum"
    | "pbuild"
    | "defeat"
    | "pequip"
    | "porder";

export const useArtifactStore = defineStore("artifact", () => {
    const uiStore = useUiStore();

    const artifacts = ref<Artifact[]>([]);
    const processedArtifacts = ref<Artifact[]>([]);
    const filter = reactive({
        set: [] as string[],
        slot: [] as string[],
        main: [] as string[],
        lock: [] as string[],
        lvRange: [0, 20],
        pro: false,
        location: [] as string[],
        ruleId: 0,
    });

    type ISort = {
        by: ISortBy;
        weight: { [key: string]: number };
        buildKeys: string[];
        set: string[];
        mainKey: {
            [slotKey: string]: string[];
        };
    };

    const sort = gameLocalStorage<ISort>("sort", {
        gs: {
            by: "avg" as ISortBy,
            weight: {
                hp: 0,
                atk: 0,
                def: 0,
                hpp: 0,
                atkp: 0.75,
                defp: 0,
                em: 0.75,
                er: 0.55,
                cr: 1,
                cd: 1,
            },
            buildKeys: [] as string[],
            set: [] as string[],
            mainKey: { sands: [], goblet: [], circlet: [] },
        },
        sr: {
            by: "avg" as ISortBy,
            weight: {
                hp: 0,
                hpp: 0,
                atk: 0,
                atkp: 0.75,
                def: 0,
                defp: 0,
                spd: 0.75,
                cr: 1,
                cd: 1,
                be: 0,
                er: 0.5,
                eh: 0,
                eres: 0,
            },
            buildKeys: [] as string[],
            set: [] as string[],
            mainKey: { Body: [], Feet: [], PlanarSphere: [], LinkRope: [] },
        },
    });
    const pBuildSortBy = ref<IPBuildSortBy>("max"); // 未满级圣遗物计算方式
    const pBuildIgnoreIndividual = ref(false); // 是否忽略散件
    const pBuildIgnoreSmallWeight = ref(false); // 是否忽略自动更新小词条
    const pEquipCharKeys = ref<string[]>([]);
    const customizedBuilds = gameLocalStorage<IBuild[]>(
        "customized_builds",
        [],
    );
    const customizedBuildSorts = gameLocalStorage<any[]>(
        "customizedBuildSorts",
        [],
    );

    const builds = computed(() => {
        let ret: IBuild[] = [];
        let CharacterData = gameManager.getCharacterData();

        let cbuildMap = new Map<string, IBuild>();
        for (let b of customizedBuilds.value) {
            cbuildMap.set(b.key, b);
        }

        // default builds from data, some replaced by customized builds
        for (let key in CharacterData) {
            if (cbuildMap.has(key)) {
                ret.push(cbuildMap.get(key)!);
            } else {
                let c = CharacterData[key];
                let charBuild = c.build as {
                    set: string[];
                    setList: string[][];
                    main: any;
                    weight: any;
                };
                let mainKey: {
                    [key: string]: string[];
                } = {};
                for (let slotKey of gameManager.getArtifactData()
                    .adjustSlotKeys) {
                    mainKey[slotKey] = [...charBuild.main[slotKey]];
                }
                ret.push({
                    key,
                    name: i18n.global.t(`character.${game.value}.${key}`),
                    set: charBuild.setList.flat(),
                    setList: charBuild.setList,
                    main: mainKey,
                    weight: { ...charBuild.weight },
                });
            }
        }

        // custom builds
        for (let b of customizedBuilds.value) {
            if (b.key.startsWith("0")) ret.push(b);
        }
        return ret;
    });
    const setBonusTable = useLocalStorage<ISetBonusTable>(
        "set_bonus_table",
        DefaultSetBonusTable,
    );
    const affixWeightTable = useLocalStorage<IAffixWeightTable>(
        "affix_weight_table",
        DefaultAffixWeightTable,
    );
    const sortResults = ref<
        IAffnumResults | IPBuildResults | IDefeatResults | IPEquipResults
    >();
    const orderResults = ref<IPOrderResults>();
    const sortResultType = ref<ISortResultType>();
    const canExport = ref(false);
    const artMode = reactive({
        normalize: false,
        reverseOrder: false,
        alikeEnabled: true,
    });
    const affnumMultiplierKey = useLocalStorage(
        "affnum_multiplier_key",
        "1/0.85",
    );
    const affnumMultiplier = computed(() => {
        switch (affnumMultiplierKey.value) {
            case "1":
                return 1;
            case "1/0.85":
                return 1 / 0.85;
            case "7.8":
                return 7.8;
            default:
                return 1;
        }
    });
    const setTypeCount = ref<{ [key: string]: number }>({});

    const calArtiWeightType = gameLocalStorage<ICalWeightType>(
        "calArtiWeightType",
        "prob",
    ); // 按概率计算还是评分
    const calArtiProbType = gameLocalStorage<ICalProbType>(
        "calArtiProbType",
        "avg",
    ); // 未满级圣遗物计算方式

    const game = ref<IGameKey>(gameManager.getGame());
    const artifactData = ref<IArtifactData>(gameManager.getArtifactData());
    const characterData = ref<ICharacterData>(gameManager.getCharacterData());
    const elementType = gameLocalStorage<IElementType>(
        "elementType",
        "element",
    );

    watch(
        gameManager.getGameRef(),
        () => {
            game.value = gameManager.getGame();
            artifactData.value = gameManager.getArtifactData();
            characterData.value = gameManager.getCharacterData();
            updateElementType();
        },
        { immediate: true },
    );

    /** reset filter */
    function resetFilter() {
        let s_set = new Set<string>(),
            s_slot = new Set<string>(),
            s_main = new Set<string>(),
            s_lock = new Set<string>(),
            s_location = new Set<string>();
        artifacts.value.forEach((a) => {
            s_set.add(a.set);
            s_slot.add(a.slot);
            s_main.add(a.mainKey);
            s_lock.add(String(a.lock));
            s_location.add(a.location);
        });
        filter.set = Array.from(s_set);
        filter.slot = Array.from(s_slot);
        filter.main = Array.from(s_main);
        filter.lock = Array.from(s_lock);
        filter.location = Array.from(s_location);
        filter.lvRange = [0, 20];
    }

    /** set artifacts, filter & sort them automatically */
    function setArtifacts(
        _artifacts: Artifact[],
        _canExport: boolean,
        game: string,
    ) {
        artifacts.value = []; // TODO
        gameManager.setGame(game);
        artifacts.value = _artifacts;
        canExport.value = _canExport;
        resetFilter();
        filterAndSort();
    }

    /** filter and sort artifacts */
    function filterAndSort() {
        uiStore.run(() => {
            let affnumSort = gameManager.getSort<AffnumSort>(AffnumSort);
            let pBuildSort = gameManager.getSort<PBuildSort>(PBuildSort);
            let pOrder = gameManager.getSort<POrder>(POrder);
            let pEquipSort = gameManager.getSort<PEquipSort>(PEquipSort);
            let defeatSort = gameManager.getSort<DefeatSort>(DefeatSort);
            let normalSort = gameManager.getSort<NormalSort>(NormalSort);

            let arts: Artifact[] = [];
            // build countByType
            setTypeCount.value = {};
            artifacts.value.forEach((a) => {
                let key = `${a.set}:${a.slot}_${a.mainKey}`;
                setTypeCount.value[key] = (setTypeCount.value[key] || 0) + 1;
                key = `*:${a.slot}_${a.mainKey}`;
                setTypeCount.value[key] = (setTypeCount.value[key] || 0) + 1;
            });
            // filter
            for (let a of artifacts.value) {
                if (!filter.set.includes(a.set)) continue;
                if (!filter.slot.includes(a.slot)) continue;
                if (!filter.main.includes(a.mainKey)) continue;
                if (!filter.lock.includes(a.lock.toString())) continue;
                if (a.level < filter.lvRange[0] || a.level > filter.lvRange[1])
                    continue;
                if (filter.pro && !filter.location.includes(a.location))
                    continue;
                if (filter.pro && !filterRules[filter.ruleId].accept(a))
                    continue;
                arts.push(a);
            }
            // sort
            switch (sort.value.by) {
                case "avg":
                case "min":
                case "max":
                    sortResults.value = affnumSort.sort(
                        arts,
                        {},
                        [
                            {
                                set: "*",
                                type: "*",
                                label: "",
                                weight: sort.value.weight,
                            },
                        ],
                        sort.value.by,
                    );
                    sortResultType.value = "affnum";
                    break;
                case "avgpro":
                    sortResults.value = affnumSort.sort(
                        arts,
                        setBonusTable.value,
                        affixWeightTable.value,
                    );
                    sortResultType.value = "affnum";
                    break;
                case "pmulti":
                    sortResults.value = pBuildSort.sort(
                        arts,
                        builds.value,
                        sort.value.buildKeys,
                        {
                            sortBy: pBuildSortBy.value,
                            calProbType: calArtiProbType.value,
                            calArtiWeightType: calArtiWeightType.value,
                            ignoreIndividual: pBuildIgnoreIndividual.value,
                            pBuildIgnoreSmallWeight:
                                pBuildIgnoreSmallWeight.value,
                        },
                    );
                    sortResultType.value = "pbuild";
                    break;
                case "psingle":
                    sortResults.value = pBuildSort.sort(
                        arts,
                        [
                            {
                                key: "",
                                name: "",
                                set: sort.value.set,
                                setList: [],
                                main: sort.value.mainKey,
                                weight: sort.value.weight,
                            },
                        ],
                        [""],
                        {
                            calProbType: calArtiProbType.value,
                            calArtiWeightType: calArtiWeightType.value,
                            ignoreIndividual: pBuildIgnoreIndividual.value,
                            pBuildIgnoreSmallWeight:
                                pBuildIgnoreSmallWeight.value,
                        },
                    );
                    sortResultType.value = "pbuild";
                    break;
                case "porder":
                    let ret = pOrder.sort(
                        arts,
                        builds.value,
                        customizedBuildSorts.value,
                        {
                            calArtiWeightType: calArtiWeightType.value,
                            calProbType: calArtiProbType.value,
                            pBuildIgnoreSmallWeight:
                                pBuildIgnoreSmallWeight.value,
                        },
                    );
                    sortResults.value = ret.sortResults;
                    orderResults.value = ret.orderResults;
                    arts = [];
                    for (let orderResult of orderResults.value) {
                        for (let setKey in orderResult.bestArt) {
                            let art =
                                orderResult.bestArt[
                                    setKey as keyof ISlotBestArt
                                ]?.art;
                            if (art) {
                                arts.push(art);
                            }
                        }
                    }
                    sortResultType.value = "porder";
                    break;
                case "pequip":
                    sortResults.value = pEquipSort.sort(
                        arts,
                        artifacts.value,
                        builds.value,
                        pEquipCharKeys.value,
                        {
                            ignoreIndividual: pBuildIgnoreIndividual.value,
                        },
                    );
                    sortResultType.value = "pequip";
                    break;
                case "defeat":
                    sortResults.value = defeatSort.sort(arts);
                    sortResultType.value = "defeat";
                    break;
                case "set":
                    normalSort.sort(arts);
                    sortResults.value = undefined;
                    sortResultType.value = undefined;
                    break;
                case "index":
                default:
                    arts.sort((a, b) => a.data.index - b.data.index);
                    sortResults.value = undefined;
                    sortResultType.value = undefined;
            }
            processedArtifacts.value = arts;
        });
    }

    /** add artifacts, filter and sort automatically */
    function addArtifacts(_artifacts: Artifact[]) {
        _artifacts.forEach((a) => artifacts.value.push(a));
        resetFilter();
        filterAndSort();
    }

    /** delete artifacts, filter and sort automatically */
    function delArtifacts(indices: number[]) {
        let indices_set = new Set(indices);
        // 在state.artifacts中删除
        let arts: Artifact[] = [];
        for (let a of artifacts.value) {
            if (!indices_set.has(a.data.index)) arts.push(a);
        }
        artifacts.value = arts;
        // 在state.artifacts中删除
        arts = [];
        for (let a of processedArtifacts.value) {
            if (!indices_set.has(a.data.index)) arts.push(a);
        }
        processedArtifacts.value = arts;
        // reset filter
        resetFilter();
        // show reload
        uiStore.run(() => {});
    }

    /** update artifact, filter and sort automatically */
    function updArtifact(
        index: number,
        toSwap: boolean,
        newArt: {
            location: string;
            slot: string;
            level: number;
            minors: Affix[];
        },
    ) {
        for (let a of processedArtifacts.value) {
            if (a.data.index == index) {
                if (toSwap) {
                    for (let b of artifacts.value) {
                        if (
                            b.location == newArt.location &&
                            b.slot == newArt.slot
                        ) {
                            b.location = a.location;
                            break;
                        }
                    }
                }
                a.location = newArt.location;
                a.level = newArt.level;
                a.minors = newArt.minors;
                break;
            }
        }
        filterAndSort();
    }

    /** flip one lock */
    function flipLock(index: number) {
        for (let a of artifacts.value) {
            if (a.data.index == index) {
                a.lock = !a.lock;
                break;
            }
        }
    }

    /** set locks */
    function setLocks(indices: number[], lock: boolean) {
        let s = new Set(indices);
        for (let a of artifacts.value) {
            if (s.has(a.data.index)) {
                a.lock = lock;
            }
        }
    }

    function changeElementType() {
        elementType.value = gameManager.changeElementType(elementType.value);
        artifactData.value = gameManager.getArtifactData();
        characterData.value = gameManager.getCharacterData();
    }

    function updateElementType() {
        gameManager.updateElementType(elementType.value);
        artifactData.value = gameManager.getArtifactData();
        characterData.value = gameManager.getCharacterData();
    }

    return {
        artifacts,
        processedArtifacts,
        filter,
        sort,
        pBuildSortBy,
        pBuildIgnoreIndividual,
        pBuildIgnoreSmallWeight,
        pEquipCharKeys,
        customizedBuilds,
        builds,
        setBonusTable,
        affixWeightTable,
        sortResults,
        sortResultType,
        canExport,
        artMode,
        affnumMultiplierKey,
        affnumMultiplier,
        setTypeCount,
        resetFilter,
        setArtifacts,
        filterAndSort,
        addArtifacts,
        delArtifacts,
        updArtifact,
        flipLock,
        setLocks,
        calArtiWeightType,
        calArtiProbType,
        customizedBuildSorts,
        orderResults,
        game,
        artifactData,
        characterData,
        elementType,
        changeElementType,
    };
});
