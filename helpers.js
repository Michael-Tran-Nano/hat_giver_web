export async function getHatData() {
	try {
		const response = await fetch("https://hundeparken.net/api/items");
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

export function hexToRgb(hex) {
	hex = hex.replace(/^#/, "");
	let bigint = parseInt(hex, 16);
	let r = (bigint >> 16) & 255;
	let g = (bigint >> 8) & 255;
	let b = bigint & 255;
	return { r: r, g: g, b: b };
}

export function isColor(pixel, color) {
	return pixel[0] === color.r && pixel[1] === color.g && pixel[2] === color.b;
}

export function setColor(pixel, color) {
	pixel[0] = color.r;
	pixel[1] = color.g;
	pixel[2] = color.b;
}

export function getShadow(color) {
	return {
		r: Math.ceil(color.r * 0.7) - 1,
		g: Math.ceil(color.g * 0.7) - 1,
		b: Math.ceil(color.b * 0.7) - 1,
	};
}
