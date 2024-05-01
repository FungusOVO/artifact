import { gameManager } from "@/game/GameManager";
import { assert, choice } from "@/utils";
import { i18n } from "@/i18n";
import { Artifact } from "./base/artifact";
import { IAffnumResult, IWeight } from "./base/types";
import { getIncreAffnumMinMaxAvg } from "./gacha/reliq";
import { GsAffix, GsArtifact } from "./gs/artifact";

class GameUtils {
    affixWeightJsonValidator(rule: never, value: string, callback: any) {
        const minorKeys = gameManager.getArtifactData().minorKeys;
        try {
            let w = JSON.parse(value);
            if (typeof w != "object")
                return callback(new Error(i18n.global.t("ui.format_err")));
            if (minorKeys.length != Object.keys(w).length)
                return callback(
                    new Error(i18n.global.t("ui.key_missing_or_redunt")),
                );
            for (let key in w) {
                if (!minorKeys.includes(key))
                    return callback(
                        new Error(i18n.global.t("ui.key_not_exist", { key })),
                    );
                if (typeof w[key] != "number")
                    return callback(
                        new Error(
                            i18n.global.t("ui.valofkey_not_num", {
                                key,
                            }),
                        ),
                    );
                if (w[key] < 0 || w[key] > 1)
                    return callback(
                        new Error(
                            i18n.global.t("ui.valofkey_not_between_0_1", {
                                key,
                            }),
                        ),
                    );
            }
            callback();
        } catch {
            callback(new Error(i18n.global.t("ui.syntax_err")));
        }
    }

    randArtifact({
        set,
        slot,
        mainKey,
        rarity = 5,
        level = 0,
    }: {
        set?: string;
        slot?: string;
        mainKey?: string;
        rarity?: number;
        level?: number;
    }) {
        let Affix = GsAffix;
        let Artifact = GsArtifact;
        let ArtifactData = gameManager.getArtifactData();
        let prob = [0.7, 0.8, 0.9, 1.0];

        let A = new Artifact();
        // set
        if (set) {
            assert(ArtifactData.setKeys.includes(set), "Invalid set key");
            A.set = set;
        } else {
            A.set = choice(ArtifactData.setKeys);
        }
        // slot
        if (slot) {
            assert(ArtifactData.slotKeys.includes(slot), "Invalid slot key");
            A.slot = slot;
        } else {
            A.slot = choice(ArtifactData.slotKeys);
        }
        // main affix
        if (mainKey) {
            assert(
                // ArtifactData.mainKeys[
                //     A.slot as keyof typeof ArtifactData.mainKeys
                // ].includes(mainKey),
                ArtifactData.mainKeys.all.includes(mainKey),
                "Invalid main key",
            );
            A.mainKey = mainKey;
        } else {
            A.mainKey = choice(
                Object.keys(ArtifactData.mainProbs[A.slot]),
                Object.values(ArtifactData.mainProbs[A.slot]),
            );
        }
        // rarity
        assert([4, 5].includes(rarity), "Invalid rarity");
        A.rarity = rarity;
        // level
        assert(
            Number.isInteger(level) && level >= 0 && level <= 4 * rarity,
            "Invalid level",
        );
        A.level = level;
        // minor affixes
        let nMinorsInit = Math.random() < 0.8 ? A.rarity - 2 : A.rarity - 1,
            nMinorsUpgrade = Math.floor(A.level / 4),
            nMinors = nMinorsInit + nMinorsUpgrade,
            minorStats =
                A.rarity == 5
                    ? ArtifactData.minorStatsR5
                    : ArtifactData.minorStatsR4;
        A.minors = choice(
            ArtifactData.minorKeys.filter((k) => k != A.mainKey),
            Object.entries(ArtifactData.minorPickWeights)
                .filter((e) => e[0] != A.mainKey)
                .map((e) => e[1]),
            Math.min(nMinors, 4),
        ).map(
            (key) =>
                new Affix({
                    key,
                    value: minorStats[key] * choice(prob),
                }),
        );
        for (let _ = 4; _ < nMinors; ++_) {
            let minor = choice(A.minors);
            minor.value += minorStats[minor.key] * choice(prob);
        }
        return A;
    }

    /** 计算有效词条数量 */
    calcAffnumCur(art: Artifact, weight: IWeight): number {
        let result = 0,
            minorStats = art.minorStats;

        art.minors.forEach((m) => {
            result += (weight[m.key] * m.value) / minorStats[m.key as string];
        });

        return result;
    }

    calcAffnumFull(
        art: Artifact,
        weight: IWeight,
        setBonus = 0,
    ): IAffnumResult {
        let _weight: IWeight = { ...weight },
            result = {
                cur: setBonus,
                min: 0,
                max: 0,
                avg: 0,
                weight: _weight,
                setBonus,
            };

        gameManager
            .getArtifactData()
            .minorKeys.forEach((key: string | number) => {
                _weight[key] ||= 0;
            });

        result.cur += this.calcAffnumCur(art, _weight);
        result.min = result.max = result.avg = result.cur;

        let increMinMaxAvg = getIncreAffnumMinMaxAvg(
            art.mainKey,
            _weight,
            art.nMinorsToUpgrade,
            art.minors.map((m) => m.key),
        );

        result.min += increMinMaxAvg.min;
        result.max += increMinMaxAvg.max;
        result.avg += increMinMaxAvg.avg;

        return result;
    }

    isInSetGroup(set: string[], target: string) {
        if (set.includes(target)) {
            return true;
        }
        for (let s of set.filter((v) => v.startsWith("s:"))) {
            if (
                s in gameManager.getArtifactData() &&
                gameManager.getArtifactData().setGroups[s].includes(target)
            )
                return true;
        }
        return false;
    }
}

let gameUtils = new GameUtils();
export { gameUtils };
