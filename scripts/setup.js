import * as path from "./path.js";

export async function getHatData() {
	try {
		const response = await fetch(path.api);
		const dataRaw = await response.json();
		addOwnHats(dataRaw);
		const data = dataRaw.reduce((acc, item) => {
			const { id, ...rest } = item;
			acc[id] = rest;
			return acc;
		}, {});
		return data;
	} catch (error) {
		console.error("Error fetching or processing data:", error);
		return [];
	}
}

function addOwnHats(dataRaw) {
	dataRaw.push(
		{
			id: -1,
			n: "Qato ballong",
			d: "Laget av Qato.",
			u: "2",
			g: "-1,-2,-3,-4",
			a: 50,
			x: -10,
			y: -36,
		},
		{
			id: -2,
			n: "Iria höm höm",
			d: "Laget av Iria.",
			u: "0",
			g: "-5",
			a: 0,
			x: -13,
			y: -22,
		},
		{
			id: -3,
			n: "Kartoffel",
			d: "Kartoffel",
			u: "0",
			g: "-6",
			a: 0,
			x: -32,
			y: -29,
		}
	);
}
