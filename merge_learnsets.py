import re

gen7mod_filepath = r"c:\Users\fulto\Downloads\3DS\DH2\data\mods\gen7mod\learnsets.ts"
base_filepath = r"c:\Users\fulto\Downloads\3DS\DH2\data\learnsets.ts"

# 1. Parse the custom moves
gen7mod_moves = {}
with open(gen7mod_filepath, "r", encoding="utf-8") as f:
    current_mon = None
    for line in f:
        mon_match = re.match(r'^\t([a-z0-9]+): \{', line)
        if mon_match:
            current_mon = mon_match.group(1)
            gen7mod_moves[current_mon] = {}
            continue
            
        move_match = re.match(r'^\t\t\t([a-z0-9]+): \[(.+)\]', line)
        if move_match and current_mon:
            move = move_match.group(1)
            sources = [s.strip().strip('"\'') for s in move_match.group(2).split(',')]
            gen7mod_moves[current_mon][move] = sources

# 2. Parse the base learnsets and merge
out_lines = []
with open(base_filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

current_mon = None
in_learnset = False
seen_moves = set()
base_mons_seen = set()

# The base file starts with: export const Learnsets: import('../sim/dex-species').LearnsetDataTable = {
# For the mod, we should change the import path to match the original mod file.
# The mod file starts with: export const Learnsets: import('../../../sim/dex-species').ModdedLearnsetDataTable = {
out_lines.append("export const Learnsets: import('../../../sim/dex-species').ModdedLearnsetDataTable = {\n")

for line in lines[1:]: # Skip the first line
    mon_match = re.match(r'^\t([a-z0-9]+): \{', line)
    if mon_match:
        current_mon = mon_match.group(1)
        base_mons_seen.add(current_mon)
        seen_moves = set()
        out_lines.append(line)
        continue
        
    learnset_match = re.match(r'^\t\tlearnset: \{', line)
    if learnset_match:
        in_learnset = True
        out_lines.append(line)
        continue
        
    if in_learnset:
        move_match = re.match(r'^\t\t\t([a-z0-9]+): \[(.+)\]', line)
        if move_match:
            move = move_match.group(1)
            seen_moves.add(move)
            
            # Check if we need to add "7M" to this move
            if current_mon in gen7mod_moves and move in gen7mod_moves[current_mon]:
                sources = move_match.group(2)
                if '"7M"' not in sources and "'7M'" not in sources:
                    # Inject "7M" at the beginning
                    line = line.replace('[', '["7M", ')
            
            out_lines.append(line)
            continue
            
        end_learnset_match = re.match(r'^\t\t\},?', line)
        if end_learnset_match:
            # We are closing the learnset block.
            # Insert any missing custom moves here.
            if current_mon in gen7mod_moves:
                for custom_move, custom_sources in gen7mod_moves[current_mon].items():
                    if custom_move not in seen_moves:
                        # Format the sources
                        src_str = ", ".join([f'"{s}"' for s in custom_sources])
                        out_lines.append(f'\t\t\t{custom_move}: [{src_str}],\n')
            in_learnset = False
            out_lines.append(line)
            continue

    # If it's the very last closing brace, we stop so we can append custom mons
    if line.strip() == "};":
        break

    out_lines.append(line)

# 3. Append any Pokemon that are ONLY in gen7mod (like custom megas or forms)
for mon, moves in gen7mod_moves.items():
    if mon not in base_mons_seen:
        out_lines.append(f"\t{mon}: {{\n")
        out_lines.append("\t\tlearnset: {\n")
        for custom_move, custom_sources in moves.items():
            src_str = ", ".join([f'"{s}"' for s in custom_sources])
            out_lines.append(f'\t\t\t{custom_move}: [{src_str}],\n')
        out_lines.append("\t\t},\n")
        out_lines.append("\t},\n")

out_lines.append("};\n")

# Write it out
with open(gen7mod_filepath, "w", encoding="utf-8") as f:
    f.writelines(out_lines)

print("Successfully merged learnsets!")
