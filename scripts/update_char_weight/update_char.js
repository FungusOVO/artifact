import fs from "fs";
import axios from "axios";
import https from "https";

const agent = new https.Agent({
    rejectUnauthorized: false,
});

axios
    .get(
        "https://raw.githubusercontent.com/yoimiya-kokomi/miao-plugin/master/resources/meta-gs/artifact/artis-mark.js",
        { httpsAgent: agent },
    )
    .then(function (response) {
        fs.writeFileSync(
            "scripts/update_char_weight/gs-artis-mark.js",
            response.data,
        );
    })
    .catch(function (error) {
        console.log(error);
    });
axios
    .get(
        "https://raw.githubusercontent.com/yoimiya-kokomi/miao-plugin/master/resources/meta-sr/artifact/artis-mark.js",
        { httpsAgent: agent },
    )
    .then(function (response) {
        fs.writeFileSync(
            "scripts/update_char_weight/sr-artis-mark.js",
            response.data,
        );
    })
    .catch(function (error) {
        console.log(error);
    });

import * as gsMark from "./gs-artis-mark.js";
import * as srMark from "./sr-artis-mark.js";

import zhCN from "../../src/i18n/zhCN.json" assert { type: "json" };

import gsCharData from "../../src/game/gs/data/characterData.json" assert { type: "json" };
import srCharData from "../../src/game/sr/data/characterData.json" assert { type: "json" };

function CharWeightUpdater() {
    let aliasCnName = {
        物理主: "星·毁灭",
        火主: "星·存护",
        同谐主: "星·同谐",
    };

    let aliasWeight = {
        atk: "atkp",
        atkPlus: "atk",
        def: "defp",
        defPlus: "def",
        hp: "hpp",
        hpPlus: "hp",
        speed: "spd",
        mastery: "em",
        cpct: "cr",
        cdmg: "cd",
        recharge: "er",
        stance: "be",
        effPct: "eh",
        effDef: "eres",
    };

    function updateCharacterData(mark, cn, charData, defaultMark) {
        for (let enName in cn) {
            let cnName = cn[enName];
            cnName = aliasCnName[cnName] || cnName;
            let charMark = mark[cnName];
            if (!charMark) {
                console.log(cn[enName]);
                charMark = defaultMark;
            }
            if (!charData[enName]) {
                continue;
            }
            let weight = charData[enName].build.weight;
            for (let key in weight) {
                weight[key] = 0;
            }
            for (let mKey in charMark) {
                let cKey = aliasWeight[mKey];
                if (!cKey) {
                    continue;
                }
                weight[cKey] = Number((charMark[mKey] / 100).toFixed(2));
            }
            charData[enName].build.weight = weight;
        }
        return charData;
    }
    return updateCharacterData;
}

let updateCharacterData = CharWeightUpdater();

let newGsCharData = updateCharacterData(
    gsMark.usefulAttr,
    zhCN.character.gs,
    gsCharData,
    { atk: 75, cpct: 100, cdmg: 100, dmg: 100, phy: 100 },
);
let newSrCharData = updateCharacterData(
    srMark.usefulAttr,
    zhCN.character.sr,
    srCharData,
    { atk: 75, cpct: 100, cdmg: 100, dmg: 100, speed: 100 },
);

fs.writeFileSync(
    "src/game/gs/data/characterData.json",
    JSON.stringify(newGsCharData),
);
fs.writeFileSync(
    "src/game/sr/data/characterData.json",
    JSON.stringify(newSrCharData),
);
