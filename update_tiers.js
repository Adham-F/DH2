const fs = require('fs');
let code = fs.readFileSync('data/mods/gen7mod/formats-data.ts', 'utf8');

const mapping = {
    'absolmegaz': 'PU',
    'garchompmegaz': 'OU',
    'lucariomegaz': 'UU',
    'hawluchamegaz': 'OU',
    'malamarmegaz': 'NU',
    'greninjamegaz': 'OU',
    'froslassmegaz': 'UU',
    'dianciemegaz': 'RU'
};

for (const [species, tier] of Object.entries(mapping)) {
    const regex = new RegExp(`(\t${species}: \\{\\r?\\n\\t\\ttier: ").*?(",)`, 'g');
    code = code.replace(regex, `$1${tier}$2`);
}

fs.writeFileSync('data/mods/gen7mod/formats-data.ts', code);
