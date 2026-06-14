// Note: This is the visual table of formats
// The rules that formats use are stored in data/rulesets.ts

// Imports
import { Formats as Gen7Mod } from '../data/mods/gen7mod/formats';

export const Formats: import('../sim/dex-formats').FormatList = [
	{
		section: "Gen 7 Pet Mods",
		column: 1,
	},
	...Gen7Mod,
];
