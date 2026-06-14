const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data/mods/gen7mod/items.ts');
let content = fs.readFileSync(file, 'utf8');

const regex = /return !item\.megaStone \|\| \(\!item\.megaStone\[source\.baseSpecies\.name\] &&[\s\S]*?\!Object\.values\(item\.megaStone\)\.includes\(source\.baseSpecies\.name\)\);/g;

content = content.replace(regex, 'if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;\n\t\t\treturn true;');

fs.writeFileSync(file, content);
console.log('Fixed complex onTakeItem in items.ts');
