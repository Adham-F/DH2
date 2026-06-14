const fs=require('fs');
let dex=fs.readFileSync('data/mods/gen7mod/pokedex.ts','utf8');
const adds={
    absol:{o:'["Absol-Mega", "Absol-Mega-Z"]',f:'["Absol", "Absol-Mega", "Absol-Mega-Z"]'},
    garchomp:{o:'["Garchomp-Mega", "Garchomp-Mega-Z"]',f:'["Garchomp", "Garchomp-Mega", "Garchomp-Mega-Z"]'},
    lucario:{o:'["Lucario-Mega", "Lucario-Mega-Z"]',f:'["Lucario", "Lucario-Mega", "Lucario-Mega-Z"]'},
    hawlucha:{o:'["Hawlucha-Mega-Z"]',f:'["Hawlucha", "Hawlucha-Mega-Z"]'},
    malamar:{o:'["Malamar-Mega-Z"]',f:'["Malamar", "Malamar-Mega-Z"]'},
    greninja:{o:'["Greninja-Ash", "Greninja-Mega-Z"]',f:'["Greninja", "Greninja-Ash", "Greninja-Mega-Z"]'},
    froslass:{o:'["Froslass-Mega-Z"]',f:'["Froslass", "Froslass-Mega-Z"]'},
    diancie:{o:'["Diancie-Mega", "Diancie-Mega-Z"]',f:'["Diancie", "Diancie-Mega", "Diancie-Mega-Z"]'}
};
for(const [s,d] of Object.entries(adds)){
    dex=dex.replace(`\t${s}: {\n\t\tinherit: true,`,`\t${s}: {\n\t\tinherit: true,\n\t\totherFormes: ${d.o},\n\t\tformeOrder: ${d.f},`);
}
fs.writeFileSync('data/mods/gen7mod/pokedex.ts',dex);
console.log('done');
