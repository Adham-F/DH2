export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen7',
	init() {
		for (const i in this.data.Moves) {
			if (this.data.Moves[i].pp > 20) {
				this.modData('Moves', i).pp = 20;
			}
		}

		for (const id in this.data.Learnsets) {
			const learnset = this.data.Learnsets[id]?.learnset;
			if (!learnset) continue;
			for (const moveid in learnset) {
				const sources = (learnset as any)[moveid] as string[];
				let modified = false;
				const newSources = sources.map((source: string) => {
					if (source.startsWith('8') || source.startsWith('9')) {
						modified = true;
						return '7' + source.slice(1);
					}
					return source;
				});
				if (modified) {
					if (!this.modData('Learnsets', id).learnset) {
						this.modData('Learnsets', id).learnset = {};
					}
					(this.modData('Learnsets', id).learnset as any)[moveid] = newSources;
				}
			}
		}

		for (const id in this.data.Pokedex) {
			const species = this.data.Pokedex[id];
			const isNewRegional = ['Galar', 'Hisui', 'Paldea'].includes(species.forme || '');
			if (species.num >= 810 || species.id === 'meltan' || species.id === 'melmetal' || isNewRegional) {
				if (species.eggGroups && species.eggGroups[0] === 'Undiscovered') {
					this.modData('Pokedex', id).eggGroups = ['Amorphous'];
				}
				if (!this.data.Learnsets[id]?.learnset) continue;
				const lset = this.modData('Learnsets', id);
				delete lset.eventOnly;
				delete lset.eventData;

				const learnset = lset.learnset as any;
				if (!learnset.return) learnset.return = [];
				if (!learnset.return.includes('7M')) learnset.return.push('7M');

				if (!learnset.frustration) learnset.frustration = [];
				if (!learnset.frustration.includes('7M')) learnset.frustration.push('7M');

				if (!learnset.toxic) learnset.toxic = [];
				if (!learnset.toxic.includes('7M')) learnset.toxic.push('7M');

				if (!learnset.hiddenpower) learnset.hiddenpower = [];
				if (!learnset.hiddenpower.includes('7M')) learnset.hiddenpower.push('7M');
			}
		}

		if (!this.data.Learnsets['zygardemega']) {
			this.data.Learnsets['zygardemega'] = {learnset: {}};
			const baseLearnset = this.modData('Learnsets', 'zygarde').learnset;
			if (baseLearnset) Object.assign(this.data.Learnsets['zygardemega'].learnset, baseLearnset);
		}
		if (!this.data.Learnsets['hoopamega']) {
			this.data.Learnsets['hoopamega'] = {learnset: {}};
			const baseLearnset = this.modData('Learnsets', 'hoopa').learnset;
			if (baseLearnset) Object.assign(this.data.Learnsets['hoopamega'].learnset, baseLearnset);
		}
	},
	calculatePP(move, ppUps) {
		return move.noPPBoosts ? move.pp : Math.floor((move.pp / 5 + 1) * 4);
	},
};
