import re

filepath = r"c:\Users\fulto\Downloads\3DS\DH2\data\mods\gen7mod\learnsets.ts"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# The regex matches:
# \t[a-z0-9]+: {\n
# and we want to append \t\tinherit: true,\n if it isn't already there.

def replacer(match):
    # match.group(0) is like "\tabsol: {\n"
    # We should check if the next line is "inherit: true"
    # But since we are doing a sub, it's easier to just do:
    return match.group(0) + "\t\tinherit: true,\n"

# First, let's remove any existing inherit: true to be safe and avoid duplicates,
# just in case a few mons have it.
content = re.sub(r'\t\tinherit: true,\n', '', content)

# Now add it back for all pokemon
# Match pokemon definition like "\tmonname: {\n"
content = re.sub(r'\t[a-z0-9]+: \{\n', replacer, content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Restored inherit: true!")
