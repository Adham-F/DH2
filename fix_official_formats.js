const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'config/official-formats.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ Formats as BadNBoosted\} from '\.\.\/data\/mods\/badnboosted\/formats';\r?\n/, '');
content = content.replace(/\s*\.\.\.BadNBoosted,/, '');

fs.writeFileSync(file, content);
console.log('Fixed official-formats.ts');
