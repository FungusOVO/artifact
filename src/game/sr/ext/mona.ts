import { Artifact } from "@/game/base/artifact";
import { SrAffix, SrArtifact } from "../artifact";
import { whatis, assert } from "@/utils";

interface IMonaTag {
    name: string;
    value: number;
}

interface IMonaArtifact {
    setName: string;
    position: string;
    mainTag: IMonaTag;
    normalTags: IMonaTag[];
    level: number;
    rarity: number;
    equip: string;
    lock: boolean;
    discard?: boolean;
}

interface IMonaFormat {
    version?: string;
    head?: IMonaArtifact[];
    hands?: IMonaArtifact[];
    body?: IMonaArtifact[];
    feet?: IMonaArtifact[];
    planarSphere?: IMonaArtifact[];
    linkRope?: IMonaArtifact[];
}

const keymap = {
    affix: <{ [key: string]: string }>{
        hp: "hp",
        atk: "atk",
        def: "def",
        hpp: "hp_",
        atkp: "atk_",
        defp: "def_",
        er: "enerRegen",
        hb: "heal",
        cr: "critRate",
        cd: "critDMG",
        eh: "eff",
        be: "break",
        spd: "spd",
        eres: "effRes",
        iceDB: "iceDmg",
        windDB: "windDmg",
        fireDB: "fireDmg",
        imaginaryDB: "imaginaryDmg",
        lightningDB: "lightningDmg",
        quantumDB: "quantumDmg",
        physicalDB: "physicalDmg",
    },
    slot: <{ [key: string]: string }>{
        Head: "head",
        Hands: "hands",
        Body: "body",
        Feet: "feet",
        PlanarSphere: "planarSphere",
        LinkRope: "linkRope",
    },
};

function getAffix(key: string, value: number) {
    key = whatis(key, keymap.affix) as string;
    if (!["hp", "atk", "def", "spd"].includes(key)) {
        value = value * 100;
        value = parseFloat(value.toFixed(1));
    }
    return new SrAffix({ key, value });
}

export default {
    loads(json: string) {
        let mona = JSON.parse(json) as IMonaFormat;
        assert(mona instanceof Object);
        let result: Artifact[] = [],
            mona_positions = [
                "head",
                "hands",
                "body",
                "feet",
                "planarSphere",
                "linkRope",
            ] as const;
        mona_positions.forEach((key) => {
            assert(key in mona && mona[key] instanceof Array);
            mona[key]!.forEach((a) => {
                if (a.rarity < 4) return;
                let set = a.setName;
                if (!set) {
                    console.warn(
                        `Ignoring unrecognized artifact: ${a.setName}`,
                    );
                    return;
                }
                let artifact = new SrArtifact({
                    set,
                    slot: whatis(a.position, keymap.slot) as string,
                    mainKey: whatis(a.mainTag.name, keymap.affix) as string,
                    minors: a.normalTags.map((t) => getAffix(t.name, t.value)),
                    level: a.level,
                    rarity: a.rarity,
                    location: a.equip || "",
                    lock: a.lock,
                });
                artifact.data.source = "*/mona";
                result.push(artifact);
            });
        });
        return result;
    },
    dumps(artifacts: Artifact[]) {
        let mona: IMonaFormat = {
            head: [],
            hands: [],
            body: [],
            feet: [],
            planarSphere: [],
            linkRope: [],
        };
        for (let a of artifacts) {
            let position = keymap.slot[a.slot],
                mainStats = a.mainStats;
            if (!mainStats) continue;
            (<IMonaArtifact[]>mona[position as keyof IMonaFormat])!.push({
                setName: a.set,
                position: position,
                mainTag: {
                    name: keymap.affix[a.mainKey],
                    value: ["hp", "atk", "spd"].includes(a.mainKey)
                        ? mainStats[a.level]
                        : mainStats[a.level] / 100,
                },
                normalTags: a.minors.map((m) => ({
                    name: keymap.affix[m.key],
                    value: ["hp", "atk", "def", "spd"].includes(m.key)
                        ? m.value
                        : m.value / 100,
                })),
                rarity: a.rarity,
                level: a.level,
                equip: a.location,
                lock: a.lock,
                discard: false,
            });
        }
        return JSON.stringify(mona);
    },
};
