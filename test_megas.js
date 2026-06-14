const fs = require('fs');

let pokedex = fs.readFileSync('data/mods/gen7mod/pokedex.ts', 'utf8');

const regex = /^\s*([a-z0-9]+)(mega[xyz]?):\s*\{/gmi;
let match;
while ((match = regex.exec(pokedex)) !== null) {
	let fullMatch = match[0];
	let id = match[1] + match[2];
	if (id === 'yanmega') continue; // yanmega is a base pokemon
	
	let baseId = match[1];
	let formePart = match[2]; // 'mega', 'megax', 'megay', 'megaz'
	
	let baseName = baseId.charAt(0).toUpperCase() + baseId.slice(1);
	let forme = 'Mega';
	if (formePart.length > 4) {
		forme = 'Mega-' + formePart.charAt(4).toUpperCase();
	}
	let fullName = baseName + '-' + forme;
	
	console.log(id, '->', baseName, forme, fullName);
}
