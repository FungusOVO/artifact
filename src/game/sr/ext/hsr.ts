import { Artifact } from "@/game/base/artifact";
import { SrAffix, SrArtifact } from "../artifact";
import { whatis, assert } from "@/utils";

interface tag {
    key: string;
    value: number;
}

interface relics {
    set: string;
    name: string;
    slot: string;
    rarity: number;
    level: number;
    mainstat: string;
    substats: tag[];
    location: string;
    lock: boolean;
    discard: boolean;
    _id: string;
    _uid: string;
}

const keymap = {
    set: <{ [key: string]: string }>{
        PasserbyofWanderingCloud: "Passerby of Wandering Cloud",
        MusketeerofWildWheat: "Musketeer of Wild Wheat",
        KnightofPurityPalace: "Knight of Purity Palace",
        HunterofGlacialForest: "Hunter of Glacial Forest",
        ChampionofStreetwiseBoxing: "Champion of Streetwise Boxing",
        GuardofWutheringSnow: "Guard of Wuthering Snow",
        FiresmithofLavaForging: "Firesmith of Lava-Forging",
        GeniusofBrilliantStars: "Genius of Brilliant Stars",
        BandofSizzlingThunder: "Band of Sizzling Thunder",
        EagleofTwilightLine: "Eagle of Twilight Line",
        ThiefofShootingMeteor: "Thief of Shooting Meteor",
        WastelanderofBanditryDesert: "Wastelander of Banditry Desert",
        LongevousDisciple: "Longevous Disciple",
        MessengerTraversingHackerspace: "Messenger Traversing Hackerspace",
        TheAshblazingGrandDuke: "The Ashblazing Grand Duke",
        PrisonerinDeepConfinement: "Prisoner in Deep Confinement",
        PioneerDiverofDeadWaters: "Pioneer Diver of Dead Waters",
        WatchmakerMasterofDreamMachinations:
            "Watchmaker, Master of Dream Machinations",
        IronCavalryAgainsttheScourge: "Iron Cavalry Against the Scourge",
        TheWindSoaringValorous: "The Wind-Soaring Valorous",

        SpaceSealingStation: "Space Sealing Station",
        FleetoftheAgeless: "Fleet of the Ageless",
        PanCosmicCommercialEnterprise: "Pan-Cosmic Commercial Enterprise",
        BelobogoftheArchitects: "Belobog of the Architects",
        CelestialDifferentiator: "Celestial Differentiator",
        InertSalsotto: "Inert Salsotto",
        TaliaKingdomofBanditry: "Talia: Kingdom of Banditry",
        SprightlyVonwacq: "Sprightly Vonwacq",
        RutilantArena: "Rutilant Arena",
        BrokenKeel: "Broken Keel",
        FirmamentFrontlineGlamoth: "Firmament Frontline: Glamoth",
        PenaconyLandoftheDreams: "Penacony, Land of the Dreams",
        SigoniatheUnclaimedDesolation: "Sigonia, the Unclaimed Desolation",
        IzumoGenseiandTakamaDivineRealm: "Izumo Gensei and Takama Divine Realm",
        DuranDynastyofRunningWolves: "Duran, Dynasty of Running Wolves",
        ForgeoftheKalpagniLantern: "Forge of the Kalpagni Lantern",
        LushakatheSunkenSeas: "The Wondrous BananAmusement Park",
        TheWondrousBananAmusementPark: "The Wondrous BananAmusement Park",
    },
    yasSet: <{ [key: string]: string }>{
        BelobogoftheArchitects: "Belobog's Fortress of Preservation",
    },
    affix: <{ [key: string]: string }>{
        hp: "HP",
        atk: "ATK",
        def: "DEF",
        hpp: "HP_",
        atkp: "ATK_",
        defp: "DEF_",
        er: "Energy Regeneration Rate",
        hb: "Outgoing Healing Boost",
        cr: "CRIT Rate_",
        cd: "CRIT DMG_",
        eh: "Effect Hit Rate_",
        be: "Break Effect_",
        spd: "SPD",
        eres: "Effect RES_",
        iceDB: "Ice DMG Boost",
        windDB: "Wind DMG Boost",
        fireDB: "Fire DMG Boost",
        imaginaryDB: "Imaginary DMG Boost",
        lightningDB: "Lightning DMG Boost",
        quantumDB: "Quantum DMG Boost",
        physicalDB: "Physical DMG Boost",
    },
    mainKey: <{ [key: string]: string }>{
        hp: "HP",
        atk: "ATK",
        def: "DEF",
        hpp: "HP_",
        atkp: "ATK_",
        defp: "DEF_",
        er: "Energy Regeneration Rate",
        hb: "Outgoing Healing Boost",
        cr: "CRIT Rate",
        cd: "CRIT DMG",
        eh: "Effect Hit Rate",
        be: "Break Effect",
        spd: "SPD",
        eres: "Effect RES",
        iceDB: "Ice DMG Boost",
        windDB: "Wind DMG Boost",
        fireDB: "Fire DMG Boost",
        imaginaryDB: "Imaginary DMG Boost",
        lightningDB: "Lightning DMG Boost",
        quantumDB: "Quantum DMG Boost",
        physicalDB: "Physical DMG Boost",
    },
    slot: <{ [key: string]: string }>{
        Head: "Head",
        Hands: "Hands",
        Body: "Body",
        Feet: "Feet",
        PlanarSphere: "Planar Sphere",
        LinkRope: "Link Rope",
    },
    characterName: <{ [key: string]: string }>{
        "March 7th": "March7th",
        "Dan Heng": "DanHeng",
        "Himeko": "Himeko",
        "Welt": "Welt",
        "Kafka": "Kafka",
        "Silver Wolf": "SilverWolf",
        "Arlan": "Arlan",
        "Asta": "Asta",
        "Herta": "Herta",
        "Bronya": "Bronya",
        "Seele": "Seele",
        "Serval": "Serval",
        "Gepard": "Gepard",
        "Natasha": "Natasha",
        "Pela": "Pela",
        "Clara": "Clara",
        "Sampo": "Sampo",
        "Hook": "Hook",
        "Lynx": "Lynx",
        "Luka": "Luka",
        "Topaz & Numby": "Topaz&Numby",
        "Qingque": "Qingque",
        "Tingyun": "Tingyun",
        "Luocha": "Luocha",
        "Jing Yuan": "JingYuan",
        "Blade": "Blade",
        "Sushang": "Sushang",
        "Yukong": "Yukong",
        "Fu Xuan": "FuXuan",
        "Yanqing": "Yanqing",
        "Guinaifen": "Guinaifen",
        "Bailu": "Bailu",
        "Jingliu": "Jingliu",
        "Dan Heng • Imbibitor Lunae": "DanHengImbibitorLunae",
        "Xueyi": "Xueyi",
        "Hanya": "Hanya",
        "Huohuo": "Huohuo",
        "Jiaoqiu": "Jiaoqiu",
        "Yunli": "Yunli",
        "Gallagher": "Gallagher",
        "Argenti": "Argenti",
        "Ruan Mei": "RuanMei",
        "Aventurine": "Aventurine",
        "Dr. Ratio": "DrRatio",
        "Sparkle": "Sparkle",
        "Black Swan": "BlackSwan",
        "Acheron": "Acheron",
        "Robin": "Robin",
        "Firefly": "Firefly",
        "Misha": "Misha",
        "Jade": "Jade",
        "Boothill": "Boothill",
        "TrailblazerDestruction": "Trailblazer_Destruction",
        "TrailblazerPreservation": "Trailblazer_Preservation",
        "TrailblazerHarmony": "Trailblazer_Harmony",
    },
    characterId: <{ [key: string]: string }>{
        "March 7th": "1001",
        "Dan Heng": "1002",
        "Himeko": "1103",
        "Welt": "1004",
        "Kafka": "1005",
        "Silver Wolf": "1106",
        "Arlan": "1008",
        "Asta": "1009",
        "Herta": "1013",
        "Bronya": "1101",
        "Seele": "1102",
        "Serval": "1103",
        "Gepard": "1104",
        "Natasha": "1105",
        "Pela": "1106",
        "Clara": "1107",
        "Sampo": "1108",
        "Hook": "1109",
        "Lynx": "1110",
        "Luka": "1111",
        "Topaz & Numby": "1112",
        "Qingque": "1201",
        "Tingyun": "1202",
        "Luocha": "1203",
        "Jing Yuan": "1204",
        "Blade": "1205",
        "Sushang": "1206",
        "Yukong": "1207",
        "Fu Xuan": "1208",
        "Yanqing": "1209",
        "Guinaifen": "1210",
        "Bailu": "1211",
        "Jingliu": "1212",
        "Dan Heng • Imbibitor Lunae": "1213",
        "Xueyi": "1214",
        "Hanya": "1215",
        "Huohuo": "1217",
        "Jiaoqiu": "1218",
        "Yunli": "1221",
        "Gallagher": "1301",
        "Argenti": "1302",
        "Ruan Mei": "1303",
        "Aventurine": "1304",
        "Dr. Ratio": "1305",
        "Sparkle": "1306",
        "Black Swan": "1307",
        "Acheron": "1308",
        "Robin": "1309",
        "Firefly": "1310",
        "Misha": "1312",
        "Jade": "1314",
        "Boothill": "1315",
        "March7th_TheHunt": "1224",
        "Feixiao": "1220",
        "Lingsha": "1222",
        "Moze": "1223",
        "Rappa": "1317",
        "Fugue": "1225",
        "Sunday": "1313",
        "TrailblazerDestruction": "8002",
        "TrailblazerPreservation": "8004",
        "TrailblazerHarmony": "8006",
    },
};

function getAffix(key: string, value: number) {
    key = whatis(key, keymap.affix) as string;
    return new SrAffix({ key, value });
}

function getKeyName(o: relics) {
    let keyIdName = (["_uid", "_id"] as Array<keyof relics>).filter((k) => {
        return !!o[k];
    })[0];
    let keySetName = (["name", "set"] as Array<keyof relics>).filter((k) => {
        return !!o[k];
    })[0];
    return { keyIdName, keySetName };
}

export default {
    loads(json: string) {
        let hsrObj = JSON.parse(json);
        assert(
            ["reliquary_archiver", "yas-scanner", "HSR-Scanner"].includes(
                hsrObj.source,
            ),
        );
        let hsrRelicArr: relics[] = hsrObj.relics;
        assert(hsrRelicArr instanceof Array);
        assert(hsrRelicArr.length > 0, "Empty");

        let { keyIdName, keySetName } = getKeyName(hsrRelicArr[0]);

        let result: Artifact[] = [];
        hsrRelicArr.sort((a, b) => {
            return (
                Number((a[keyIdName] as string).replaceAll(/[^\d]/g, "")) -
                Number((b[keyIdName] as string).replaceAll(/[^\d]/g, ""))
            );
        });

        hsrRelicArr.forEach((a, i) => {
            if (a.rarity < 4) return;
            if (["HP", "ATK", "DEF"].includes(a.mainstat)) {
                if (a.slot != "Head" && a.slot != "Hands") {
                    a.mainstat += "_";
                }
            }
            let artifact = new SrArtifact({
                set:
                    whatis(a[keySetName] as string, keymap.set) ||
                    (whatis(a[keySetName] as string, keymap.yasSet) as string),
                slot: whatis(a.slot, keymap.slot) as string,
                mainKey: whatis(a.mainstat, keymap.mainKey) as string,
                minors: a.substats.map((t) => getAffix(t.key, t.value)),
                level: a.level,
                rarity: a.rarity,
                location:
                    whatis(a.location, keymap.characterName) ||
                    whatis(a.location, keymap.characterId) ||
                    "",
                lock: a.lock,
            });
            artifact.data.source = "*/hsr";
            artifact.data.index = i;
            result.push(artifact);
        });

        return result;
    },
};
