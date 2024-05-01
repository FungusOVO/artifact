import { IArtifactData } from "./data/type";

export class Affix {
    key = "";
    value = 0;

    constructor(obj?: any) {
        if (obj) {
            this.key = obj.key;
            this.value = obj.value;
        }
    }

    valueString() {
        return this.value.toFixed(0);
    }
}

export abstract class Artifact {
    game = "";
    set = "";
    slot = "";
    rarity = 5; // 4, 5
    level = 0;
    lock = false;
    location = "";
    mainKey = "";
    minors: Affix[] = [];
    ArtifactData!: IArtifactData;

    data = {
        index: -Math.random(), // 圣遗物唯一标识，如果是导入的圣遗物就是导入数据中的序号，否则一般是Math.random()生成的随机数取相反数（因为想和导入的圣遗物在“不排序”时区分开）
        source: "", // 圣遗物数据来源，例如"good"，内部生成的source为''
        lock: false, // 导入数据中圣遗物的原本加解锁信息，用来识别在本工具中做过的修改
    };

    constructor(o?: any) {
        if (!o || typeof o != "object") return;
        Object.keys(o).forEach((key) => {
            if (this.hasOwnProperty(key) && key != "minors" && key != "data") {
                (this as any)[key] = o[key];
            }
        });
        this.minors = [];
        if (o.minors instanceof Array) {
            for (let m of o.minors as Affix[]) {
                this.minors.push(m);
            }
        }
        this.data.lock = this.lock;
        this.validate();
    }

    validate() {
        if (this.rarity != 4 && this.rarity != 5) {
            throw new Error("Invalid rarity");
        }
    }

    get mainStats() {
        let mainStatsAll;

        if (this.rarity === 5) {
            mainStatsAll = this.ArtifactData.mainStatsR5;
        } else if (this.rarity === 4) {
            mainStatsAll = this.ArtifactData.mainStatsR4;
        } else {
            throw new Error("Invalid rarity");
        }

        if (this.mainKey in mainStatsAll) {
            return mainStatsAll[this.mainKey as keyof typeof mainStatsAll];
        } else if (this.mainKey.endsWith("DB")) {
            return mainStatsAll.elementalDB;
        } else {
            return undefined;
        }
    }

    get minorStats() {
        if (this.rarity === 5) {
            return this.ArtifactData.minorStatsR5;
        } else if (this.rarity === 4) {
            return this.ArtifactData.minorStatsR4;
        } else {
            throw new Error("Invalid rarity");
        }
    }

    get nMinorsUpgraded(): number {
        return Math.floor(this.level / 4);
    }

    get nMinorsToUpgrade() {
        return this.rarity - this.nMinorsUpgraded;
    }
}
