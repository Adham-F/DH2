const fs = require('fs');

const path = 'data/mods/gen7mod/formats-data.ts';
let code = fs.readFileSync(path, 'utf8');

const regex = /^\t([a-z0-9]+?)(mega[a-z]?|megaz): \{/gm;
let match;
const replacements = [];

while ((match = regex.exec(code)) !== null) {
    const fullKey = match[1] + match[2];
    const baseKey = match[1];

    // Find the base tier in the file
    const baseRegex = new RegExp(`^\\t${baseKey}: \\{[\\s\\S]*?\\n\\t\\ttier: "([^"]+)",`, 'm');
    const baseMatch = code.match(baseRegex);
    
    if (baseMatch) {
        const targetTier = baseMatch[1];
        
        const megaBlockRegex = new RegExp(`^\\t${fullKey}: \\{[\\s\\S]*?\\n\\t\\ttier: "[^"]+",`, 'm');
        const blockMatch = code.match(megaBlockRegex);
        
        if (blockMatch) {
            replacements.push({
                megaKey: fullKey,
                targetTier,
                regex: megaBlockRegex
            });
        }
    }
}

console.log(`Found ${replacements.length} Megas to update.`);

for (const rep of replacements) {
    code = code.replace(rep.regex, (blockMatch) => {
        return blockMatch.replace(/tier: "[^"]+"/, `tier: "${rep.targetTier}"`);
    });
}

fs.writeFileSync(path, code);
console.log('Done modifying formats-data.ts');
