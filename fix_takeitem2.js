const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data/mods/gen7mod/items.ts');
let content = fs.readFileSync(file, 'utf8');

const targetStr = 'return !item.megaStone?.[source.baseSpecies.baseSpecies];';
const replaceStr = 'if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;\n\t\t\treturn true;';

let count = 0;
while(content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    count++;
}

console.log('Replaced ' + count + ' occurrences');
fs.writeFileSync(file, content);
