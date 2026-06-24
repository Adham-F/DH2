import re

ubers = []
with open(r'c:\Users\fulto\Downloads\3DS\DH2\data\mods\gen7\formats-data.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    current_mon = None
    for line in lines:
        m = re.match(r'\s*([a-z0-9]+):\s*\{', line)
        if m:
            current_mon = m.group(1)
        if 'tier: "Uber"' in line:
            if current_mon:
                ubers.append(current_mon)

print(", ".join(ubers))
