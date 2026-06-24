import re

ou_list = [
    "absolmegaz", "aegislash", "aerodactylmega", "alakazammega", "blaziken",
    "charizardmegax", "charizardmegay", "clefable", "cresseliamega", "darkrai",
    "deoxysspeed", "dianciemega", "dragonite", "excadrill", "ferrothorn",
    "floettemega", "fluttermane", "flygon", "flygonmega", "froslassmega",
    "froslassmegaz", "garchomp", "garchompmegaz", "gliscor", "golisopodmega",
    "goodra", "goodramega", "gougingfire", "greattusk", "greninja", "greninjaash",
    "greninjamega", "greninjamegaz", "gyarados", "hawlucha", "heatran", "heatranmega",
    "hoopaunbound", "hydreigonmega", "ironcrown", "ironhands", "ironmoth",
    "irontreads", "ironvaliant", "jirachi", "kartana", "keldeo", "keldeoresolute",
    "keldeomega", "kingambit", "kingdramega", "kommoo", "kommoototem", "kyurem",
    "landorustherian", "latiasmega", "latiosmega", "lopunnymega", "lycanrocmegadusk",
    "magearna", "manectricmega", "mawilemega", "medichammega", "meganiummega",
    "ragingbolt", "raichumegay", "roaringmoon", "rotomheat", "rotomwash",
    "sableyemega", "samurotthisui", "sandyshocks", "scizormega", "serperior",
    "silvally", "skarmorymega", "slowbro", "slowkinggalar", "sneasler", "solgaleo",
    "staraptormega", "swampertmega", "tapubulu", "tapufini", "tapukoko", "tapulele",
    "tornadustherian", "toxicroakmega", "tyranitar", "tyranitarmega", "versaluna",
    "ursaluna", "ursalunabloodmoon", "venusaurmega", "victini", "volcanion",
    "volcanionmega", "volcarona", "volcaronamega", "walkingwake", "weavile",
    "zapdos", "zeraora", "zeraoramega"
]

uber_list = [
    "ironbundle", "hoopamega", "dianciemegaz", "gengarmega", "gothitellemega",
    "lucariomega", "lucariomegaz", "metagrossmega", "salamencemega", "starmiemega",
    "blazikenmega"
]

def get_base_form(mon):
    if mon in ["yanmega", "meganium"]:
        return mon, False
    if "mega" in mon:
        return mon.split("mega")[0], True
    return mon, False

# Find all megas in pokedex
all_megas = set()
with open(r"c:\Users\fulto\Downloads\3DS\DH2\data\mods\gen7mod\pokedex.ts", "r", encoding="utf-8") as f:
    for line in f:
        mon_match = re.match(r'\s*([a-z0-9]+):\s*\{', line)
        if mon_match:
            mon = mon_match.group(1)
            _, is_mega = get_base_form(mon)
            if is_mega:
                all_megas.add(mon)

with open(r"c:\Users\fulto\Downloads\3DS\DH2\data\mods\gen7mod\formats-data.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

out_lines = []
in_mon = False
current_mon = None
current_tier_raw = None

# keep track of what we processed
processed_mons = set()

for i, line in enumerate(lines):
    mon_match = re.match(r'\s*([a-z0-9]+):\s*\{', line)
    if mon_match:
        current_mon = mon_match.group(1)
        processed_mons.add(current_mon)
        in_mon = True
        current_tier_raw = None
    
    tier_match = re.match(r'(\s*tier:\s*")[^"]+("\s*,?)', line)
    if in_mon and tier_match:
        current_tier_raw = re.search(r'tier:\s*"([^"]+)"', line).group(1)
        
        base_form, is_mega = get_base_form(current_mon)
        
        new_tier = "UU"
        
        if current_mon in ou_list:
            new_tier = "OU"
        elif current_mon in uber_list:
            new_tier = "Uber"
        elif current_mon.startswith("silvally") and current_mon != "silvally":
            new_tier = "Unreleased"
        elif current_tier_raw in ["LC", "NFE"]:
            new_tier = current_tier_raw
        elif is_mega and base_form in ou_list:
            # It's a mega form, it's not explicitly listed in OU or Uber.
            # Its base form is in OU.
            new_tier = "(OU)"
        elif is_mega and base_form in uber_list:
            new_tier = "(Uber)"
        else:
            new_tier = "UU"
            if current_tier_raw in ["LC", "NFE"]:
                new_tier = current_tier_raw
                
        line = tier_match.group(1) + new_tier + tier_match.group(2) + "\n"

    out_lines.append(line)
    
    if current_mon and "}" in line and not "{" in line:
        in_mon = False
        current_mon = None

# Ensure we add any missing mons from OU/Uber lists and OU megas
missing_mons = []
for m in ou_list + uber_list:
    if m not in processed_mons:
        missing_mons.append(m)

for m in all_megas:
    if m not in processed_mons:
        base, is_mega = get_base_form(m)
        if base in ou_list and m not in ou_list and m not in uber_list:
            missing_mons.append(m)

# Deduplicate
missing_mons = list(set(missing_mons))

if missing_mons:
    # Find the closing brace of FormatsData
    for i in range(len(out_lines) - 1, -1, -1):
        if out_lines[i].strip() == "};":
            insertion = ""
            for m in missing_mons:
                tier = "UU"
                if m in ou_list:
                    tier = "OU"
                elif m in uber_list:
                    tier = "Uber"
                else:
                    base, is_mega = get_base_form(m)
                    if is_mega and base in ou_list:
                        tier = "(OU)"
                insertion += f"\t{m}: {{\n\t\ttier: \"{tier}\",\n\t\tdoublesTier: \"DOU\",\n\t\tnatDexTier: \"OU\",\n\t}},\n"
            out_lines.insert(i, insertion)
            break

with open(r"c:\Users\fulto\Downloads\3DS\DH2\data\mods\gen7mod\formats-data.ts", "w", encoding="utf-8") as f:
    f.writelines(out_lines)

print("Fixed formats-data.ts adding missing megas!")
