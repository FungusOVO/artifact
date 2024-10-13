import requests
import os

"""
let ret = [];
for(let tr of table.children[1].children){
    let td = tr.children[1].children[0];
    ret.push({
        id: td.href.replace(/.*com\//,"").replace(/\/.*/,""),
        key: td.lastChild.data
    })
}
console.log(ret)
"""


char_configs = [
    {"id": "trailblazer-character-2", "key": "Trailblazer_Destruction"},
    {"id": "trailblazer-character-4", "key": "Trailblazer_Preservation"},
    {"id": "trailblazer-character-6", "key": "Trailblazer_Harmony"},
    {"id": "march-7th-character", "key": "March7th"},
    {"id": "dan-heng-character", "key": "DanHeng"},
    {"id": "himeko-character", "key": "Himeko"},
    {"id": "welt-character", "key": "Welt"},
    {"id": "kafka-character", "key": "Kafka"},
    {"id": "silver-wolf-character", "key": "SilverWolf"},
    {"id": "arlan-character", "key": "Arlan"},
    {"id": "asta-character", "key": "Asta"},
    {"id": "herta-character", "key": "Herta"},
    {"id": "bronya-character", "key": "Bronya"},
    {"id": "seele-character", "key": "Seele"},
    {"id": "serval-character", "key": "Serval"},
    {"id": "gepard-character", "key": "Gepard"},
    {"id": "natasha-character", "key": "Natasha"},
    {"id": "pela-character", "key": "Pela"},
    {"id": "clara-character", "key": "Clara"},
    {"id": "sampo-character", "key": "Sampo"},
    {"id": "hook-character", "key": "Hook"},
    {"id": "lynx-character", "key": "Lynx"},
    {"id": "luka-character", "key": "Luka"},
    {"id": "topaz-numby-character", "key": "Topaz&Numby"},
    {"id": "qingque-character", "key": "Qingque"},
    {"id": "tingyun-character", "key": "Tingyun"},
    {"id": "luocha-character", "key": "Luocha"},
    {"id": "jing-yuan-character", "key": "JingYuan"},
    {"id": "blade-character", "key": "Blade"},
    {"id": "sushang-character", "key": "Sushang"},
    {"id": "yukong-character", "key": "Yukong"},
    {"id": "fu-xuan-character", "key": "FuXuan"},
    {"id": "yanqing-character", "key": "Yanqing"},
    {"id": "guinaifen-character", "key": "Guinaifen"},
    {"id": "bailu-character", "key": "Bailu"},
    {"id": "jingliu-character", "key": "Jingliu"},
    {"id": "dan-heng-imbibitor-lunae-character", "key": "DanHengImbibitorLunae"},
    {"id": "xueyi-character", "key": "Xueyi"},
    {"id": "hanya-character", "key": "Hanya"},
    {"id": "huohuo-character", "key": "Huohuo"},
    {"id": "gallagher-character", "key": "Gallagher"},
    {"id": "argenti-character", "key": "Argenti"},
    {"id": "ruan-mei-character", "key": "RuanMei"},
    {"id": "aventurine-character", "key": "Aventurine"},
    {"id": "dr-ratio-character", "key": "DrRatio"},
    {"id": "sparkle-character", "key": "Sparkle"},
    {"id": "black-swan-character", "key": "BlackSwan"},
    {"id": "acheron-character", "key": "Acheron"},
    {"id": "robin-character", "key": "Robin"},
    {"id": "misha-character", "key": "Misha"},
    {"id": "boothill-character", "key": "Boothill"},
    {"id": "firefly-character", "key": "Firefly"},
    {"id": "jade-character", "key": "Jade"},
    {"id": "jiaoqiu-character", "key": "Jiaoqiu"},
    {"id": "yunli-character", "key": "Yunli"},
    {"id": "march-7th-character-2", "key": "March7th_TheHunt"},
    {"id": "feixiao-character", "key": "Feixiao"},
    {"id": "lingsha-character", "key": "Lingsha"},
    {"id": "moze-character", "key": "Moze"},
    {"id": "rappa-character", "key": "Rappa"},
]


dir_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for c in char_configs:
    print(c["id"])
    if os.path.exists(
        os.path.join(
            dir_path, "public", "assets", "char_faces", "sr", c["key"] + ".webp"
        )
    ) and os.path.exists(
        os.path.join(
            dir_path, "public", "assets", "char_sides", "sr", c["key"] + ".webp"
        )
    ):
        continue

    char_face_file = requests.get(
        f'https://starrail.honeyhunterworld.com/img/character/{c["id"]}_icon.webp'
    )
    open(
        os.path.join(
            dir_path, "public", "assets", "char_faces", "sr", c["key"] + ".webp"
        ),
        "wb",
    ).write(char_face_file.content)

    char_side_file = requests.get(
        f'https://starrail.honeyhunterworld.com/img/character/{c["id"]}_side_icon.webp'
    )
    open(
        os.path.join(
            dir_path, "public", "assets", "char_sides", "sr", c["key"] + ".webp"
        ),
        "wb",
    ).write(char_side_file.content)
