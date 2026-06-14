const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data/mods/gen7mod/items.ts');
let content = fs.readFileSync(file, 'utf8');

// Replace standard onTakeItem
content = content.replace(
	/return !item\.megaStone\?\.\[source\.baseSpecies\.baseSpecies\];/g,
	'if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;\n\t\t\treturn true;'
);

// Floettite / Magearnite / Meowsticite / Tatsugirinite have a custom onTakeItem:
// return !item.megaStone || (!item.megaStone[source.baseSpecies.name] && !Object.values(item.megaStone).includes(source.baseSpecies.name));
content = content.replace(
	/return !item\.megaStone \|\| \(\!item\.megaStone\[source\.baseSpecies\.name\] &&[\s\n]*\!Object\.values\(item\.megaStone\)\.includes\(source\.baseSpecies\.name\)\);/g,
	'if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;\n\t\t\treturn true;'
);

// Zygardite has custom:
// return source.baseSpecies.baseSpecies !== 'Zygarde';
// Actually Zygardite should just follow standard since megaEvolves = 'Zygarde-Complete'
// Let's leave Zygardite if it's already source.baseSpecies.baseSpecies !== 'Zygarde', or just let the standard one override.

fs.writeFileSync(file, content);
console.log('Fixed onTakeItem errors in items.ts');
