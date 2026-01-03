export const white = { r: 255, g: 255, b: 255 };
export const shadowWhite = { r: 178, g: 178, b: 178 };

export const baseCoorDict = {
	dog: [141, 71],
	wolf: [139, 66],
	cat: [145, 69],
	bear: [137, 70],
};

export const bodyCoorDicts = {
	head: { dog: [11, 1], wolf: [12, 5], cat: [8, 6], bear: [13, 1] },
	belly: { dog: [23, 4], wolf: [25, 10], cat: [19, 9], bear: [27, 2] },
	mouth: { dog: [3, 5], wolf: [3, 11], cat: [2, 12], bear: [2, 10] },
	dildo: { dog: [40, 15], wolf: [40, 26], cat: [31, 18], bear: [47, 16] },
};

export const excludedHatIds = [1143, 1150, 1858, 1862, 1893].map(String);

export const betaDogs = [
	{ fur: "FFFFFF", shadow: "FFFFFF", name: "Clonex" },
	{ fur: "000000", shadow: "000000", name: "Zeav" },
	{ fur: "FF89BF", shadow: "FF5A6C", name: "Iria" },
	{ fur: "FFFDBB", shadow: "FEE873", name: "Ellie" },
	{ fur: "FFDE6B", shadow: "FFA924", name: "Edith" },
	{ fur: "FFFBF6", shadow: "FFBC6B", name: "Jess" },
	{ fur: "FFDBE9", shadow: "FFAAC2", name: "Elora" },
	{ fur: "01002C", shadow: "00001E", name: "Rolex" },
	{ fur: "FFBF84", shadow: "FF8159", name: "Pumpkin" },
];

// The properties are capitalized because the names are used directly in the dropdown
export const languages = {
	Norsk: "no",
	Dansk: "dk",
	Svenska: "se",
	English: "en",
};

export const seperator = "|";
