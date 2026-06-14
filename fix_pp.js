const fs = require('fs');
const file = 'data/mods/gen7mod/moves.ts';
let moves = fs.readFileSync(file, 'utf8');

// Regex to match a move object. A move starts with \t[a-z0-9]+: {\n and ends with \t},\n
const regex = /^(\t)([a-z0-9]+):\s*\{\r?\n([\s\S]*?)\r?\n\1\},?\r?\n/gmi;

let newMoves = moves.replace(regex, (match, indent, moveId, content) => {
	// Remove noPPBoosts
	let newContent = content.replace(/\s*noPPBoosts:\s*true,/g, '');
	
	// If it inherits, remove pp override
	if (/inherit:\s*true/i.test(newContent)) {
		newContent = newContent.replace(/\s*pp:\s*\d+,/g, '');
	}
	
	// Check if newContent only consists of whitespace and 'inherit: true,'
	let strippedContent = newContent.replace(/inherit:\s*true,/g, '').trim();
	if (strippedContent.length === 0) {
		// The move object is now empty (only had inherit, pp, noPPBoosts)
		return ''; // Delete the move block completely
	}
	
	return indent + moveId + ': {\n' + newContent + '\n' + indent + '},\n';
});

fs.writeFileSync('data/mods/gen7mod/moves.ts', newMoves);
console.log('Fixed weird PP problems in moves.ts');
