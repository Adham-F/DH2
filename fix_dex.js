const fs = require('fs');
const file = 'data/mods/gen7mod/pokedex.ts';
let lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

for (let i = 0; i < lines.length; i++) {
	let match = lines[i].match(/^(\t)([a-z0-9]+)(mega[xyz]?):\s*\{/i);
	if (match) {
		let fullId = match[2] + match[3];
		if (fullId === 'yanmega') continue;
		
		let baseId = match[2];
		let formePart = match[3];
		
		let baseName = baseId.charAt(0).toUpperCase() + baseId.slice(1);
		if (baseId === 'mrmime') baseName = 'Mr. Mime';
		if (baseId === 'mimejr') baseName = 'Mime Jr.';
		if (baseId === 'type-null') baseName = 'Type: Null';
		if (baseId === 'tapukoko') baseName = 'Tapu Koko';
		if (baseId === 'tapulele') baseName = 'Tapu Lele';
		if (baseId === 'tapubulu') baseName = 'Tapu Bulu';
		if (baseId === 'tapufini') baseName = 'Tapu Fini';
		if (baseId === 'hooh') baseName = 'Ho-Oh';
		
		let forme = 'Mega';
		if (formePart.length > 4) forme = 'Mega-' + formePart.charAt(4).toUpperCase();
		
		let fullName = baseName + '-' + forme;
		
		// Check if it already has baseSpecies to avoid duplicates
		let hasBaseSpecies = false;
		let j = i + 1;
		while (j < lines.length && !lines[j].match(/^\t\},/)) {
			if (lines[j].includes('baseSpecies:')) hasBaseSpecies = true;
			j++;
		}
		
		if (!hasBaseSpecies) {
			lines.splice(i + 1, 0, '\t\tname: "' + fullName + '",', '\t\tbaseSpecies: "' + baseName + '",', '\t\tforme: "' + forme + '",');
		}
	}
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed pokedex.ts for real');
