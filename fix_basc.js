const fs = require('fs');
const file = 'data/mods/gen7mod/formats-data.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/basculegionmale:/g, 'basculegion:');
content = content.replace(/basculegionfemale:/g, 'basculegionf:');

fs.writeFileSync(file, content);
