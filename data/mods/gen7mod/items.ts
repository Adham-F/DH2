export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	loadeddice: {
		name: "Loaded Dice",
		spritenum: 751,
		fling: {
			basePower: 30,
		},
		// partially implemented in sim/battle-actions.ts:BattleActions#hitStepMoveHitLoop
		onModifyMove(move) {
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},
		num: 1886,
		gen: 7,
		isNonstandard: null,
	},
	clearamulet: {
		name: "Clear Amulet",
		spritenum: 747,
		fling: {
			basePower: 30,
		},
		onTryBoostPriority: 1,
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
				this.add('-fail', target, 'unboost', '[from] item: Clear Amulet', `[of] ${target}`);
			}
		},
		num: 1882,
		gen: 7,
		isNonstandard: null,
	},
	covertcloak: {
		name: "Covert Cloak",
		spritenum: 750,
		fling: {
			basePower: 30,
		},
		onModifySecondaries(secondaries) {
			this.debug('Covert Cloak prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		num: 1885,
		gen: 7,
		isNonstandard: null,
	},
	throatspray: {
		name: "Throat Spray",
		spritenum: 713,
		fling: {
			basePower: 30,
		},
		onAfterMoveSecondarySelf(target, source, move) {
			if (move.flags['sound']) {
				target.useItem();
			}
		},
		boosts: {
			spa: 1,
		},
		num: 1118,
		gen: 7,
		isNonstandard: null,
	},
	heavydutyboots: {
		name: "Heavy-Duty Boots",
		spritenum: 715,
		fling: {
			basePower: 80,
		},
		num: 1120,
		gen: 7,
		// Hazard Immunity implemented in moves.ts
		isNonstandard: null,
	},
	roomservice: {
		name: "Room Service",
		spritenum: 717,
		fling: {
			basePower: 100,
		},
		onSwitchInPriority: -1,
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.getPseudoWeather('trickroom')) {
				pokemon.useItem();
			}
		},
		onAnyPseudoWeatherChange() {
			const pokemon = this.effectState.target;
			if (this.field.getPseudoWeather('trickroom')) {
				pokemon.useItem(pokemon);
			}
		},
		boosts: {
			spe: -1,
		},
		num: 1122,
		gen: 7,
		isNonstandard: null,
	},
	punchingglove: {
		name: "Punching Glove",
		spritenum: 749,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Punching Glove boost');
				return this.chainModify([4506, 4096]);
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move) {
			if (move.flags['punch']) delete move.flags['contact'];
		},
		num: 1884,
		gen: 7,
		isNonstandard: null,
	},
	mirrorherb: {
		name: "Mirror Herb",
		spritenum: 748,
		fling: {
			basePower: 30,
		},
		onFoeAfterBoost(boost, target, source, effect) {
			if (effect?.name === 'Opportunist' || effect?.name === 'Mirror Herb') return;
			if (!this.effectState.boosts) this.effectState.boosts = {} as SparseBoostsTable;
			const boostPlus = this.effectState.boosts;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! > 0) {
					boostPlus[i] = (boostPlus[i] || 0) + boost[i]!;
					this.effectState.ready = true;
				}
			}
		},
		onAnySwitchInPriority: -3,
		onAnySwitchIn() {
			if (!this.effectState.ready) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onAnyAfterMega() {
			if (!this.effectState.ready) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onAnyAfterTerastallization() {
			if (!this.effectState.ready) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onAnyAfterMove() {
			if (!this.effectState.ready) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (!this.effectState.ready) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onUse(pokemon) {
			this.boost(this.effectState.boosts, pokemon);
		},
		onEnd() {
			delete this.effectState.boosts;
			delete this.effectState.ready;
		},
		num: 1883,
		gen: 7,
		isNonstandard: null,
	},
	marshadite: {
		name: "Marshadite",
		spritenum: 576,
		megaStone: "Marshadow-Mega",
		megaEvolves: "Marshadow",
		desc: "If held by Marshadow, this item allows it to Mega Evolve in battle.",
		itemUser: ["Marshadow"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1001,
		gen: 7,
		isNonstandard: null,
	},
	volcanite: {
		name: "Volcanite",
		spritenum: 576,
		megaStone: "Volcanion-Mega",
		megaEvolves: "Volcanion",
		desc: "If held by Volcanion, this item allows it to Mega Evolve in battle.",
		itemUser: ["Volcanion"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1002,
		gen: 7,
		isNonstandard: null,
	},
	cobalite: {
		name: "Cobalite",
		spritenum: 576,
		megaStone: "Cobalion-Mega",
		megaEvolves: "Cobalion",
		desc: "If held by Cobalion, this item allows it to Mega Evolve in battle.",
		itemUser: ["Cobalion"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1003,
		gen: 7,
		isNonstandard: null,
	},
	terrakinite: {
		name: "Terrakinite",
		spritenum: 576,
		megaStone: "Terrakion-Mega",
		megaEvolves: "Terrakion",
		desc: "If held by Terrakion, this item allows it to Mega Evolve in battle.",
		itemUser: ["Terrakion"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1004,
		gen: 7,
		isNonstandard: null,
	},
	virizinite: {
		name: "Virizinite",
		spritenum: 576,
		megaStone: "Virizion-Mega",
		megaEvolves: "Virizion",
		desc: "If held by Virizion, this item allows it to Mega Evolve in battle.",
		itemUser: ["Virizion"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1005,
		gen: 7,
		isNonstandard: null,
	},
	keldinite: {
		name: "Keldinite",
		spritenum: 576,
		megaStone: "Keldeo-Mega",
		megaEvolves: "Keldeo",
		desc: "If held by Keldeo, this item allows it to Mega Evolve in battle.",
		itemUser: ["Keldeo"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1006,
		gen: 7,
		isNonstandard: null,
	},
	regiginite: {
		name: "Regiginite",
		spritenum: 576,
		megaStone: "Regigigas-Mega",
		megaEvolves: "Regigigas",
		desc: "If held by Regigigas, this item allows it to Mega Evolve in battle.",
		itemUser: ["Regigigas"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1007,
		gen: 7,
		isNonstandard: null,
	},
	cresselite: {
		name: "Cresselite",
		spritenum: 576,
		megaStone: "Cresselia-Mega",
		megaEvolves: "Cresselia",
		desc: "If held by Cresselia, this item allows it to Mega Evolve in battle.",
		itemUser: ["Cresselia"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1008,
		gen: 7,
		isNonstandard: null,
	},
	hydreigite: {
		name: "Hydreigite",
		spritenum: 576,
		megaStone: "Hydreigon-Mega",
		megaEvolves: "Hydreigon",
		desc: "If held by Hydreigon, this item allows it to Mega Evolve in battle.",
		itemUser: ["Hydreigon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1009,
		gen: 7,
		isNonstandard: null,
	},
	mienshite: {
		name: "Mienshite",
		spritenum: 576,
		megaStone: "Mienshao-Mega",
		megaEvolves: "Mienshao",
		desc: "If held by Mienshao, this item allows it to Mega Evolve in battle.",
		itemUser: ["Mienshao"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1010,
		gen: 7,
		isNonstandard: null,
	},
	volcaronite: {
		name: "Volcaronite",
		spritenum: 576,
		megaStone: "Volcarona-Mega",
		megaEvolves: "Volcarona",
		desc: "If held by Volcarona, this item allows it to Mega Evolve in battle.",
		itemUser: ["Volcarona"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1011,
		gen: 7,
		isNonstandard: null,
	},
	flygite: {
		name: "Flygite",
		spritenum: 576,
		megaStone: "Flygon-Mega",
		megaEvolves: "Flygon",
		desc: "If held by Flygon, this item allows it to Mega Evolve in battle.",
		itemUser: ["Flygon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1012,
		gen: 7,
		isNonstandard: null,
	},
	breloomite: {
		name: "Breloomite",
		spritenum: 576,
		megaStone: "Breloom-Mega",
		megaEvolves: "Breloom",
		desc: "If held by Breloom, this item allows it to Mega Evolve in battle.",
		itemUser: ["Breloom"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1013,
		gen: 7,
		isNonstandard: null,
	},
	ursanite: {
		name: "Ursanite",
		spritenum: 576,
		megaStone: "Ursaring-Mega",
		megaEvolves: "Ursaring",
		desc: "If held by Ursaring, this item allows it to Mega Evolve in battle.",
		itemUser: ["Ursaring"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1014,
		gen: 7,
		isNonstandard: null,
	},
	machampite: {
		name: "Machampite",
		spritenum: 576,
		megaStone: "Machamp-Mega",
		megaEvolves: "Machamp",
		desc: "If held by Machamp, this item allows it to Mega Evolve in battle.",
		itemUser: ["Machamp"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1015,
		gen: 7,
		isNonstandard: null,
	},
	clawitzite: {
		name: "Clawitzite",
		spritenum: 576,
		megaStone: "Clawitzer-Mega",
		megaEvolves: "Clawitzer",
		desc: "If held by Clawitzer, this item allows it to Mega Evolve in battle.",
		itemUser: ["Clawitzer"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1016,
		gen: 7,
		isNonstandard: null,
	},
	mismagite: {
		name: "Mismagite",
		spritenum: 576,
		megaStone: "Mismagius-Mega",
		megaEvolves: "Mismagius",
		desc: "If held by Mismagius, this item allows it to Mega Evolve in battle.",
		itemUser: ["Mismagius"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1017,
		gen: 7,
		isNonstandard: null,
	},
	honchkrite: {
		name: "Honchkrite",
		spritenum: 576,
		megaStone: "Honchkrow-Mega",
		megaEvolves: "Honchkrow",
		desc: "If held by Honchkrow, this item allows it to Mega Evolve in battle.",
		itemUser: ["Honchkrow"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1018,
		gen: 7,
		isNonstandard: null,
	},
	victinite: {
		name: "Victinite",
		spritenum: 576,
		megaStone: "Victini-Mega",
		megaEvolves: "Victini",
		desc: "If held by Victini, this item allows it to Mega Evolve in battle.",
		itemUser: ["Victini"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1019,
		gen: 7,
		isNonstandard: null,
	},
	arcaninite: {
		name: "Arcaninite",
		spritenum: 576,
		megaStone: "Arcanine-Mega",
		megaEvolves: "Arcanine",
		desc: "If held by Arcanine, this item allows it to Mega Evolve in battle.",
		itemUser: ["Arcanine"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1020,
		gen: 7,
		isNonstandard: null,
	},
	tentacrite: {
		name: "Tentacrite",
		spritenum: 576,
		megaStone: "Tentacruel-Mega",
		megaEvolves: "Tentacruel",
		desc: "If held by Tentacruel, this item allows it to Mega Evolve in battle.",
		itemUser: ["Tentacruel"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1021,
		gen: 7,
		isNonstandard: null,
	},
	rapidashite: {
		name: "Rapidashite",
		spritenum: 576,
		megaStone: "Rapidash-Mega",
		megaEvolves: "Rapidash",
		desc: "If held by Rapidash, this item allows it to Mega Evolve in battle.",
		itemUser: ["Rapidash"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1022,
		gen: 7,
		isNonstandard: null,
	},
	jynxite: {
		name: "Jynxite",
		spritenum: 576,
		megaStone: "Jynx-Mega",
		megaEvolves: "Jynx",
		desc: "If held by Jynx, this item allows it to Mega Evolve in battle.",
		itemUser: ["Jynx"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1023,
		gen: 7,
		isNonstandard: null,
	},
	ledianite: {
		name: "Ledianite",
		spritenum: 576,
		megaStone: "Ledian-Mega",
		megaEvolves: "Ledian",
		desc: "If held by Ledian, this item allows it to Mega Evolve in battle.",
		itemUser: ["Ledian"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1024,
		gen: 7,
		isNonstandard: null,
	},
	slowkingnite: {
		name: "Slowkingnite",
		spritenum: 576,
		megaStone: "Slowking-Mega",
		megaEvolves: "Slowking",
		desc: "If held by Slowking, this item allows it to Mega Evolve in battle.",
		itemUser: ["Slowking"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1025,
		gen: 7,
		isNonstandard: null,
	},
	mantinite: {
		name: "Mantinite",
		spritenum: 576,
		megaStone: "Mantine-Mega",
		megaEvolves: "Mantine",
		desc: "If held by Mantine, this item allows it to Mega Evolve in battle.",
		itemUser: ["Mantine"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1026,
		gen: 7,
		isNonstandard: null,
	},
	kingdranite: {
		name: "Kingdranite",
		spritenum: 576,
		megaStone: "Kingdra-Mega",
		megaEvolves: "Kingdra",
		desc: "If held by Kingdra, this item allows it to Mega Evolve in battle.",
		itemUser: ["Kingdra"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1027,
		gen: 7,
		isNonstandard: null,
	},
	exploudite: {
		name: "Exploudite",
		spritenum: 576,
		megaStone: "Exploud-Mega",
		megaEvolves: "Exploud",
		desc: "If held by Exploud, this item allows it to Mega Evolve in battle.",
		itemUser: ["Exploud"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1028,
		gen: 7,
		isNonstandard: null,
	},
	zangoosite: {
		name: "Zangoosite",
		spritenum: 576,
		megaStone: "Zangoose-Mega",
		megaEvolves: "Zangoose",
		desc: "If held by Zangoose, this item allows it to Mega Evolve in battle.",
		itemUser: ["Zangoose"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1029,
		gen: 7,
		isNonstandard: null,
	},
	sevipite: {
		name: "Sevipite",
		spritenum: 576,
		megaStone: "Seviper-Mega",
		megaEvolves: "Seviper",
		desc: "If held by Seviper, this item allows it to Mega Evolve in battle.",
		itemUser: ["Seviper"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1030,
		gen: 7,
		isNonstandard: null,
	},
	crawdauntite: {
		name: "Crawdauntite",
		spritenum: 576,
		megaStone: "Crawdaunt-Mega",
		megaEvolves: "Crawdaunt",
		desc: "If held by Crawdaunt, this item allows it to Mega Evolve in battle.",
		itemUser: ["Crawdaunt"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1031,
		gen: 7,
		isNonstandard: null,
	},
	roseradite: {
		name: "Roseradite",
		spritenum: 576,
		megaStone: "Roserade-Mega",
		megaEvolves: "Roserade",
		desc: "If held by Roserade, this item allows it to Mega Evolve in battle.",
		itemUser: ["Roserade"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1032,
		gen: 7,
		isNonstandard: null,
	},
	toxicroakite: {
		name: "Toxicroakite",
		spritenum: 576,
		megaStone: "Toxicroak-Mega",
		megaEvolves: "Toxicroak",
		desc: "If held by Toxicroak, this item allows it to Mega Evolve in battle.",
		itemUser: ["Toxicroak"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1033,
		gen: 7,
		isNonstandard: null,
	},
	togekite: {
		name: "Togekite",
		spritenum: 576,
		megaStone: "Togekiss-Mega",
		megaEvolves: "Togekiss",
		desc: "If held by Togekiss, this item allows it to Mega Evolve in battle.",
		itemUser: ["Togekiss"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1034,
		gen: 7,
		isNonstandard: null,
	},
	dusknoirite: {
		name: "Dusknoirite",
		spritenum: 576,
		megaStone: "Dusknoir-Mega",
		megaEvolves: "Dusknoir",
		desc: "If held by Dusknoir, this item allows it to Mega Evolve in battle.",
		itemUser: ["Dusknoir"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1035,
		gen: 7,
		isNonstandard: null,
	},
	seismitite: {
		name: "Seismitite",
		spritenum: 576,
		megaStone: "Seismitoad-Mega",
		megaEvolves: "Seismitoad",
		desc: "If held by Seismitoad, this item allows it to Mega Evolve in battle.",
		itemUser: ["Seismitoad"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1036,
		gen: 7,
		isNonstandard: null,
	},
	cinccinite: {
		name: "Cinccinite",
		spritenum: 576,
		megaStone: "Cinncino-Mega",
		megaEvolves: "Cinncino",
		desc: "If held by Cinncino, this item allows it to Mega Evolve in battle.",
		itemUser: ["Cinncino"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1037,
		gen: 7,
		isNonstandard: null,
	},
	gothitite: {
		name: "Gothitite",
		spritenum: 576,
		megaStone: "Gothitelle-Mega",
		megaEvolves: "Gothitelle",
		desc: "If held by Gothitelle, this item allows it to Mega Evolve in battle.",
		itemUser: ["Gothitelle"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1038,
		gen: 7,
		isNonstandard: null,
	},
	heliolite: {
		name: "Heliolite",
		spritenum: 576,
		megaStone: "Heliolisk-Mega",
		megaEvolves: "Heliolisk",
		desc: "If held by Heliolisk, this item allows it to Mega Evolve in battle.",
		itemUser: ["Heliolisk"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1039,
		gen: 7,
		isNonstandard: null,
	},
	goodranite: {
		name: "Goodranite",
		spritenum: 576,
		megaStone: "Goodra-Mega",
		megaEvolves: "Goodra",
		desc: "If held by Goodra, this item allows it to Mega Evolve in battle.",
		itemUser: ["Goodra"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1040,
		gen: 7,
		isNonstandard: null,
	},
	trevenite: {
		name: "Trevenite",
		spritenum: 576,
		megaStone: "Trevenant-Mega",
		megaEvolves: "Trevenant",
		desc: "If held by Trevenant, this item allows it to Mega Evolve in battle.",
		itemUser: ["Trevenant"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1041,
		gen: 7,
		isNonstandard: null,
	},
	gourgeistite: {
		name: "Gourgeistite",
		spritenum: 576,
		megaStone: "Gourgeist-Mega",
		megaEvolves: "Gourgeist",
		desc: "If held by Gourgeist, this item allows it to Mega Evolve in battle.",
		itemUser: ["Gourgeist"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1042,
		gen: 7,
		isNonstandard: null,
	},
	tsareenite: {
		name: "Tsareenite",
		spritenum: 576,
		megaStone: "Tsareena-Mega",
		megaEvolves: "Tsareena",
		desc: "If held by Tsareena, this item allows it to Mega Evolve in battle.",
		itemUser: ["Tsareena"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1043,
		gen: 7,
		isNonstandard: null,
	},
	turtonatite: {
		name: "Turtonatite",
		spritenum: 576,
		megaStone: "Turtonator-Mega",
		megaEvolves: "Turtonator",
		desc: "If held by Turtonator, this item allows it to Mega Evolve in battle.",
		itemUser: ["Turtonator"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1044,
		gen: 7,
		isNonstandard: null,
	},
	dhelmite: {
		name: "Dhelmite",
		spritenum: 576,
		megaStone: "Dhelmise-Mega",
		megaEvolves: "Dhelmise",
		desc: "If held by Dhelmise, this item allows it to Mega Evolve in battle.",
		itemUser: ["Dhelmise"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1045,
		gen: 7,
		isNonstandard: null,
	},
	nagandelite: {
		name: "Nagandelite",
		spritenum: 576,
		megaStone: "Naganadel-Mega",
		megaEvolves: "Naganadel",
		desc: "If held by Naganadel, this item allows it to Mega Evolve in battle.",
		itemUser: ["Naganadel"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1046,
		gen: 7,
		isNonstandard: null,
	},
	laprasitex: {
		name: "Laprasite X",
		spritenum: 576,
		megaStone: "Lapras-Mega-X",
		megaEvolves: "Lapras",
		desc: "If held by Lapras, this item allows it to Mega Evolve in battle.",
		itemUser: ["Lapras"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1047,
		gen: 7,
		isNonstandard: null,
	},
	laprasitey: {
		name: "Laprasite Y",
		spritenum: 576,
		megaStone: "Lapras-Mega-Y",
		megaEvolves: "Lapras",
		desc: "If held by Lapras, this item allows it to Mega Evolve in battle.",
		itemUser: ["Lapras"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1048,
		gen: 7,
		isNonstandard: null,
	},
	hawluchanitez: {
		name: "Hawluchanite Z",
		spritenum: 576,
		megaStone: "Hawlucha-Mega-Z",
		megaEvolves: "Hawlucha",
		desc: "If held by Hawlucha, this item allows it to Mega Evolve in battle.",
		itemUser: ["Hawlucha"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1049,
		gen: 7,
		isNonstandard: null,
	},
	malamaritez: {
		name: "Malamarite Z",
		spritenum: 576,
		megaStone: "Malamar-Mega-Z",
		megaEvolves: "Malamar",
		desc: "If held by Malamar, this item allows it to Mega Evolve in battle.",
		itemUser: ["Malamar"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1050,
		gen: 7,
		isNonstandard: null,
	},
	greninjitez: {
		name: "Greninjite Z",
		spritenum: 576,
		megaStone: "Greninja-Mega-Z",
		megaEvolves: "Greninja",
		desc: "If held by Greninja, this item allows it to Mega Evolve in battle.",
		itemUser: ["Greninja"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1051,
		gen: 7,
		isNonstandard: null,
	},
	froslassitez: {
		name: "Froslassite Z",
		spritenum: 576,
		megaStone: "Froslass-Mega-Z",
		megaEvolves: "Froslass",
		desc: "If held by Froslass, this item allows it to Mega Evolve in battle.",
		itemUser: ["Froslass"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1052,
		gen: 7,
		isNonstandard: null,
	},
	diancitez: {
		name: "Diancite Z",
		spritenum: 576,
		megaStone: "Diancie-Mega-Z",
		megaEvolves: "Diancie",
		desc: "If held by Diancie, this item allows it to Mega Evolve in battle.",
		itemUser: ["Diancie"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1053,
		gen: 7,
		isNonstandard: null,
	},
	krookodite: {
		name: "Krookodite",
		spritenum: 576,
		megaStone: "Krookodile-Mega",
		megaEvolves: "Krookodile",
		desc: "If held by Krookodile, this item allows it to Mega Evolve in battle.",
		itemUser: ["Krookodile"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1054,
		gen: 7,
		isNonstandard: null,
	},
	xerneasite: {
		name: "Xerneasite",
		spritenum: 576,
		megaStone: "Xerneas-Mega",
		megaEvolves: "Xerneas",
		desc: "If held by Xerneas, this item allows it to Mega Evolve in battle.",
		itemUser: ["Xerneas"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1058,
		gen: 7,
		isNonstandard: null,
	},
	yveltalite: {
		name: "Yveltalite",
		spritenum: 576,
		megaStone: "Yveltal-Mega",
		megaEvolves: "Yveltal",
		desc: "If held by Yveltal, this item allows it to Mega Evolve in battle.",
		itemUser: ["Yveltal"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1059,
		gen: 7,
		isNonstandard: null,
	},
	hoopanite: {
		name: "Hoopanite",
		spritenum: 576,
		megaStone: "Hoopa-Mega",
		megaEvolves: "Hoopa-Unbound",
		desc: "If held by Hoopa-Unbound, this item allows it to Mega Evolve in battle.",
		itemUser: ["Hoopa-Unbound"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1060,
		gen: 7,
		isNonstandard: null,
	},
	lycanite: {
		name: "Lycanite",
		spritenum: 576,
		megaStone: "Lycanroc-Mega",
		megaEvolves: "Lycanroc",
		desc: "If held by Lycanroc, this item allows it to Mega Evolve in battle.",
		itemUser: ["Lycanroc", "Lycanroc-Midnight", "Lycanroc-Dusk"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1055,
		gen: 7,
		isNonstandard: null,
	},

	absolitez: {
		name: "Absolite Z",
		spritenum: 499,
		megaStone: "Absol-Mega-Z",
		megaEvolves: "Absol",
		desc: "If held by Absol, this item allows it to Mega Evolve in battle.",
		itemUser: ["Absol"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2638,
		gen: 7,
		isNonstandard: null,
	},
	barbaracite: {
		name: "Barbaracite",
		spritenum: 564,
		megaStone: "Barbaracle-Mega",
		megaEvolves: "Barbaracle",
		desc: "If held by Barbaracle, this item allows it to Mega Evolve in battle.",
		itemUser: ["Barbaracle"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2581,
		gen: 7,
		isNonstandard: null,
	},
	baxcalibrite: {
		name: "Baxcalibrite",
		spritenum: 514,
		megaStone: "Baxcalibur-Mega",
		megaEvolves: "Baxcalibur",
		desc: "If held by Baxcalibur, this item allows it to Mega Evolve in battle.",
		itemUser: ["Baxcalibur"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2648,
		gen: 7,
		isNonstandard: null,
	},
	chandelurite: {
		name: "Chandelurite",
		spritenum: 557,
		megaStone: "Chandelure-Mega",
		megaEvolves: "Chandelure",
		desc: "If held by Chandelure, this item allows it to Mega Evolve in battle.",
		itemUser: ["Chandelure"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2574,
		gen: 7,
		isNonstandard: null,
	},
	chesnaughtite: {
		name: "Chesnaughtite",
		spritenum: 558,
		megaStone: "Chesnaught-Mega",
		megaEvolves: "Chesnaught",
		desc: "If held by Chesnaught, this item allows it to Mega Evolve in battle.",
		itemUser: ["Chesnaught"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2575,
		gen: 7,
		isNonstandard: null,
	},
	chimechite: {
		name: "Chimechite",
		spritenum: 498,
		megaStone: "Chimecho-Mega",
		megaEvolves: "Chimecho",
		desc: "If held by Chimecho, this item allows it to Mega Evolve in battle.",
		itemUser: ["Chimecho"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2637,
		gen: 7,
		isNonstandard: null,
	},
	clefablite: {
		name: "Clefablite",
		spritenum: 544,
		megaStone: "Clefable-Mega",
		megaEvolves: "Clefable",
		desc: "If held by Clefable, this item allows it to Mega Evolve in battle.",
		itemUser: ["Clefable"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2559,
		gen: 7,
		isNonstandard: null,
	},
	crabominite: {
		name: "Crabominite",
		spritenum: 507,
		megaStone: "Crabominable-Mega",
		megaEvolves: "Crabominable",
		desc: "If held by Crabominable, this item allows it to Mega Evolve in battle.",
		itemUser: ["Crabominable"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2644,
		gen: 7,
		isNonstandard: null,
	},
	darkranite: {
		name: "Darkranite",
		spritenum: 504,
		megaStone: "Darkrai-Mega",
		megaEvolves: "Darkrai",
		desc: "If held by Darkrai, this item allows it to Mega Evolve in battle.",
		itemUser: ["Darkrai"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2568,
		gen: 7,
		isNonstandard: null,
	},
	delphoxite: {
		name: "Delphoxite",
		spritenum: 559,
		megaStone: "Delphox-Mega",
		megaEvolves: "Delphox",
		desc: "If held by Delphox, this item allows it to Mega Evolve in battle.",
		itemUser: ["Delphox"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2576,
		gen: 7,
		isNonstandard: null,
	},
	dragalgite: {
		name: "Dragalgite",
		spritenum: 565,
		megaStone: "Dragalge-Mega",
		megaEvolves: "Dragalge",
		desc: "If held by Dragalge, this item allows it to Mega Evolve in battle.",
		itemUser: ["Dragalge"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2582,
		gen: 7,
		isNonstandard: null,
	},
	dragoninite: {
		name: "Dragoninite",
		spritenum: 547,
		megaStone: "Dragonite-Mega",
		megaEvolves: "Dragonite",
		desc: "If held by Dragonite, this item allows it to Mega Evolve in battle.",
		itemUser: ["Dragonite"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2562,
		gen: 7,
		isNonstandard: null,
	},
	drampanite: {
		name: "Drampanite",
		spritenum: 569,
		megaStone: "Drampa-Mega",
		megaEvolves: "Drampa",
		desc: "If held by Drampa, this item allows it to Mega Evolve in battle.",
		itemUser: ["Drampa"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2585,
		gen: 7,
		isNonstandard: null,
	},
	eelektrossite: {
		name: "Eelektrossite",
		spritenum: 556,
		megaStone: "Eelektross-Mega",
		megaEvolves: "Eelektross",
		desc: "If held by Eelektross, this item allows it to Mega Evolve in battle.",
		itemUser: ["Eelektross"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2573,
		gen: 7,
		isNonstandard: null,
	},
	emboarite: {
		name: "Emboarite",
		spritenum: 552,
		megaStone: "Emboar-Mega",
		megaEvolves: "Emboar",
		desc: "If held by Emboar, this item allows it to Mega Evolve in battle.",
		itemUser: ["Emboar"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2569,
		gen: 7,
		isNonstandard: null,
	},
	excadrite: {
		name: "Excadrite",
		spritenum: 553,
		megaStone: "Excadrill-Mega",
		megaEvolves: "Excadrill",
		desc: "If held by Excadrill, this item allows it to Mega Evolve in battle.",
		itemUser: ["Excadrill"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2570,
		gen: 7,
		isNonstandard: null,
	},
	falinksite: {
		name: "Falinksite",
		spritenum: 570,
		megaStone: "Falinks-Mega",
		megaEvolves: "Falinks",
		desc: "If held by Falinks, this item allows it to Mega Evolve in battle.",
		itemUser: ["Falinks"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2587,
		gen: 7,
		isNonstandard: null,
	},
	feraligite: {
		name: "Feraligite",
		spritenum: 549,
		megaStone: "Feraligatr-Mega",
		megaEvolves: "Feraligatr",
		desc: "If held by Feraligatr, this item allows it to Mega Evolve in battle.",
		itemUser: ["Feraligatr"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2564,
		gen: 7,
		isNonstandard: null,
	},
	floettite: {
		name: "Floettite",
		spritenum: 562,
		megaStone: "Floette-Mega",
		megaEvolves: "Floette-Eternal",
		desc: "If held by Floette-Eternal, this item allows it to Mega Evolve in battle.",
		itemUser: ["Floette-Eternal"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2579,
		gen: 7,
		isNonstandard: null,
	},
	froslassite: {
		name: "Froslassite",
		spritenum: 551,
		megaStone: "Froslass-Mega",
		megaEvolves: "Froslass",
		desc: "If held by Froslass, this item allows it to Mega Evolve in battle.",
		itemUser: ["Froslass"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2566,
		gen: 7,
		isNonstandard: null,
	},
	garchompitez: {
		name: "Garchompite Z",
		spritenum: 501,
		megaStone: "Garchomp-Mega-Z",
		megaEvolves: "Garchomp",
		desc: "If held by Garchomp, this item allows it to Mega Evolve in battle.",
		itemUser: ["Garchomp"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2640,
		gen: 7,
		isNonstandard: null,
	},
	glimmoranite: {
		name: "Glimmoranite",
		spritenum: 512,
		megaStone: "Glimmora-Mega",
		megaEvolves: "Glimmora",
		desc: "If held by Glimmora, this item allows it to Mega Evolve in battle.",
		itemUser: ["Glimmora"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2650,
		gen: 7,
		isNonstandard: null,
	},
	golisopite: {
		name: "Golisopite",
		spritenum: 508,
		megaStone: "Golisopod-Mega",
		megaEvolves: "Golisopod",
		desc: "If held by Golisopod, this item allows it to Mega Evolve in battle.",
		itemUser: ["Golisopod"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2645,
		gen: 7,
		isNonstandard: null,
	},
	golurkite: {
		name: "Golurkite",
		spritenum: 505,
		megaStone: "Golurk-Mega",
		megaEvolves: "Golurk",
		desc: "If held by Golurk, this item allows it to Mega Evolve in battle.",
		itemUser: ["Golurk"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2642,
		gen: 7,
		isNonstandard: null,
	},
	greninjite: {
		name: "Greninjite",
		spritenum: 560,
		megaStone: "Greninja-Mega",
		megaEvolves: "Greninja",
		desc: "If held by Greninja, this item allows it to Mega Evolve in battle.",
		itemUser: ["Greninja"],
		onTakeItem(item, source) {
			// TODO: Figure out if this works on Greninja-Bond
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2577,
		gen: 7,
		isNonstandard: null,
	},
	hawluchanite: {
		name: "Hawluchanite",
		spritenum: 566,
		megaStone: "Hawlucha-Mega",
		megaEvolves: "Hawlucha",
		desc: "If held by Hawlucha, this item allows it to Mega Evolve in battle.",
		itemUser: ["Hawlucha"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2583,
		gen: 7,
		isNonstandard: null,
	},
	heatranite: {
		name: "Heatranite",
		spritenum: 503,
		megaStone: "Heatran-Mega",
		megaEvolves: "Heatran",
		desc: "If held by Heatran, this item allows it to Mega Evolve in battle.",
		itemUser: ["Heatran"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2567,
		gen: 7,
		isNonstandard: null,
	},
	lucarionitez: {
		name: "Lucarionite Z",
		spritenum: 502,
		megaStone: "Lucario-Mega-Z",
		megaEvolves: "Lucario",
		desc: "If held by Lucario, this item allows it to Mega Evolve in battle.",
		itemUser: ["Lucario"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2641,
		gen: 7,
		isNonstandard: null,
	},
	magearnite: {
		name: "Magearnite",
		spritenum: 509,
		megaStone: "Magearna-Mega",
		megaEvolves: "Magearna",
		desc: "If held by Magearna, this item allows it to Mega Evolve in battle.",
		itemUser: ["Magearna", "Magearna-Original"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2646,
		gen: 7,
		isNonstandard: null,
	},
	malamarite: {
		name: "Malamarite",
		spritenum: 563,
		megaStone: "Malamar-Mega",
		megaEvolves: "Malamar",
		desc: "If held by Malamar, this item allows it to Mega Evolve in battle.",
		itemUser: ["Malamar"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2580,
		gen: 7,
		isNonstandard: null,
	},
	meganiumite: {
		name: "Meganiumite",
		spritenum: 548,
		megaStone: "Meganium-Mega",
		megaEvolves: "Meganium",
		desc: "If held by Meganium, this item allows it to Mega Evolve in battle.",
		itemUser: ["Meganium"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2563,
		gen: 7,
		isNonstandard: null,
	},
	meowsticite: {
		name: "Meowsticite",
		spritenum: 506,
		megaStone: "Meowstic-M-Mega",
		megaEvolves: "Meowstic",
		desc: "If held by Meowstic, this item allows it to Mega Evolve in battle.",
		itemUser: ["Meowstic", "Meowstic-F"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2643,
		gen: 7,
		isNonstandard: null,
	},
	pyroarite: {
		name: "Pyroarite",
		spritenum: 561,
		megaStone: "Pyroar-Mega",
		megaEvolves: "Pyroar",
		desc: "If held by Pyroar, this item allows it to Mega Evolve in battle.",
		itemUser: ["Pyroar"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2578,
		gen: 7,
		isNonstandard: null,
	},
	raichunitex: {
		name: "Raichunite X",
		spritenum: 496,
		megaStone: "Raichu-Mega-X",
		megaEvolves: "Raichu",
		desc: "If held by Raichu, this item allows it to Mega Evolve in battle.",
		itemUser: ["Raichu"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2635,
		gen: 7,
		isNonstandard: null,
	},
	raichunitey: {
		name: "Raichunite Y",
		spritenum: 497,
		megaStone: "Raichu-Mega-Y",
		megaEvolves: "Raichu",
		desc: "If held by Raichu, this item allows it to Mega Evolve in battle.",
		itemUser: ["Raichu"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2636,
		gen: 7,
		isNonstandard: null,
	},
	scolipite: {
		name: "Scolipite",
		spritenum: 554,
		megaStone: "Scolipede-Mega",
		megaEvolves: "Scolipede",
		desc: "If held by Scolipede, this item allows it to Mega Evolve in battle.",
		itemUser: ["Scolipede"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2571,
		gen: 7,
		isNonstandard: null,
	},
	scovillainite: {
		name: "Scovillainite",
		spritenum: 511,
		megaStone: "Scovillain-Mega",
		megaEvolves: "Scovillain",
		desc: "If held by Scovillain, this item allows it to Mega Evolve in battle.",
		itemUser: ["Scovillain"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2647,
		gen: 7,
		isNonstandard: null,
	},
	scraftinite: {
		name: "Scraftinite",
		spritenum: 555,
		megaStone: "Scrafty-Mega",
		megaEvolves: "Scrafty",
		desc: "If held by Scrafty, this item allows it to Mega Evolve in battle.",
		itemUser: ["Scrafty"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2572,
		gen: 7,
		isNonstandard: null,
	},
	skarmorite: {
		name: "Skarmorite",
		spritenum: 550,
		megaStone: "Skarmory-Mega",
		megaEvolves: "Skarmory",
		desc: "If held by Skarmory, this item allows it to Mega Evolve in battle.",
		itemUser: ["Skarmory"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2565,
		gen: 7,
		isNonstandard: null,
	},
	staraptite: {
		name: "Staraptite",
		spritenum: 500,
		megaStone: "Staraptor-Mega",
		megaEvolves: "Staraptor",
		desc: "If held by Staraptor, this item allows it to Mega Evolve in battle.",
		itemUser: ["Staraptor"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2639,
		gen: 7,
		isNonstandard: null,
	},
	starminite: {
		name: "Starminite",
		spritenum: 546,
		megaStone: "Starmie-Mega",
		megaEvolves: "Starmie",
		desc: "If held by Starmie, this item allows it to Mega Evolve in battle.",
		itemUser: ["Starmie"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2561,
		gen: 7,
		isNonstandard: null,
	},
	tatsugirinite: {
		name: "Tatsugirinite",
		spritenum: 513,
		megaStone: "Tatsugiri-Curly-Mega",
		megaEvolves: "Tatsugiri",
		desc: "If held by Tatsugiri, this item allows it to Mega Evolve in battle.",
		itemUser: ["Tatsugiri", "Tatsugiri-Droopy", "Tatsugiri-Stretchy"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2649,
		gen: 7,
		isNonstandard: null,
	},
	victreebelite: {
		name: "Victreebelite",
		spritenum: 545,
		megaStone: "Victreebel-Mega",
		megaEvolves: "Victreebel",
		desc: "If held by Victreebel, this item allows it to Mega Evolve in battle.",
		itemUser: ["Victreebel"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2560,
		gen: 7,
		isNonstandard: null,
	},
	zeraorite: {
		name: "Zeraorite",
		spritenum: 510,
		megaStone: "Zeraora-Mega",
		megaEvolves: "Zeraora",
		desc: "If held by Zeraora, this item allows it to Mega Evolve in battle.",
		itemUser: ["Zeraora"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 2586,
		gen: 7,
		isNonstandard: null,
	},
	zygardite: {
		name: "Zygardite",
		spritenum: 568,
		megaStone: "Zygarde-Mega",
		megaEvolves: "Zygarde-Complete",
		desc: "If held by Zygarde-Complete, this item allows it to Mega Evolve in battle.",
		itemUser: ["Zygarde-Complete"],
		onTakeItem(item, source) {
			return source.baseSpecies.baseSpecies !== 'Zygarde';
		},
		num: 2584,
		gen: 7,
		isNonstandard: null,
	},
};
