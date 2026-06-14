const fs = require('fs');
const Dex = require('./dist/sim/dex').Dex;

const mod = Dex.mod('gen7mod');
let code = fs.readFileSync('data/mods/gen7mod/formats-data.ts', 'utf8');

const regex = /^\t([a-z0-9]+mega[a-z0-9]*): \{/gm;
let match;
const replacements = [];

while ((match = regex.exec(code)) !== null) {
    const megaKey = match[1];
    
    const species = mod.species.get(megaKey);
    if (!species || !species.baseSpecies) continue;
    
    const baseId = species.baseSpecies.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const baseRegex = new RegExp(`^\\t${baseId}: \\{[\\s\\S]*?\\n\\t\\ttier: "([^"]+)",`, 'm');
    const baseMatch = code.match(baseRegex);
    let targetTier = species.tier; 
    
    if (baseMatch) {
        targetTier = baseMatch[1];
    } else {
        const baseSpeciesData = mod.species.get(baseId);
        targetTier = baseSpeciesData.tier || 'Illegal';
    }
    
    const megaBlockRegex = new RegExp(`^\\t${megaKey}: \\{[\\s\\S]*?\\n\\t\\ttier: "[^"]+",`, 'm');
    const blockMatch = code.match(megaBlockRegex);
    
    if (blockMatch) {
        replacements.push({
            megaKey,
            targetTier,
            regex: megaBlockRegex
        });
    }
}

console.log(`Found ${replacements.length} Megas to update.`);

for (const rep of replacements) {
    code = code.replace(rep.regex, (blockMatch) => {
        return blockMatch.replace(/tier: "[^"]+"/, `tier: "${rep.targetTier}"`);
    });
}

fs.writeFileSync('data/mods/gen7mod/formats-data.ts', code);
console.log('Done modifying formats-data.ts');
