/**
 * Comprehensive gen7mod fixer script.
 * Applies all fixes from the implementation plan:
 * 1. Fix items.ts: megaStone object → string + megaEvolves + desc
 * 2. Fix scripts.ts: add noPPBoosts line
 * 3. Fix sim/dex-species.ts: expand isMega detection
 * 4. Fix formats-data.ts: apply Gen 7 tiers
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MOD = path.join(ROOT, 'data/mods/gen7mod');

// ============================================================
// 1. FIX ITEMS.TS - Convert megaStone objects to proper format
// ============================================================
console.log('=== Fixing items.ts ===');
let items = fs.readFileSync(path.join(MOD, 'items.ts'), 'utf8');

// Fix simple single-species megaStone objects: { "Species": "Forme" }
items = items.replace(
    /megaStone:\s*\{\s*"([^"]+)":\s*"([^"]+)"\s*\},?\s*\n(\s*)itemUser:\s*\[/g,
    (match, species, megaForme, indent) => {
        return `megaStone: "${megaForme}",\n${indent}megaEvolves: "${species}",\n${indent}desc: "If held by ${species}, this item allows it to Mega Evolve in battle.",\n${indent}itemUser: [`;
    }
);

// Fix multi-species megaStone objects (Lycanite, Magearnite, Meowsticite, Tatsugirinite)
// Lycanite: Use Lycanroc as primary
items = items.replace(
    /megaStone:\s*\{\s*"Lycanroc":\s*"Lycanroc-Mega",\s*"Lycanroc-Midnight":\s*"Lycanroc-Mega-Midnight",\s*"Lycanroc-Dusk":\s*"Lycanroc-Mega-Dusk"\s*\},?\s*\n(\s*)itemUser:/g,
    (match, indent) => {
        return `megaStone: "Lycanroc-Mega",\n${indent}megaEvolves: "Lycanroc",\n${indent}desc: "If held by Lycanroc, this item allows it to Mega Evolve in battle.",\n${indent}itemUser:`;
    }
);

// Magearnite
items = items.replace(
    /megaStone:\s*\{\s*\n\s*"Magearna":\s*"Magearna-Mega",\s*\n\s*"Magearna-Original":\s*"Magearna-Original-Mega",\s*\n\s*\},?\s*\n(\s*)itemUser:/g,
    (match, indent) => {
        return `megaStone: "Magearna-Mega",\n${indent}megaEvolves: "Magearna",\n${indent}desc: "If held by Magearna, this item allows it to Mega Evolve in battle.",\n${indent}itemUser:`;
    }
);

// Meowsticite
items = items.replace(
    /megaStone:\s*\{\s*\n\s*"Meowstic":\s*"Meowstic-M-Mega",\s*\n\s*"Meowstic-F":\s*"Meowstic-F-Mega",\s*\n\s*\},?\s*\n(\s*)itemUser:/g,
    (match, indent) => {
        return `megaStone: "Meowstic-M-Mega",\n${indent}megaEvolves: "Meowstic",\n${indent}desc: "If held by Meowstic, this item allows it to Mega Evolve in battle.",\n${indent}itemUser:`;
    }
);

// Tatsugirinite
items = items.replace(
    /megaStone:\s*\{\s*\n\s*"Tatsugiri":\s*"Tatsugiri-Curly-Mega",\s*\n\s*"Tatsugiri-Droopy":\s*"Tatsugiri-Droopy-Mega",\s*\n\s*"Tatsugiri-Stretchy":\s*"Tatsugiri-Stretchy-Mega",\s*\n\s*\},?\s*\n(\s*)itemUser:/g,
    (match, indent) => {
        return `megaStone: "Tatsugiri-Curly-Mega",\n${indent}megaEvolves: "Tatsugiri",\n${indent}desc: "If held by Tatsugiri, this item allows it to Mega Evolve in battle.",\n${indent}itemUser:`;
    }
);

// Floettite (Floette-Eternal → Floette-Mega)
items = items.replace(
    /megaStone:\s*\{\s*"Floette-Eternal":\s*"Floette-Mega"\s*\},?\s*\n(\s*)itemUser:/g,
    (match, indent) => {
        return `megaStone: "Floette-Mega",\n${indent}megaEvolves: "Floette-Eternal",\n${indent}desc: "If held by Floette-Eternal, this item allows it to Mega Evolve in battle.",\n${indent}itemUser:`;
    }
);

// Hoopanite (Hoopa-Unbound → Hoopa-Mega)
items = items.replace(
    /megaStone:\s*\{\s*"Hoopa-Unbound":\s*"Hoopa-Mega"\s*\},?\s*\n(\s*)itemUser:/g,
    (match, indent) => {
        return `megaStone: "Hoopa-Mega",\n${indent}megaEvolves: "Hoopa-Unbound",\n${indent}desc: "If held by Hoopa-Unbound, this item allows it to Mega Evolve in battle.",\n${indent}itemUser:`;
    }
);

// Zygardite (Zygarde-Complete → Zygarde-Mega)
items = items.replace(
    /megaStone:\s*\{\s*"Zygarde-Complete":\s*"Zygarde-Mega"\s*\},?\s*\n(\s*)itemUser:/g,
    (match, indent) => {
        return `megaStone: "Zygarde-Mega",\n${indent}megaEvolves: "Zygarde-Complete",\n${indent}desc: "If held by Zygarde-Complete, this item allows it to Mega Evolve in battle.",\n${indent}itemUser:`;
    }
);

// Verify no remaining object-style megaStones
const remaining = items.match(/megaStone:\s*\{/g);
if (remaining) {
    console.log(`  WARNING: ${remaining.length} object-style megaStone entries remain (complex multi-form items, OK).`);
} else {
    console.log('  All megaStone entries converted to string format.');
}

fs.writeFileSync(path.join(MOD, 'items.ts'), items);
console.log('  items.ts saved.');

// ============================================================
// 2. FIX SCRIPTS.TS - Add noPPBoosts line
// ============================================================
console.log('=== Fixing scripts.ts ===');
let scripts = fs.readFileSync(path.join(MOD, 'scripts.ts'), 'utf8');

// Check if noPPBoosts is already there
if (!scripts.includes('noPPBoosts')) {
    scripts = scripts.replace(
        /this\.modData\('Moves', i\)\.pp = 20;\s*\n\s*\}/,
        `this.modData('Moves', i).pp = 20;\n\t\t\t}\n\t\t\tthis.modData('Moves', i).noPPBoosts = true;`
    );
    console.log('  Added noPPBoosts line.');
} else {
    console.log('  noPPBoosts already present.');
}

fs.writeFileSync(path.join(MOD, 'scripts.ts'), scripts);
console.log('  scripts.ts saved.');

// ============================================================
// 3. FIX sim/dex-species.ts - Expand isMega detection
// ============================================================
console.log('=== Fixing sim/dex-species.ts ===');
const dexSpeciesPath = path.join(ROOT, 'sim/dex-species.ts');
let dexSpecies = fs.readFileSync(dexSpeciesPath, 'utf8');

// Replace the strict isMega check with startsWith('Mega')
if (dexSpecies.includes("this.isMega = ['Mega', 'Mega-X', 'Mega-Y'].includes(this.forme)")) {
    dexSpecies = dexSpecies.replace(
        "this.isMega = ['Mega', 'Mega-X', 'Mega-Y'].includes(this.forme)",
        "this.isMega = this.forme.startsWith('Mega')"
    );
    console.log('  Updated isMega to use startsWith("Mega").');
} else if (dexSpecies.includes("this.forme.startsWith('Mega')")) {
    console.log('  isMega already uses startsWith("Mega").');
} else {
    console.log('  WARNING: Could not find isMega assignment pattern.');
}

fs.writeFileSync(dexSpeciesPath, dexSpecies);
console.log('  dex-species.ts saved.');

// ============================================================
// 4. FIX formats-data.ts - Apply Gen 7 tiers
// ============================================================
console.log('=== Fixing formats-data.ts ===');
const gen7FormatsPath = path.join(ROOT, 'data/mods/gen7/formats-data.ts');
const gen7modFormatsPath = path.join(MOD, 'formats-data.ts');

if (fs.existsSync(gen7FormatsPath)) {
    const gen7 = fs.readFileSync(gen7FormatsPath, 'utf8');
    let gen7mod = fs.readFileSync(gen7modFormatsPath, 'utf8');

    // Parse gen7 tiers
    const gen7Tiers = {};
    const regex = /(\w+):\s*\{\s*\n?\s*tier:\s*"([^"]+)"/g;
    let match;
    while ((match = regex.exec(gen7)) !== null) {
        gen7Tiers[match[1]] = match[2];
    }
    console.log(`  Found ${Object.keys(gen7Tiers).length} tier entries in gen7 formats-data.`);

    // Replace tiers in gen7mod  
    let replaced = 0;
    gen7mod = gen7mod.replace(/(\w+):\s*\{([^}]*?)tier:\s*"([^"]+)"/g, (match, id, between, tier) => {
        if (gen7Tiers[id] && gen7Tiers[id] !== tier) {
            replaced++;
            return `${id}: {${between}tier: "${gen7Tiers[id]}"`;
        }
        return match;
    });
    console.log(`  Updated ${replaced} tier entries to match Gen 7 tiers.`);

    fs.writeFileSync(gen7modFormatsPath, gen7mod);
    console.log('  formats-data.ts saved.');
} else {
    console.log('  WARNING: gen7/formats-data.ts not found, skipping tier fix.');
}

// ============================================================
// 5. FIX index.html - Avoid HTTPS mixed content
// ============================================================
console.log('=== Fixing server/static/index.html ===');
const indexPath = path.join(ROOT, 'server/static/index.html');
if (fs.existsSync(indexPath)) {
    const newIndex = `<!DOCTYPE html>
<script>
// Redirect to the official PS client with our server as the host.
// We avoid redirecting to localhost.psim.us because Cloudflare/HSTS forces
// HTTPS on *.psim.us, which then blocks ws:// WebSocket connections (mixed content).
var host = document.location.hostname;
var port = document.location.port || '8000';
document.location.replace(
\t'https://play.pokemonshowdown.com/~~' + host + ':' + port + '/'
);
</script>
<p>This is a <a href="http://www.pokemonshowdown.com">Pok&eacute;mon Showdown</a> server!</p>
<noscript><p>Try enabling <a href="http://enable-javascript.com/en/">JavaScript</a> to play!</p></noscript>
`;
    fs.writeFileSync(indexPath, newIndex);
    console.log('  index.html updated to avoid HTTPS mixed content issue.');
} else {
    console.log('  WARNING: server/static/index.html not found.');
}

console.log('\n=== All fixes applied! ===');
console.log('Run "node build" to compile, then "node pokemon-showdown" to start.');
