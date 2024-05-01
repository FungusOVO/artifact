import { ISrElementType } from "@/game/sr/data";
import { computed, ref } from "vue";
import type { IArtifactData, ICharacterData } from "./base/data/type";
import * as GsData from "./gs/data";
import * as SrData from "./sr/data";
import {
    AffnumSort,
    DefeatSort,
    NormalSort,
    PBuildSort,
    PEquipSort,
    POrder,
} from "./base/sort";
import {
    GsAffnumSort,
    GsDefeatSort,
    GsNormalSort,
    GsPBuildSort,
    GsPEquipSort,
    GsPOrder,
} from "./gs/sort";
import {
    SrAffnumSort,
    SrDefeatSort,
    SrNormalSort,
    SrPBuildSort,
    SrPEquipSort,
    SrPOrder,
} from "./sr/sort";
import { GsArtifact } from "./gs/artifact";
import { SrArtifact } from "./sr/artifact";

export type IGameKey = "gs" | "sr";

export type IElementType = SrData.ISrElementType;

type sortType =
    | AffnumSort
    | DefeatSort
    | NormalSort
    | PBuildSort
    | PEquipSort
    | POrder;

class GameManager {
    game: IGameKey = "gs";
    gameRef;
    gameList: IGameKey[] = ["gs", "sr"];
    sortObjList = {
        gs: [
            new GsAffnumSort(),
            new GsDefeatSort(),
            new GsNormalSort(),
            new GsPBuildSort(),
            new GsPEquipSort(),
            new GsPOrder(),
        ],
        sr: [
            new SrAffnumSort(),
            new SrDefeatSort(),
            new SrNormalSort(),
            new SrPBuildSort(),
            new SrPEquipSort(),
            new SrPOrder(),
        ],
    };

    constructor() {
        this.gameRef = ref(this.game);
    }

    getGameList() {
        return this.gameList;
    }

    getGame() {
        return this.game;
    }

    getGameRef() {
        return this.gameRef;
    }

    setGame(game: string) {
        this.game = game as IGameKey;
        this.gameRef.value = this.game;
    }

    getArtifactObj() {
        if (this.gameRef.value == "gs") {
            return GsArtifact;
        }
        if (this.gameRef.value == "sr") {
            return SrArtifact;
        }
        throw new Error("game error");
    }

    getArtifactData(): IArtifactData {
        let artifactData: IArtifactData | null = null;
        if (this.game == "gs") {
            artifactData = GsData.ArtifactData;
        }
        if (this.game == "sr") {
            artifactData = SrData.ArtifactData;
        }
        if (!artifactData) {
            throw new Error("game error");
        }
        return artifactData;
    }

    getCharacterData(): ICharacterData {
        if (this.game == "gs") {
            return GsData.CharacterData;
        }
        if (this.game == "sr") {
            return SrData.CharacterData;
        }
        throw new Error("game error");
    }

    getSort<T extends sortType>(type: any): T {
        for (let sortObj of this.sortObjList[this.game]) {
            if (sortObj instanceof type) {
                return <T>sortObj;
            }
        }
        throw new Error("no sort type found!");
    }

    getDefaultWeightJsonStr() {
        if (this.game == "gs") {
            return '{"hp":0,"atk":0,"def":0,"hpp":0,"atkp":0,"defp":0,"em":0,"er":0,"cr":0,"cd":0}';
        }
        if (this.game == "sr") {
            return '{"hp":0,"atk":0,"def":0,"hpp":0,"atkp":0,"defp":0,"er":0,"cr":0,"cd":0,"eh":0,"be":0,"spd":0,"eres":0}';
        }
        throw new Error("game error");
    }

    // 星铁切换元素/命途展示
    changeElementType(curType: IElementType) {
        if (this.game == "sr") {
            let nextType: SrData.ISrElementType = "element";
            if (curType == "element") {
                nextType = "path";
            }
            SrData.setElementType(nextType);
            return nextType;
        }
        return curType;
    }

    updateElementType(curType: IElementType) {
        if (this.game == "sr") {
            SrData.setElementType(curType as ISrElementType);
        }
    }
}

let gameManager = new GameManager();
export { gameManager };
