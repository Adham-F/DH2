const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data/mods/gen7mod/moves.ts');
let content = fs.readFileSync(file, 'utf8');

// The error says ceaselessedge is on line 3 and line 2958.
// Let's just remove the first occurrence if it's the one with inherit: true.
content = content.replace(/\s*ceaselessedge:\s*\{\s*inherit:\s*true,\s*isNonstandard:\s*null\s*\},?/, '');

fs.writeFileSync(file, content);
console.log('Fixed ceaselessedge');
