import { ICharacterData } from "./data/type";

export interface IWeight {
    [key: string]: number;
}

export type {
    // affnum
    ISetBonusTable,
    IAffixWeightTable,
    IAffnumResult,
    IAffnumResults,
    // pbuild
    IBuild,
    IPBuildResult,
    IPBuildResults,
    IPBuildSortBy,
    // defeat
    IDefeatResults,
    // pequip
    IPEquipResults,
    IPOrderResults,
} from "./sort";

export type ICharKey = keyof ICharacterData;
export type ICharBaseAttr = keyof ICharacterData[ICharKey]["baseAttr"];

export interface IAvatar {
    key: string;
    text: string;
    icon: string;
    rarity: number;
    bg: string;
}
