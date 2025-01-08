import * as path from "./path.js";
import * as draggable from "./draggable.js";
import * as constant from "./constant.js";
import * as id from "./id.js";
import * as cc from "./cc.js";

export async function getHatData() {
	try {
		const response = await fetch(path.api);
		const dataRaw = await response.json();
		cc.addOwnHats(dataRaw);
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

export function defineImages(offset) {
	const startAnimal = id.dog;

	const container = document.getElementById(id.imageContainer);

	const [base_x, base_y] = constant.baseCoorDict[startAnimal];

	const images = [
		{ src: path.getBackgroundImage(0), x: 0, y: 0, id: id.background },
		{ src: `images/${startAnimal}.png`, x: base_x, y: base_y, id: id.animal },
		{ src: "", x: 0, y: 0, id: id.head },
		{ src: "", x: 0, y: 0, id: id.belly },
		{ src: "", x: 0, y: 0, id: id.mouth },
	];

	images.map(({ src, x, y, id }) => {
		const img = document.createElement("img");
		img.id = id;
		img.src = src;
		img.classList.add("stacked-image");
		img.style.left = `${x}px`;
		img.style.top = `${y}px`;
		container.appendChild(img);
	});

	draggable.makeDragAble(offset);
}
