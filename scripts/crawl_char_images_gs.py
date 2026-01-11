import requests
import os


char_configs = [
    {"id": "ayaka_002", "key": "KamisatoAyaka"},
    {"id": "qin_003", "key": "Jean"},
    {"id": "playerboy_005", "key": "Traveler"},
    {"id": "lisa_006", "key": "Lisa"},
    {"id": "playergirl_007", "key": "Traveler"},
    {"id": "barbara_014", "key": "Barbara"},
    {"id": "kaeya_015", "key": "Kaeya"},
    {"id": "diluc_016", "key": "Diluc"},
    {"id": "razor_020", "key": "Razor"},
    {"id": "ambor_021", "key": "Amber"},
    {"id": "venti_022", "key": "Venti"},
    {"id": "xiangling_023", "key": "Xiangling"},
    {"id": "beidou_024", "key": "Beidou"},
    {"id": "xingqiu_025", "key": "Xingqiu"},
    {"id": "xiao_026", "key": "Xiao"},
    {"id": "ningguang_027", "key": "Ningguang"},
    {"id": "klee_029", "key": "Klee"},
    {"id": "zhongli_030", "key": "Zhongli"},
    {"id": "fischl_031", "key": "Fischl"},
    {"id": "bennett_032", "key": "Bennett"},
    {"id": "tartaglia_033", "key": "Tartaglia"},
    {"id": "noel_034", "key": "Noelle"},
    {"id": "qiqi_035", "key": "Qiqi"},
    {"id": "chongyun_036", "key": "Chongyun"},
    {"id": "ganyu_037", "key": "Ganyu"},
    {"id": "albedo_038", "key": "Albedo"},
    {"id": "diona_039", "key": "Diona"},
    {"id": "mona_041", "key": "Mona"},
    {"id": "keqing_042", "key": "Keqing"},
    {"id": "sucrose_043", "key": "Sucrose"},
    {"id": "xinyan_044", "key": "Xinyan"},
    {"id": "rosaria_045", "key": "Rosaria"},
    {"id": "hutao_046", "key": "HuTao"},
    {"id": "kazuha_047", "key": "KaedeharaKazuha"},
    {"id": "feiyan_048", "key": "Yanfei"},
    {"id": "yoimiya_049", "key": "Yoimiya"},
    {"id": "tohma_050", "key": "Thoma"},
    {"id": "eula_051", "key": "Eula"},
    {"id": "shougun_052", "key": "RaidenShogun"},
    {"id": "sayu_053", "key": "Sayu"},
    {"id": "kokomi_054", "key": "SangonomiyaKokomi"},
    {"id": "gorou_055", "key": "Gorou"},
    {"id": "sara_056", "key": "KujouSara"},
    {"id": "itto_057", "key": "AratakiItto"},
    {"id": "yae_058", "key": "YaeMiko"},
    {"id": "heizo_059", "key": "ShikanoinHeizou"},
    {"id": "yelan_060", "key": "Yelan"},
    {"id": "momoka_061", "key": "Kirara"},
    {"id": "aloy_062", "key": "Aloy"},
    {"id": "shenhe_063", "key": "Shenhe"},
    {"id": "yunjin_064", "key": "YunJin"},
    {"id": "shinobu_065", "key": "KukiShinobu"},
    {"id": "ayato_066", "key": "KamisatoAyato"},
    {"id": "collei_067", "key": "Collei"},
    {"id": "dori_068", "key": "Dori"},
    {"id": "tighnari_069", "key": "Tighnari"},
    {"id": "nilou_070", "key": "Nilou"},
    {"id": "cyno_071", "key": "Cyno"},
    {"id": "candace_072", "key": "Candace"},
    {"id": "nahida_073", "key": "Nahida"},
    {"id": "layla_074", "key": "Layla"},
    {"id": "wanderer_075", "key": "Wanderer"},
    {"id": "faruzan_076", "key": "Faruzan"},
    {"id": "yaoyao_077", "key": "Yaoyao"},
    {"id": "alhatham_078", "key": "Alhaitham"},
    {"id": "dehya_079", "key": "Dehya"},
    {"id": "mika_080", "key": "Mika"},
    {"id": "kaveh_081", "key": "Kaveh"},
    {"id": "baizhuer_082", "key": "Baizhu"},
    {"id": "linette_083", "key": "Lynette"},
    {"id": "liney_084", "key": "Lyney"},
    {"id": "freminet_085", "key": "Freminet"},
    {"id": "wriothesley_086", "key": "Wriothesley"},
    {"id": "neuvillette_087", "key": "Neuvillette"},
    {"id": "charlotte_088", "key": "Charlotte"},
    {"id": "furina_089", "key": "Furina"},
    {"id": "chevreuse_090", "key": "Chevreuse"},
    {"id": "navia_091", "key": "Navia"},
    {"id": "gaming_092", "key": "Gaming"},
    {"id": "liuyun_093", "key": "Xianyun"},
    {"id": "chiori_094", "key": "Chiori"},
    {"id": "sigewinne_095", "key": "Sigewinne"},
    {"id": "arlecchino_096", "key": "Arlecchino"},
    {"id": "sethos_097", "key": "Sethos"},
    {"id": "clorinde_098", "key": "Clorinde"},
    {"id": "emilie_099", "key": "Emilie"},
    {"id": "kachina_100", "key": "Kachina"},
    {"id": "kinich_101", "key": "Kinich"},
    {"id": "mualani_102", "key": "Mualani"},
    {"id": "xilonen_103", "key": "Xilonen"},
    {"id": "chasca_104", "key": "Chasca"},
    {"id": "olorun_105", "key": "Ororon"},
    {"id": "mavuika_106", "key": "Mavuika"},
    {"id": "citlali_107", "key": "Citlali"},
    {"id": "lanyan_108", "key": "LanYan"},
    {"id": "mizuki_109", "key": "YumemizukiMizuki"},
    {"id": "iansan_110", "key": "Iansan"},
    {"id": "varesa_111", "key": "Varesa"},
    {"id": "escoffier_112", "key": "Escoffier"},
    {"id": "ifa_113", "key": "Ifa"},
    {"id": "skirknew_114", "key": "Skirk"},
    {"id": "dahlia_115", "key": "Dahlia"},
    {"id": "ineffa_116", "key": "Ineffa"},
    {"id": "lauma_119", "key": "Lauma"},
    {"id": "flins_120", "key": "Flins"},
    {"id": "aino_121", "key": "Aino"},
    {"id": "nefer_122", "key": "Nefer"},
    {"id": "durin_123", "key": "Durin"},
    {"id": "jahoda_124", "key": "Jahoda"},
    {"id": "columbina_125", "key": "Columbina"},
    {"id": "zibai_126", "key": "Zibai"},
    {"id": "illuga_127", "key": "Illuga"},
]

dir_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for c in char_configs:
    if os.path.exists(
        os.path.join(
            dir_path, "public", "assets", "char_faces", "gs", c["key"] + ".webp"
        )
    ) and os.path.exists(
        os.path.join(
            dir_path, "public", "assets", "char_sides", "gs", c["key"] + ".webp"
        )
    ):
        continue

    char_face_file = requests.get(
        f'https://genshin.honeyhunterworld.com/img/{c["id"]}_icon.webp'
    )
    open(
        os.path.join(
            dir_path, "public", "assets", "char_faces", "gs", c["key"] + ".webp"
        ),
        "wb",
    ).write(char_face_file.content)

    char_side_file = requests.get(
        f'https://genshin.honeyhunterworld.com/img/{c["id"]}_side_icon.webp'
    )
    open(
        os.path.join(
            dir_path, "public", "assets", "char_sides", "gs", c["key"] + ".webp"
        ),
        "wb",
    ).write(char_side_file.content)
