export interface IArtifactData {
    slotKeys: string[]; // 部位名称
    adjustSlotKeys: string[]; // 主词条不固定的部位,加载数据时自动赋值
    // 每个部位的主词条
    mainKeys: {
        [key: string]: string[];
    };
    elementKeys: string[];
    elementDBKeys: string[];
    setKeys: string[];
    setKeysR4?: string[];
    // 2件套相同效果的组
    setGroups: {
        [key: string]: string[];
    };
    minorKeys: string[];
    mainStatsR5: {
        [key: string]: number[];
    };
    mainStatsR4: {
        [key: string]: number[];
    };
    minorStatsR5: {
        [key: string]: number;
    };
    minorStatsR4: {
        [key: string]: number;
    };
    mainProbs: {
        [key: string]: {
            [key: string]: number;
        };
    };
    minorPickWeights: {
        [key: string]: number;
    };
}

export interface ICharacterData {
    [key: string]: {
        element: string;
        baseAttr: {
            hp: number;
            atk: number;
            def: number;
        };
        build: {
            set: string[];
            setList: string[][];
            main: { [slotKey: string]: string[] };
            weight: { [affix: string]: number };
        };
        [key: string]: any;
    };
}
