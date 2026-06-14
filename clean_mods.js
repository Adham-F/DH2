const fs = require('fs');
const path = require('path');

const officialMods = new Set([
	'gen1', 'gen1stadium',
	'gen2', 'gen2stadium2',
	'gen3',
	'gen4', 'gen4pt',
	'gen5', 'gen5bw1',
	'gen6', 'gen6xy',
	'gen7', 'gen7letsgo', 'gen7sm', 'gen7mod',
	'gen8', 'gen8bdsp', 'gen8dlc1',
	'gen9predlc', 'gen9dlc1'
]);

const dirsToClean = [
	path.join(__dirname, 'data', 'mods'),
	path.join(__dirname, 'data', 'random-battles')
];

let deletedMods = [];

for (const dir of dirsToClean) {
	if (!fs.existsSync(dir)) continue;
	const items = fs.readdirSync(dir);
	for (const item of items) {
		if (!officialMods.has(item)) {
			const fullPath = path.join(dir, item);
			if (fs.statSync(fullPath).isDirectory()) {
				fs.rmSync(fullPath, { recursive: true, force: true });
				deletedMods.push(item);
			}
		}
	}
}
console.log('Deleted ' + deletedMods.length + ' custom pet mods.');
