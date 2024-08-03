import * as path from "./path.js";

export async function getHatData() {
	try {
		const response = await fetch(path.api);
		const dataRaw = await response.json();
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
