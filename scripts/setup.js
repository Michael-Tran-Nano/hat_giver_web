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
		},
		{
			id: -4,
			n: "Zebrastriber",
			d: "Tag striper på",
			u: "0",
			g: "-7",
			a: 0,
			x: -21,
			y: -6,
		},
		{
			id: -5,
			n: "Snavs",
			d: "Beskidt hund",
			u: "0",
			g: "-8",
			a: 0,
			x: -23,
			y: -4,
		},
		{
			id: -6,
			n: "Spraytan",
			d: "Solbrun året rundt",
			u: "0",
			g: "-9",
			a: 0,
			x: -21,
			y: -3,
		},
		{
			id: -7,
			n: "Halebrann multifarget",
			d: "Når du ikke kan beslutte dig",
			u: "0",
			g: "1416,1417,1921,1922,1979,1980,1993,1994,2679,2680,4041,4042,1418,1419,1923,1924,1981,1982,1995,1996,2681,2682,4031,4032,1420,1421,1925,1926,1983,1984,1997,1998,2671,2672,4035,4036,1422,1423,1927,1928,1985,1986,1987,1988,2675,2676,4039,4040,1424,1425,1929,1930,1975,1976,1991,1992,2673,2674,4037,4038,1426,1427,1919,1920,1977,1978,1989,1990,2677,2678,4033,4034",
			a: 160,
			x: 7,
			y: -15,
		},
		{
			id: -8,
			n: "Stepbro, I'm stuck!",
			d: "please help med stepbro",
			u: "0",
			g: "-10",
			a: 0,
			x: -33,
			y: -31,
		}
	);
}
