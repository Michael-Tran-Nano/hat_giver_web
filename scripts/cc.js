import * as id from "./id.js";
import * as string from "./string.js";

export function handleTurnOnCc() {
	const turnOnButton = document.getElementById(id.turnOnCc);
	const toggleButton = document.getElementById(id.toggleCc);

	if (window.customHatLevel == 0) {
		window.customHatLevel = 1;
		toggleButton.hidden = false;
		toggleButton.textContent = string.showOnlyCc;
		turnOnButton.textContent = string.hideCc;
	} else {
		window.customHatLevel = 0;
		toggleButton.hidden = true;
		turnOnButton.textContent = string.showCc;
	}
}

export function handleCcToggle() {
	const toggleButton = document.getElementById(id.toggleCc);

	if (window.customHatLevel == 1) {
		window.customHatLevel = 2;
		toggleButton.textContent = string.showAllContent;
	} else {
		window.customHatLevel = 1;
		toggleButton.textContent = string.showOnlyCc;
	}
}

export function shouldBeVisible(customHatLevel, item) {
	switch (customHatLevel) {
		case 0: // No custom hats
			return item.id > -100;
		case 1: // All hats
			return true;
		case 2: // Only custom hats
			return item.id < 0;
		default:
			return true;
	}
}

export function addOwnHats(dataRaw) {
	dataRaw.push(
		{
			id: -1,
			name: {
				dk: "Qato ballon",
				no: "Qato ballong",
				se: "Qato ballong",
				en: "Qato balloon",
			},
			description: {
				dk: "Laget af brugt Qato.",
				no: "Laget av brukt Qato.",
				se: "Gjord av begagnat Qato.",
				en: "Made of used Qato.",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: -5,
					y: -31,
				},
			},
			u: "2",
			g: "-1,-2,-3,-4",
			a: 50,
			x: -10,
			y: -36,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		{
			id: -2,
			name: {
				dk: "Kartoffel",
				no: "Kartoffel",
				se: "Kartoffel",
				en: "Kartoffel",
			},
			description: {
				dk: "Kartoffel",
				no: "Kartoffel",
				se: "Kartoffel",
				en: "Kartoffel",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "0",
			g: "-6",
			a: 0,
			x: -32,
			y: -29,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		{
			id: -3,
			name: {
				dk: "Nordlys",
				no: "Nordlys",
				se: "Nordlys",
				en: "Nordlys",
			},
			description: {
				dk: "Meget hyggeligt",
				no: "Meget hyggeligt",
				se: "Meget hyggeligt",
				en: "Meget hyggeligt",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "11",
			g: "4890,4891,4892,4893,4894,4895",
			a: 50,
			x: -170,
			y: -75,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		// negative numbers from -1 to -99 are always shown.
		{
			id: -100,
			name: {
				dk: "Englevinger blå",
				no: "Englevinger blå",
				se: "Englevinger blå",
				en: "Englevinger blå",
			},
			description: {
				dk: "Den ægte vare",
				no: "Den ægte vare",
				se: "Den ægte vare",
				en: "Den ægte vare",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "0",
			g: "-12",
			a: 0,
			x: -8,
			y: -50,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		{
			id: -101,
			name: {
				dk: "Halebrann multifarget",
				no: "Halebrann multifarget",
				se: "Halebrann multifarget",
				en: "Halebrann multifarget",
			},
			description: {
				dk: "Når du ikke kan beslutte dig",
				no: "Når du ikke kan beslutte dig",
				se: "Når du ikke kan beslutte dig",
				en: "Når du ikke kan beslutte dig",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "0",
			g: "1416,1417,1921,1922,1979,1980,1993,1994,2679,2680,4041,4042,1418,1419,1923,1924,1981,1982,1995,1996,2681,2682,4031,4032,1420,1421,1925,1926,1983,1984,1997,1998,2671,2672,4035,4036,1422,1423,1927,1928,1985,1986,1987,1988,2675,2676,4039,4040,1424,1425,1929,1930,1975,1976,1991,1992,2673,2674,4037,4038,1426,1427,1919,1920,1977,1978,1989,1990,2677,2678,4033,4034",
			a: 160,
			x: 7,
			y: -15,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		{
			id: -102,
			name: {
				dk: "Platinstjerne",
				no: "Platinstjerne",
				se: "Platinstjerne",
				en: "Platinstjerne",
			},
			description: {
				dk: "Bedre enn gull?",
				no: "Bedre enn gull?",
				se: "Bedre enn gull?",
				en: "Bedre enn gull?",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "0",
			g: "-13",
			a: 0,
			x: -5,
			y: -15,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		{
			id: -103,
			name: {
				dk: "Zebrastriber",
				no: "Zebrastriber",
				se: "Zebrastriber",
				en: "Zebrastriber",
			},
			description: {
				dk: "Tag striper på",
				no: "Tag striper på",
				se: "Tag striper på",
				en: "Tag striper på",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "0",
			g: "-7",
			a: 0,
			x: -21,
			y: -6,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		{
			id: -104,
			name: {
				dk: "Snavs",
				no: "Snavs",
				se: "Snavs",
				en: "Snavs",
			},
			description: {
				dk: "Beskidt hund",
				no: "Beskidt hund",
				se: "Beskidt hund",
				en: "Beskidt hund",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "0",
			g: "-8",
			a: 0,
			x: -23,
			y: -4,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		{
			id: -105,
			name: {
				dk: "Spraytan",
				no: "Spraytan",
				se: "Spraytan",
				en: "Spraytan",
			},
			description: {
				dk: "Solbrun året rundt",
				no: "Solbrun året rundt",
				se: "Solbrun året rundt",
				en: "Solbrun året rundt",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "0",
			g: "-9",
			a: 0,
			x: -21,
			y: -3,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		{
			id: -106,
			name: {
				dk: "Stepbro, I'm stuck!",
				no: "Stepbro, I'm stuck!",
				se: "Stepbro, I'm stuck!",
				en: "Stepbro, I'm stuck!",
			},
			description: {
				dk: "Please help me stepbro",
				no: "Please help me stepbro",
				se: "Please help me stepbro",
				en: "Please help me stepbro",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "0",
			g: "-10",
			a: 0,
			x: -33,
			y: -31,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		{
			id: -107,
			name: {
				dk: "Spøkelsesdrakt Iria",
				no: "Spøkelsesdrakt Iria",
				se: "Spøkelsesdrakt Iria",
				en: "Spøkelsesdrakt Iria",
			},
			description: {
				dk: "Meget uhyggeligt",
				no: "Meget uhyggeligt",
				se: "Meget uhyggeligt",
				en: "Meget uhyggeligt",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "1",
			g: "-11",
			a: 0,
			x: -14,
			y: -13,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		{
			id: -108,
			name: {
				dk: "Iria höm höm",
				no: "Iria höm höm",
				se: "Iria höm höm",
				en: "Iria höm höm",
			},
			description: {
				dk: "Laget av Iria\nDesignet af Foxy",
				no: "Laget av Iria\nDesignet af Foxy",
				se: "Laget av Iria\nDesignet af Foxy",
				en: "Laget av Iria\nDesignet af Foxy",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "0",
			g: "-5",
			a: 0,
			x: -13,
			y: -22,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		},
		{
			id: -109,
			name: {
				dk: "Savklinge dildo animeret",
				no: "Sagblad dildo animert",
				se: "Sågblad dildo animerad",
				en: "Saw blade dildo animated",
			},
			description: {
				dk: "Sidder bedst i numsen.",
				no: "Passer best i rompa.",
				se: "Passar bäst i rumpan.",
				en: "Fits best in the butt.",
			},
			shapePositions: {
				bear: {
					x: 0,
					y: 0,
				},
				wolf: {
					x: 0,
					y: 0,
				},
				cat: {
					x: 0,
					y: 0,
				},
			},
			u: "12",
			g: "3854,-14",
			a: 100,
			x: -19,
			y: -14,
			wearLayer: {
				mouth: 2,
				hat: 0,
				back: 1,
			},
		}
	);
}

//// old format
// export function addOwnHats(dataRaw) {
// 	dataRaw.push(
// 		{
// 			id: -1,
// 			n: "Qato ballong",
// 			d: "Laget av brugt Qato.",
// 			u: "2",
// 			g: "-1,-2,-3,-4",
// 			a: 50,
// 			x: -10,
// 			y: -36,
// 		},
// 		{
// 			id: -2,
// 			n: "Kartoffel",
// 			d: "Kartoffel",
// 			u: "0",
// 			g: "-6",
// 			a: 0,
// 			x: -32,
// 			y: -29,
// 		},
// 		{
// 			id: -3,
// 			n: "Nordlys",
// 			d: "Meget hyggeligt",
// 			u: "11",
// 			g: "4890,4891,4892,4893,4894,4895",
// 			a: 50,
// 			x: -170,
// 			y: -75,
// 		},
// 		// negative numbers from -1 to -99 are always shown.
// 		{
// 			id: -100,
// 			n: "Englevinger blå",
// 			d: "Den ægte vare",
// 			u: "0",
// 			g: "-12",
// 			a: 0,
// 			x: -8,
// 			y: -50,
// 		},
// 		{
// 			id: -101,
// 			n: "Halebrann multifarget",
// 			d: "Når du ikke kan beslutte dig",
// 			u: "0",
// 			g: "1416,1417,1921,1922,1979,1980,1993,1994,2679,2680,4041,4042,1418,1419,1923,1924,1981,1982,1995,1996,2681,2682,4031,4032,1420,1421,1925,1926,1983,1984,1997,1998,2671,2672,4035,4036,1422,1423,1927,1928,1985,1986,1987,1988,2675,2676,4039,4040,1424,1425,1929,1930,1975,1976,1991,1992,2673,2674,4037,4038,1426,1427,1919,1920,1977,1978,1989,1990,2677,2678,4033,4034",
// 			a: 160,
// 			x: 7,
// 			y: -15,
// 		},
// 		{
// 			id: -102,
// 			n: "Platinstjerne",
// 			d: "Bedre enn gull?",
// 			u: "0",
// 			g: "-13",
// 			a: 0,
// 			x: -5,
// 			y: -15,
// 		},
// 		{
// 			id: -103,
// 			n: "Zebrastriber",
// 			d: "Tag striper på",
// 			u: "0",
// 			g: "-7",
// 			a: 0,
// 			x: -21,
// 			y: -6,
// 		},
// 		{
// 			id: -104,
// 			n: "Snavs",
// 			d: "Beskidt hund",
// 			u: "0",
// 			g: "-8",
// 			a: 0,
// 			x: -23,
// 			y: -4,
// 		},
// 		{
// 			id: -105,
// 			n: "Spraytan",
// 			d: "Solbrun året rundt",
// 			u: "0",
// 			g: "-9",
// 			a: 0,
// 			x: -21,
// 			y: -3,
// 		},
// 		{
// 			id: -106,
// 			n: "Stepbro, I'm stuck!",
// 			d: "Please help med stepbro",
// 			u: "0",
// 			g: "-10",
// 			a: 0,
// 			x: -33,
// 			y: -31,
// 		},
// 		{
// 			id: -107,
// 			n: "Spøkelsesdrakt Iria",
// 			d: "Meget uhyggeligt",
// 			u: "1",
// 			g: "-11",
// 			a: 0,
// 			x: -14,
// 			y: -13,
// 		},
// 		{
// 			id: -108,
// 			n: "Iria höm höm",
// 			d: "Laget av Iria\nDesignet af Foxy",
// 			u: "0",
// 			g: "-5",
// 			a: 0,
// 			x: -13,
// 			y: -22,
// 		}
// 	);
// }
