const fs = require('fs');
const itemsFile = 'data/mods/gen7mod/items.ts';
const dexFile = 'data/mods/gen7mod/pokedex.ts';

const items = fs.readFileSync(itemsFile, 'utf8');
let dexLines = fs.readFileSync(dexFile, 'utf8').split(/\r?\n/);

const regex = /name:\s*"([^"]+)"[\s\S]*?megaStone:\s*"([^"]+)"/gmi;
let match;
let megaStones = {};

while ((match = regex.exec(items)) !== null) {
	megaStones[match[2]] = match[1];
}

console.log('Found mega stones:', megaStones);

let modified = 0;

for (let i = 0; i < dexLines.length; i++) {
	let nameMatch = dexLines[i].match(/^\t\tname:\s*"([^"]+)",/i);
	if (nameMatch) {
		let speciesName = nameMatch[1];
		if (megaStones[speciesName]) {
			let hasRequiredItem = false;
			let j = i + 1;
			while (j < dexLines.length && !dexLines[j].match(/^\t\},/)) {
				if (dexLines[j].includes('requiredItem:')) hasRequiredItem = true;
				j++;
			}
			
			if (!hasRequiredItem) {
				dexLines.splice(i + 1, 0, '\t\trequiredItem: "' + megaStones[speciesName] + '",');
				modified++;
			}
		}
	}
}

fs.writeFileSync(dexFile, dexLines.join('\n'));
console.log('Added requiredItem to ' + modified + ' species.');
