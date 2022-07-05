/**
 * 预设：http://spongem.com/ajglz/ys/ys.html
 * 配装：https://ngabbs.com/read.php?tid=27859119
 */

export interface IBuild {
    set: string[]
    main: {
        [slotKey: string]: string[]
    }
    weight: {
        [affixKey: string]: number
    }
}

interface ICharacterData {
    [key: string]: {
        element: string
        rarity: number
        presets: string[]
        build: IBuild
    }
}

export default <ICharacterData>{
    "TravelerAnemo": {
        "element": "anemo",
        "rarity": 5,
        "presets": ["攻充精双爆"],
        "build": {
            "set": ["ViridescentVenerer"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["em", "atkp"],
                "goblet": ["em", "anemoDB"],
                "circlet": ["cr", "cd", "em"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.25,
                "defp": 0,
                "em": 1,
                "er": 1,
                "cr": 0.5,
                "cd": 0.25
            }
        }
    },
    "TravelerGeo": {
        "element": "geo",
        "rarity": 5,
        "presets": ["攻充双暴"],
        "build": {
            "set": ["GladiatorsFinale", "ShimenawasReminiscence", "ArchaicPetra", "NoblesseOblige"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["geoDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "TravelerElectro": {
        "element": "electro",
        "rarity": 5,
        "presets": ["充", "攻充双暴"],
        "build": {
            "set": ["ShimenawasReminiscence", "GladiatorsFinale", "WanderersTroupe", "EmblemOfSeveredFate", "NoblesseOblige"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["er"],
                "goblet": ["atkp", "em"],
                "circlet": ["cr", "cd", "em"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "KamisatoAyaka": {
        "element": "cryo",
        "rarity": 5,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["GladiatorsFinale", "NoblesseOblige", "ShimenawasReminiscence", "EmblemOfSeveredFate", "BlizzardStrayer"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["cryoDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Jean": {
        "element": "anemo",
        "rarity": 5,
        "presets": ["攻充双暴", "攻双暴"],
        "build": {
            "set": ["ShimenawasReminiscence", "OceanHuedClam", "GladiatorsFinale", "ViridescentVenerer", "NoblesseOblige", "MaidenBeloved"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp", "er"],
                "goblet": ["anemoDB", "atkp"],
                "circlet": ["cr", "cd", "atkp", "hb"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Lisa": {
        "element": "electro",
        "rarity": 4,
        "presets": ["攻双暴"],
        "build": {
            "set": ["WanderersTroupe", "EmblemOfSeveredFate", "ThunderingFury"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp", "em", "er"],
                "goblet": ["electroDB", "atkp", "em"],
                "circlet": ["cr", "cd", "em"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Barbara": {
        "element": "hydro",
        "rarity": 4,
        "presets": ["生充"],
        "build": {
            "set": ["TenacityOfTheMillelith", "MaidenBeloved", "NoblesseOblige", "OceanHuedClam"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["er", "hpp"],
                "goblet": ["hpp"],
                "circlet": ["hb", "hpp"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 1,
                "atkp": 0.25,
                "defp": 0,
                "em": 0.25,
                "er": 1,
                "cr": 0.5,
                "cd": 0.25
            }
        }
    },
    "Kaeya": {
        "element": "cryo",
        "rarity": 4,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["NoblesseOblige", "BloodstainedChivalry", "EmblemOfSeveredFate", "PaleFlame", "GladiatorsFinale", "BlizzardStrayer"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp", "er"],
                "goblet": ["cryoDB", "physicalDB", "atkp"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Diluc": {
        "element": "pyro",
        "rarity": 5,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["GladiatorsFinale", "WanderersTroupe", "ShimenawasReminiscence", "CrimsonWitchOfFlames"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp", "em"],
                "goblet": ["pyroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Razor": {
        "element": "electro",
        "rarity": 4,
        "presets": ["攻双暴"],
        "build": {
            "set": ["ShimenawasReminiscence", "BloodstainedChivalry", "PaleFlame", "GladiatorsFinale"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["physicalDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Amber": {
        "element": "pyro",
        "rarity": 4,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["CrimsonWitchOfFlames", "NoblesseOblige", "WanderersTroupe"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["pyroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Venti": {
        "element": "anemo",
        "rarity": 5,
        "presets": ["攻充精双暴", "攻双暴"],
        "build": {
            "set": ["", "ViridescentVenerer"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp", "er", "em"],
                "goblet": ["anemoDB", "em"],
                "circlet": ["cr", "cd", "em"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Xiangling": {
        "element": "pyro",
        "rarity": 4,
        "presets": ["攻双暴", "攻精双暴", "攻充精双暴"],
        "build": {
            "set": ["NoblesseOblige", "ShimenawasReminiscence", "GladiatorsFinale", "WanderersTroupe", "EmblemOfSeveredFate", "CrimsonWitchOfFlames"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["em", "er", "atkp"],
                "goblet": ["pyroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Beidou": {
        "element": "electro",
        "rarity": 4,
        "presets": ["攻双暴"],
        "build": {
            "set": ["GladiatorsFinale", "ShimenawasReminiscence", "EmblemOfSeveredFate", "NoblesseOblige", "ThunderingFury"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp", "er"],
                "goblet": ["electroDB", "atkp"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Xingqiu": {
        "element": "hydro",
        "rarity": 4,
        "presets": ["攻双暴", "攻精双暴", "攻充精双暴"],
        "build": {
            "set": ["GladiatorsFinale", "NoblesseOblige", "HeartOfDepth", "ShimenawasReminiscence", "EmblemOfSeveredFate"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp", "er"],
                "goblet": ["hydroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Xiao": {
        "element": "anemo",
        "rarity": 5,
        "presets": ["攻双暴"],
        "build": {
            "set": ["ViridescentVenerer", "GladiatorsFinale", "ShimenawasReminiscence", ""],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["anemoDB", "atkp"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Ningguang": {
        "element": "geo",
        "rarity": 4,
        "presets": ["攻双暴"],
        "build": {
            "set": ["ArchaicPetra", "GladiatorsFinale", "NoblesseOblige", "ShimenawasReminiscence"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["geoDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Klee": {
        "element": "pyro",
        "rarity": 5,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["GladiatorsFinale", "WanderersTroupe", "RetracingBolide", "Lavawalker", "ShimenawasReminiscence", "CrimsonWitchOfFlames"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["pyroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Zhongli": {
        "element": "geo",
        "rarity": 5,
        "presets": ["攻双暴", "攻生充双暴", "攻生双暴"],
        "build": {
            "set": ["ArchaicPetra", "ShimenawasReminiscence", "GladiatorsFinale", "NoblesseOblige", "TenacityOfTheMillelith"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["hpp", "atkp", "er"],
                "goblet": ["geoDB", "hpp"],
                "circlet": ["cr", "cd", "hpp"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0.5,
                "atkp": 0.5,
                "defp": 0,
                "em": 0,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Fischl": {
        "element": "electro",
        "rarity": 4,
        "presets": ["攻充双暴", "攻充精双暴", "攻双暴"],
        "build": {
            "set": ["PaleFlame", "ThunderingFury", "GladiatorsFinale", "BloodstainedChivalry", "ShimenawasReminiscence", "Thundersoother", "TenacityOfTheMillelith"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["electroDB", "physicalDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Bennett": {
        "element": "pyro",
        "rarity": 4,
        "presets": ["攻双暴", "攻精双暴", "攻充精双暴"],
        "build": {
            "set": ["OceanHuedClam", "MaidenBeloved", "NoblesseOblige"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["er", "hpp"],
                "goblet": ["hpp"],
                "circlet": ["hb", "hpp"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 1,
                "atkp": 0.25,
                "defp": 0,
                "em": 0.25,
                "er": 1,
                "cr": 0.25,
                "cd": 0.25
            }
        }
    },
    "Tartaglia": {
        "element": "hydro",
        "rarity": 5,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["ShimenawasReminiscence", "NoblesseOblige", "GladiatorsFinale", "WanderersTroupe", "HeartOfDepth"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp", "er", "em"],
                "goblet": ["hydroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Noelle": {
        "element": "geo",
        "rarity": 4,
        "presets": ["攻双暴", "攻防双暴", "攻防充双暴", "防双暴"],
        "build": {
            "set": ["RetracingBolide", "GladiatorsFinale", "HuskOfOpulentDreams"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["defp"],
                "goblet": ["geoDB", "defp"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.25,
                "defp": 0.5,
                "em": 0,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Qiqi": {
        "element": "cryo",
        "rarity": 5,
        "presets": ["攻双暴"],
        "build": {
            "set": ["EmblemOfSeveredFate", "MaidenBeloved", "NoblesseOblige", "OceanHuedClam", "TenacityOfTheMillelith"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["er", "atkp"],
                "goblet": ["atkp"],
                "circlet": ["hb", "atkp"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 1,
                "defp": 0,
                "em": 0,
                "er": 1,
                "cr": 0.25,
                "cd": 0.25
            }
        }
    },
    "Chongyun": {
        "element": "cryo",
        "rarity": 4,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["BlizzardStrayer", "EmblemOfSeveredFate", "Lavawalker", "NoblesseOblige"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["cryoDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Ganyu": {
        "element": "cryo",
        "rarity": 5,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["NoblesseOblige", "GladiatorsFinale", "ShimenawasReminiscence", "EmblemOfSeveredFate", "BlizzardStrayer", "WanderersTroupe"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["cryoDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Albedo": {
        "element": "geo",
        "rarity": 5,
        "presets": ["防双暴"],
        "build": {
            "set": ["ArchaicPetra", "HuskOfOpulentDreams", "TenacityOfTheMillelith"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["defp"],
                "goblet": ["geoDB"],
                "circlet": ["cr", "cd", "defp"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.25,
                "defp": 0.5,
                "em": 0,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Diona": {
        "element": "cryo",
        "rarity": 4,
        "presets": ["生充"],
        "build": {
            "set": ["OceanHuedClam", "TenacityOfTheMillelith", "MaidenBeloved", "NoblesseOblige"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["hpp", "er"],
                "goblet": ["hpp"],
                "circlet": ["hpp", "hb"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 1,
                "atkp": 0,
                "defp": 0,
                "em": 0,
                "er": 1,
                "cr": 0.5,
                "cd": 0.25
            }
        }
    },
    "Mona": {
        "element": "hydro",
        "rarity": 5,
        "presets": ["攻双暴", "攻精双暴", "攻充精双暴"],
        "build": {
            "set": ["HeartOfDepth", "WanderersTroupe", "EmblemOfSeveredFate", "NoblesseOblige", "TenacityOfTheMillelith"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["er"],
                "goblet": ["atkp"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Keqing": {
        "element": "electro",
        "rarity": 5,
        "presets": ["攻双暴"],
        "build": {
            "set": ["GladiatorsFinale", "NoblesseOblige", "BloodstainedChivalry", "PaleFlame", "Thundersoother", "ShimenawasReminiscence", "ThunderingFury"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["electroDB", "physicalDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Sucrose": {
        "element": "anemo",
        "rarity": 4,
        "presets": ["精"],
        "build": {
            "set": ["GladiatorsFinale", "NoblesseOblige", "ShimenawasReminiscence", "ViridescentVenerer"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["em", "er", "atkp"],
                "goblet": ["em", "anemoDB"],
                "circlet": ["cr", "cd", "em"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.25,
                "defp": 0,
                "em": 1,
                "er": 0.5,
                "cr": 0.5,
                "cd": 0.25
            }
        }
    },
    "Xinyan": {
        "element": "pyro",
        "rarity": 4,
        "presets": ["攻双暴", "攻防双暴"],
        "build": {
            "set": ["PaleFlame", "GladiatorsFinale", "ShimenawasReminiscence", "RetracingBolide", "HuskOfOpulentDreams", "TenacityOfTheMillelith", "BloodstainedChivalry"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["defp", "atkp"],
                "goblet": ["defp", "physicalDB"],
                "circlet": ["cr", "cd", "defp"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0.5,
                "em": 0,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Rosaria": {
        "element": "cryo",
        "rarity": 4,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["GladiatorsFinale", "ShimenawasReminiscence", "BlizzardStrayer", "BloodstainedChivalry", "EmblemOfSeveredFate", "PaleFlame", "NoblesseOblige"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp", "er"],
                "goblet": ["cryoDB", "physicalDB"],
                "circlet": ["cr"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "HuTao": {
        "element": "pyro",
        "rarity": 5,
        "presets": ["攻双暴", "攻生精双暴", "生精双暴", "生精爆伤"],
        "build": {
            "set": ["TenacityOfTheMillelith", "WanderersTroupe", "RetracingBolide", "ShimenawasReminiscence", "CrimsonWitchOfFlames"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["hpp", "em"],
                "goblet": ["pyroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0.5,
                "atkp": 0.25,
                "defp": 0,
                "em": 0.5,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "KaedeharaKazuha": {
        "element": "anemo",
        "rarity": 5,
        "presets": ["攻双暴", "攻精双暴", "精充"],
        "build": {
            "set": ["", "ViridescentVenerer"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["em", "atkp"],
                "goblet": ["anemoDB", "em", "atkp"],
                "circlet": ["cr", "cd", "em", "atkp"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 1,
                "er": 0.5,
                "cr": 0.5,
                "cd": 0.5
            }
        }
    },
    "Yanfei": {
        "element": "pyro",
        "rarity": 4,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["", "RetracingBolide", "CrimsonWitchOfFlames", "WanderersTroupe"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["pyroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Yoimiya": {
        "element": "pyro",
        "rarity": 5,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["GladiatorsFinale", "CrimsonWitchOfFlames", "RetracingBolide", "Lavawalker", "ShimenawasReminiscence"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["pyroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Thoma": {
        "element": "pyro",
        "rarity": 4,
        "presets": ["生充"],
        "build": {
            "set": ["TenacityOfTheMillelith", "EmblemOfSeveredFate"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["er", "hpp"],
                "goblet": ["hpp"],
                "circlet": ["hpp"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 1,
                "atkp": 0.25,
                "defp": 0,
                "em": 0.25,
                "er": 1,
                "cr": 0.5,
                "cd": 0.25
            }
        }
    },
    "Eula": {
        "element": "cryo",
        "rarity": 5,
        "presets": ["攻充双暴", "攻击爆伤", "攻双暴"],
        "build": {
            "set": ["GladiatorsFinale", "BloodstainedChivalry", "ShimenawasReminiscence", "PaleFlame"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["physicalDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "RaidenShogun": {
        "element": "electro",
        "rarity": 5,
        "presets": ["攻充双暴", "攻双暴"],
        "build": {
            "set": ["", "EmblemOfSeveredFate"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["er", "atkp"],
                "goblet": ["electroDB", "atkp"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Sayu": {
        "element": "anemo",
        "rarity": 4,
        "presets": ["攻充双暴", "攻双暴"],
        "build": {
            "set": ["ShimenawasReminiscence", "OceanHuedClam", "ViridescentVenerer", "MaidenBeloved"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["em", "er", "atkp"],
                "goblet": ["em", "anemoDB"],
                "circlet": ["em", "hb", "atkp"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 1,
                "defp": 0,
                "em": 0.5,
                "er": 1,
                "cr": 0.5,
                "cd": 0.25
            }
        }
    },
    "SangonomiyaKokomi": {
        "element": "hydro",
        "rarity": 5,
        "presets": ["生充", "生攻充", "生攻精充"],
        "build": {
            "set": ["MaidenBeloved", "OceanHuedClam", "TenacityOfTheMillelith", "HeartOfDepth"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["hpp", "er"],
                "goblet": ["hydroDB", "hpp"],
                "circlet": ["hb"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 1,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.5,
                "cr": 0,
                "cd": 0
            }
        }
    },
    "Gorou": {
        "element": "geo",
        "rarity": 4,
        "presets": ["防充"],
        "build": {
            "set": ["HuskOfOpulentDreams", "EmblemOfSeveredFate", "MaidenBeloved", "OceanHuedClam", "ArchaicPetra", "NoblesseOblige"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["er"],
                "goblet": ["defp"],
                "circlet": ["defp", "hb"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.25,
                "defp": 1,
                "em": 0.25,
                "er": 1,
                "cr": 0.5,
                "cd": 0.25
            }
        }
    },
    "KujouSara": {
        "element": "electro",
        "rarity": 4,
        "presets": ["攻充双暴", "攻双暴"],
        "build": {
            "set": ["GladiatorsFinale", "ThunderingFury", "ShimenawasReminiscence", "EmblemOfSeveredFate", "NoblesseOblige"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["er", "atkp"],
                "goblet": ["electroDB", "atkp"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "AratakiItto": {
        "element": "geo",
        "rarity": 5,
        "presets": ["攻双暴", "攻防双暴", "攻防充双暴", "防双暴"],
        "build": {
            "set": ["ArchaicPetra", "HuskOfOpulentDreams"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["defp"],
                "goblet": ["geoDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0.5,
                "em": 0,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "YaeMiko": {
        "element": "electro",
        "rarity": 5,
        "presets": ["攻精双暴", "攻充精双暴"],
        "build": {
            "set": ["ShimenawasReminiscence", "GladiatorsFinale", "ThunderingFury", "Thundersoother", "TenacityOfTheMillelith"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["electroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.5,
                "er": 0.5,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Yelan": {
        "element": "hydro",
        "rarity": 5,
        "presets": ["生双暴", "生充双暴"],
        "build": {
            "set": ["EmblemOfSeveredFate", "HeartOfDepth", "NoblesseOblige", "TenacityOfTheMillelith"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["hpp", "er"],
                "goblet": ["hydroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 1,
                "atkp": 0,
                "defp": 0,
                "em": 0,
                "er": 1,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Aloy": {
        "element": "cryo",
        "rarity": 4,
        "presets": ["攻双暴", "攻精双暴"],
        "build": {
            "set": ["GladiatorsFinale", "ShimenawasReminiscence", "EmblemOfSeveredFate", "NoblesseOblige", "BlizzardStrayer"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp", "er", "em"],
                "goblet": ["cryoDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.5,
                "defp": 0,
                "em": 0.25,
                "er": 0.25,
                "cr": 1,
                "cd": 1
            }
        }
    },
    "Shenhe": {
        "element": "cryo",
        "rarity": 5,
        "presets": ["攻充", "攻双暴"],
        "build": {
            "set": ["ShimenawasReminiscence", "GladiatorsFinale", "NoblesseOblige"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp", "er"],
                "goblet": ["atkp"],
                "circlet": ["atkp"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 1,
                "defp": 0,
                "em": 0.25,
                "er": 0.5,
                "cr": 0.5,
                "cd": 0.25
            }
        }
    },
    "YunJin": {
        "element": "geo",
        "rarity": 4,
        "presets": ["防充"],
        "build": {
            "set": ["EmblemOfSeveredFate", "NoblesseOblige", "HuskOfOpulentDreams"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["defp", "er"],
                "goblet": ["defp"],
                "circlet": ["defp"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0,
                "atkp": 0.25,
                "defp": 1,
                "em": 0.25,
                "er": 1,
                "cr": 0.5,
                "cd": 0.25
            }
        }
    },
    "KukiShinobu": {
        "element": "electro",
        "rarity": 4,
        "presets": ["生", "生精"],
        "build": {
            "set": ["TenacityOfTheMillelith", "OceanHuedClam", "MaidenBeloved"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["em", "hpp"],
                "goblet": ["em", "hpp"],
                "circlet": ["hb", "em"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 1,
                "atkp": 0,
                "defp": 0,
                "em": 1,
                "er": 0,
                "cr": 0.5,
                "cd": 0
            }
        }
    },
    "KamisatoAyato": {
        "element": "hydro",
        "rarity": 5,
        "presets": ["攻双暴", "攻生双暴"],
        "build": {
            "set": ["EchoesOfAnOffering", "GladiatorsFinale", "HeartOfDepth"],
            "main": {
                "flower": ["hp"],
                "plume": ["atk"],
                "sands": ["atkp"],
                "goblet": ["hydroDB"],
                "circlet": ["cr", "cd"]
            },
            "weight": {
                "hp": 0,
                "atk": 0,
                "def": 0,
                "hpp": 0.25,
                "atkp": 0.5,
                "defp": 0,
                "em": 0,
                "er": 0,
                "cr": 1,
                "cd": 1
            }
        }
    }
}