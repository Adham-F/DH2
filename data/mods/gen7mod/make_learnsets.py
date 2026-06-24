import re
import json

# PLZA additions from images
plza_additions = {
    "venusaur": ["sludgewave"],
    "blastoise": ["ironhead"],
    "beedrill": ["bugbuzz", "lunge", "dualwingbeat"],
    "arbok": [],
    "raichualola": ["volttackle", "dazzlinggleam"],
    "clefable": ["airslash", "healblock"],
    "alakazam": [],
    "machamp": ["drainpunch"],
    "victreebel": ["toxicspikes"],
    "slowbro": ["healblock", "powergem", "ancientpower"],
    "slowbrogalar": ["firepunch", "thunderpunch", "healblock", "toxicspikes", "ancientpower"],
    "gengar": ["shadowsneak"],
    "starmie": ["aquajet", "liquidation", "selfdestruct", "safeguard", "bulkup", "healblock", "zenheadbutt", "ancientpower", "chargebeam", "tripleaxel"],
    "pinsir": ["lunge", "aerialace", "circlethrow", "dualwingbeat"],
    "gyarados": ["dragonrush"],
    "vaporeon": ["taunt"],
    "jolteon": [],
    "flareon": ["flamewheel", "swordsdance", "taunt"],
    "dragonite": ["whirlwind", "vacuumwave"],
    "mewtwo": ["discharge", "vacuumwave"],
    "meganium": ["leafblade", "earthpower", "dazzlinggleam"],
    "feraligatr": ["iciclespear"],
    "ariados": ["firstimpression"],
    "ampharos": ["flashcannon"],
    "espeon": ["healblock", "safeguard"],
    "umbreon": ["knockoff"],
    "slowking": ["healblock", "ancientpower"],
    "slowkinggalar": ["ancientpower"],
    "scizor": [],
    "heracross": ["outrage", "circlethrow"],
    "sableye": ["nightslash", "partingshot", "safeguard", "healblock"],
    "mawile": ["dazzlinggleam"],
    "medicham": ["agility", "blazekick"],
    "camerupt": [],
    "banette": ["slash", "healblock", "zenheadbutt", "iciclespear", "vacuumwave"],
    "glalie": [],
    "metagross": [],
    "lopunny": ["machpunch", "drainingkiss", "cottonguard", "dynamicpunch", "swordsdance"],
    "garchomp": ["nastyplot", "vacuumwave"],
    "leafeon": ["taunt"],
    "glaceon": ["taunt"],
    "froslass": ["phantomforce", "healblock", "nastyplot"],
    "emboar": ["flamewheel", "vacuumwave", "solarblade"],
    "watchog": ["doubleedge", "endure"],
    "simisage": ["endure", "trailblaze", "drainpunch", "fakeout", "solarblade"],
    "simisear": ["flamewheel", "endure", "blazekick", "scorchingsands", "fakeout"],
    "simipour": ["endure", "flipturn", "liquidation", "fakeout"],
    "excadrill": ["megahorn", "agility"],
    "scolipede": ["uturn", "gunkshot", "mortalspin", "trailblaze", "firstimpression"],
    "krookodile": ["ironhead"],
    "scrafty": ["partingshot", "dynamicpunch"],
    "garbodor": ["poisonjab", "bulletseed", "healblock"],
    "eelektross": ["waterfall", "poisonfang", "psychicfangs"],
    "chandelure": ["flamewheel", "healblock"],
    "stunfisk": ["irondefense", "crunch", "icefang", "flashcannon"],
    "chesnaught": ["growth", "solarblade"],
    "greninja": ["nastyplot", "psyshock", "flipturn", "vacuumwave"],
    "talonflame": ["whirlwind", "flamewheel", "blazekick", "skyattack"],
    "vivillon": ["whirlwind", "dazzlinggleam"],
    "pyroar": ["earthpower"],
    "floetteeternal": ["drainingkiss", "hyperbeam", "lightscreen", "trailblaze"],
    "gogoat": ["megahorn", "solarblade"],
    "pangoro": ["gigadrain"],
    "furfrou": ["crunch", "doubleedge", "hyperbeam", "endure", "thunderfang", "icefang", "firefang"],
    "meowstic": ["healblock", "wish", "spikes", "taunt", "toxicspikes", "stealthrock", "moonblast", "teleport", "triattack"],
    "meowsticf": ["waterpulse", "earthpower", "teleport", "moonblast", "triattack"],
    "aegislash": ["zenheadbutt"],
    "aromatisse": ["healblock", "hypnosis"],
    "slurpuff": ["swordsdance", "selfdestruct"],
    "malamar": ["closecombat", "bulkup", "healblock", "poisonjab", "zenheadbutt", "stealthrock", "octolock"],
    "barbaracle": ["closecombat", "waterfall"],
    "dragalge": ["poisonjab"],
    "heliolisk": ["morningsun", "shedtail", "seedbomb"],
    "sylveon": ["taunt"],
    "hawlucha": ["airslash"],
    "carbink": ["selfdestruct"],
    "goodra": ["gigadrain"],
    "goodrahisui": ["irondefense", "ancientpower"],
    "klefki": ["futuresight"],
    "trevenant": ["healblock"],
    "gourgeist": ["hypnosis", "firespin", "selfdestruct", "shadowclaw"],
    "avalugghisui": ["hydropump"],
    "yveltal": ["healblock", "vacuumwave"],
    "zygarde": ["ironhead", "psychicfangs"],
    "hoopa": ["healblock", "psychicfangs"],
    "drampa": ["bodyslam", "whirlwind", "earthpower", "chargebeam", "triattack"],
    "altaria": ["petaldance"],
    "zangoose": ["fakeout"],
    "seviper": ["scaleshot"],
    "milotic": ["calmmind", "liquidation", "dazzlinggleam"],
    "kecleon": ["conversion", "shedtail", "conversion2", "powerwhip", "gigaimpact", "firstimpression", "scaleshot"],
    "chimecho": ["amnesia", "boomburst", "waterpulse", "flashcannon", "meteorbeam"],
    "absol": ["phantomforce", "shadowsneak"],
    "salamence": ["flamecharge", "scaleshot"],
    "stunfiskgalar": ["toxic"],
    "golurk": ["ironhead"],
    "terrakion": ["heavyslam", "headsmash"],
    "virizion": ["hornleech", "stealthrock", "poisonjab", "irondefense"],
    "keldeo": ["earthpower", "icebeam", "lightscreen", "stealthrock", "zenheadbutt", "whirlpool", "waterfall"],
    "pidgeot": ["dualwingbeat"],
    "raichu": ["dazzlinggleam", "drainpunch"],
    "wigglytuff": ["moonblast", "fakeout"],
    "persian": ["spikes"],
    "persianalola": ["spikes", "toxicspikes"],
    "farfetchd": ["trailblaze"],
    "latios": ["workup", "wish"],
    "kyogre": ["iciclespear"],
    "groudon": ["powergem"],
    "rayquaza": ["dragonrush", "whirlwind"],
    "staraptor": ["brickbreak", "bulkup", "knockoff", "outrage", "lowsweep", "blazekick"],
    "roserade": ["mortalspin"],
    "abomasnow": ["icehammer"],
    "porygonz": ["voltswitch", "flashcannon"],
    "rotom": ["taunt", "agility", "curse"],
    "marowakalola": ["perishsong", "poweruppunch", "curse", "ancientpower", "fissure"],
    "mrmime": ["haze", "stealthrock", "playrough", "firstimpression", "tripleaxel"],
    "crobat": ["nightslash", "knockoff", "psychicfangs"],
    "heatran": ["firstimpression"],
    "darkrai": ["shadowsneak", "futuresight", "crunch", "iciclespear", "vacuumwave"],
    "liepard": ["partingshot", "firefang", "icefang", "thunderfang", "crunch", "swordsdance", "agility", "xscissor", "psychicfangs", "firstimpression"],
    "musharna": ["triattack"],
    "skarmory": ["scaleshot"],
    "tyranitar": ["scorchingsands", "scaleshot"],
    "sceptile": ["dragonrush"],
    "blaziken": ["circlethrow", "drainpunch"],
    "swampert": ["sludgebomb", "fissure"],
    "aggron": ["scorchingsands"],
    "manectric": ["flamecharge", "trailblaze"],
    "grumpig": ["hypnosis"],
    "audino": ["triattack"],
    "throh": ["rockblast", "amnesia", "outrage", "dynamicpunch", "ironhead", "irondefense", "gunkshot", "closecombat", "seedbomb"],
    "sawk": ["machpunch", "outrage", "dynamicpunch", "swordsdance", "bodyslam", "ironhead", "drainpunch", "irondefense", "blazekick"],
    "cofagrigus": ["psyshock", "partingshot", "thunderwave", "stealthrock", "icywind"],
    "amoonguss": ["toxicspikes", "dazzlinggleam", "firstimpression"],
    "meloetta": ["flipturn", "powergem", "agility"],
    "genesect": ["lunge", "shadowball", "ancientpower"],
    "delphox": ["chargebeam"],
    "diggersby": ["drainpunch"],
    "aurorus": ["icehammer"],
    "dedenne": ["fakeout"],
    "noivern": ["scaleshot"],
    "xerneas": ["trailblaze", "seedbomb", "solarblade"],
    "crabominable": ["machpunch", "taunt", "firstimpression", "iciclespear"],
    "golisopod": ["nightslash", "agility", "uturn", "gunkshot"],
    "palossand": ["darkpulse", "powergem", "nastyplot", "fakeout"],
    "mimikyu": ["nightslash"],
    "magearna": ["powergem", "vacuumwave", "solarblade"],
    "marshadow": ["poweruppunch", "machpunch", "vacuumwave"],
    "zeraora": ["dynamicpunch", "vacuumwave"],
    "thievul": ["roar", "icywind", "willowisp", "trailblaze", "fakeout", "firstimpression"],
    "toxtricity": ["zapcannon"],
    "perrserker": ["hypnosis", "outrage", "thunderwave", "bulkup", "liquidation", "spikes"],
    "sirfetchd": ["agility", "uturn", "irontail"],
    "mrrime": ["haze", "infestation", "stealthrock", "thunderpunch", "chargebeam", "swagger", "firstimpression"],
    "runerigus": ["infestation", "psyshock", "partingshot", "thunderwave", "gigadrain", "knockoff", "icywind"],
    "overqwil": ["mortalspin", "thunderwave"],
    "annihilape": ["knockoff", "roar"],
    "gholdengo": ["surf"]
}

# 1. Parse the Pokemon Champions Learnsets
champions_file_path = r"C:\Users\fulto\.gemini\antigravity-ide\brain\3a121877-a99b-411f-8a76-778c82f7a547\.system_generated\steps\9\content.md"
with open(champions_file_path, 'r', encoding='utf-8') as f:
    champions_content = f.read()

# Try to find the export const Learnsets block.
start_idx = champions_content.find("export const Learnsets")
if start_idx == -1:
    print("Could not find Learnsets block")
    exit(1)

content_ts = champions_content[start_idx:]

# We'll just replace "9M" with "7M". 
content_ts = content_ts.replace('["9M"]', '["7M"]')

# Now we need to parse this into a manageable form to add our PLZA moves.
# Because doing full AST parsing of TS in python is hard, we'll do some string manipulation.
# Wait, if we just convert the TS block into something JSON-like...
# Actually, an easier way is to write a JS script that `require`s the champions TS file (by removing the types),
# but wait, we can just do regex insertions!

out_lines = []
in_learnset = False
current_mon = None

for line in content_ts.split('\n'):
    match_mon = re.match(r'\s*([a-z0-9]+):\s*\{', line)
    if match_mon and "learnset" not in match_mon.group(1):
        current_mon = match_mon.group(1)
        # If this mon has PLZA additions, we can just dump them in its learnset block
        out_lines.append(line)
        continue
    
    match_learnset_end = re.match(r'\s*\},?', line)
    
    if current_mon and '}' in line and 'learnset' not in line:
        # Wait, the structure is:
        # charizard: {
        #   learnset: {
        #     move: ["7M"],
        #   }
        # },
        pass
        
    out_lines.append(line)

# Let's just do a simpler approach: build a dict of additions and dump it as TS.
# We can extract the Pokemon Champions moves manually with regex.
mon_moves = {}
curr_mon = None
for line in content_ts.split('\n'):
    mon_match = re.match(r'\s*([a-z0-9]+):\s*\{', line)
    if mon_match and mon_match.group(1) != 'Learnsets' and mon_match.group(1) != 'learnset':
        curr_mon = mon_match.group(1)
        if curr_mon not in mon_moves:
            mon_moves[curr_mon] = set()
    elif curr_mon:
        move_match = re.match(r'\s*([a-z0-9]+):\s*\["7M"\]', line)
        if move_match:
            mon_moves[curr_mon].add(move_match.group(1))

# Merge PLZA
for mon, moves in plza_additions.items():
    if mon not in mon_moves:
        mon_moves[mon] = set()
    for move in moves:
        mon_moves[mon].add(move.lower().replace('-', '').replace(' ', ''))

# Generate TS code
out_ts = "export const Learnsets: import('../../../sim/dex-species').ModdedLearnsetDataTable = {\n"
for mon in sorted(mon_moves.keys()):
    if not mon_moves[mon]:
        continue
    out_ts += f"\t{mon}: {{\n\t\tinherit: true,\n\t\tlearnset: {{\n"
    for move in sorted(mon_moves[mon]):
        out_ts += f"\t\t\t{move}: [\"7M\"],\n"
    out_ts += "\t\t},\n\t},\n"
out_ts += "};\n"

with open(r"c:\Users\fulto\Downloads\3DS\DH2\data\mods\gen7mod\learnsets.ts", 'w', encoding='utf-8') as f:
    f.write(out_ts)

print("Created learnsets.ts with merged additions!")
