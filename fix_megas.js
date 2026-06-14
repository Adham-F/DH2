const fs = require('fs');
const file = 'data/mods/gen7mod/pokedex.ts';
let pokedex = fs.readFileSync(file, 'utf8');

const regex = /^(\s*)([a-z0-9]+)(mega[xyz]?):\s*\{\s*$/gmi;
pokedex = pokedex.replace(regex, (match, indent, baseId, formePart) => {
	if (baseId + formePart === 'yanmega') return match;
	
	let baseName = baseId.charAt(0).toUpperCase() + baseId.slice(1);
	
	// special cases
	if (baseId === 'mrmime') baseName = 'Mr. Mime';
	if (baseId === 'mimejr') baseName = 'Mime Jr.';
	if (baseId === 'type-null') baseName = 'Type: Null';
	if (baseId === 'tapukoko') baseName = 'Tapu Koko';
	if (baseId === 'tapulele') baseName = 'Tapu Lele';
	if (baseId === 'tapubulu') baseName = 'Tapu Bulu';
	if (baseId === 'tapufini') baseName = 'Tapu Fini';
	if (baseId === 'hooh') baseName = 'Ho-Oh';
	
	let forme = 'Mega';
	if (formePart.length > 4) {
		forme = 'Mega-' + formePart.charAt(4).toUpperCase();
	}
	
	let fullName = baseName + '-' + forme;
	
	return match + '\n' + indent + '\tname: "' + fullName + '",\n' + indent + '\tbaseSpecies: "' + baseName + '",\n' + indent + '\tforme: "' + forme + '",';
});

fs.writeFileSync(file, pokedex);
console.log('Added baseSpecies and forme to all megas in pokedex.ts');
