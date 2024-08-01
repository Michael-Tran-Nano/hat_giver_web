let currentHats = {
	head: 0,
	mouth: 0,
	belly: 0,
};

let targetColor = { r: 0, g: 0, b: 0 }; // { r: 170, g: 170, b: 255 };
const white = { r: 255, g: 255, b: 255 };
const shadowWhite = { r: 178, g: 178, b: 178 };

let animal = "dog";

let base_coor_dict = {
	dog: [141, 71],
	wolf: [139, 66],
	cat: [145, 69],
	bear: [137, 70],
};

let body_coor_dicts = {
	head: { dog: [11, 1], wolf: [12, 5], cat: [8, 6], bear: [13, 1] },
	mouth: { dog: [3, 5], wolf: [3, 11], cat: [2, 12], bear: [2, 10] },
	belly: { dog: [23, 4], wolf: [25, 10], cat: [19, 9], bear: [27, 2] },
	dildo: { dog: [40, 15], wolf: [40, 26], cat: [31, 18], bear: [47, 16] },
};

let data;

document.addEventListener("DOMContentLoaded", async function () {
	data = await getHatList();
	populateList(data);
	defineImages();
});

async function getHatList() {
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

// Function to create the list items
function populateList(data) {
	const container = document.getElementById("list-container");

	const itemsArray = Object.keys(data).map((key) => ({
		key: key,
		...data[key],
	}));
	itemsArray.sort((a, b) => a.n.localeCompare(b.n));

	itemsArray.forEach((item) => {
		// skip non-hats
		if (item.u == "11") {
			return;
		}

		const listItem = document.createElement("div");
		listItem.className = "list-item";
		listItem.addEventListener("click", () => handleClick(item.key));
		listItem.id = item.key;

		// Name
		const nameSpan = document.createElement("span");
		nameSpan.textContent = item.n;
		nameSpan.className = "item-name";

		// Image
		const image = document.createElement("img");
		let imageNo = item.g.split(",")[0]; // Take first frame of animated hats
		image.src = `https://hundeparken.net/h5/game/gfx/item/${imageNo}.png`;
		image.alt = `${item.n} image`;
		image.className = "item-image";

		listItem.appendChild(nameSpan);
		listItem.appendChild(image);
		container.appendChild(listItem);
	});
}

function defineImages() {
	const container = document.getElementById("image-container");

	const [base_x, base_y] = base_coor_dict[animal];

	const images = [
		{ src: `images/base.png`, x: 0, y: 0, id: "background" },
		{ src: `images/${animal}.png`, x: base_x, y: base_y, id: "animal" },
		{ src: "", x: 0, y: 0, id: "head" },
		{ src: "", x: 0, y: 0, id: "mouth" },
		{ src: "", x: 0, y: 0, id: "belly" },
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
}

function changeHatImage(placement) {
	const hatImg = document.getElementById(placement);
	hatId = currentHats[placement];
	hatInfo = data[hatId];
	if (hatId == 0) {
		hatImg.src = "";
	} else {
		const [base_x, base_y] = base_coor_dict[animal];
		const [body_x, body_y] = body_coor_dicts[placement][animal];
		const [hat_x, hat_y] = [hatInfo["x"], hatInfo["y"]];
		const imageNo = hatInfo["g"].split(",")[0];
		hatImg.style.left = `${base_x + body_x + hat_x}px`;
		hatImg.style.top = `${base_y + body_y + hat_y}px`;
		hatImg.src = `https://hundeparken.net/h5/game/gfx/item/${imageNo}.png`;
	}
}

async function changeAnimalImage() {
	const animalImg = document.getElementById("animal");

	if (Object.values(targetColor).every((value) => value === 0)) {
		animalImg.src = `images/${animal}.png`;
	} else {
		const recoloredImage = await recolorAnimalImage(
			`images/${animal}.png`,
			targetColor
		);
		animalImg.src = recoloredImage.src;
	}

	const [x, y] = base_coor_dict[animal];
	animalImg.style.left = `${x}px`;
	animalImg.style.top = `${y}px`;
	for (const [placement, id] of Object.entries(currentHats)) {
		if (id != 0) {
			changeHatImage(placement);
		}
	}
}

const colorInput = document.getElementById("animal-color");

colorInput.addEventListener("input", (event) => {
	const hexColor = event.target.value;
	targetColor = hexToRgb(hexColor);
	changeAnimalColor();
});

function hexToRgb(hex) {
	hex = hex.replace(/^#/, "");
	let bigint = parseInt(hex, 16);
	let r = (bigint >> 16) & 255;
	let g = (bigint >> 8) & 255;
	let b = bigint & 255;
	return { r: r, g: g, b: b };
}

async function changeAnimalColor() {
	const animalImg = document.getElementById("animal");

	const recoloredImage = await recolorAnimalImage(
		`images/${animal}.png`,
		targetColor
	);
	animalImg.src = recoloredImage.src;
}

function recolorAnimalImage(src, targetColor) {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.src = src;
		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;

			const targetColorShadow = {
				r: Math.ceil(targetColor.r * 0.7) - 1,
				g: Math.ceil(targetColor.g * 0.7) - 1,
				b: Math.ceil(targetColor.b * 0.7) - 1,
			};

			// 4th is alpha
			for (let i = 0; i < data.length; i += 4) {
				const pixel = data.subarray(i, i + 4);
				if (isColor(pixel, white)) {
					setColor(pixel, targetColor);
				} else if (isColor(pixel, shadowWhite)) {
					setColor(pixel, targetColorShadow);
				}
			}

			ctx.putImageData(imageData, 0, 0);
			const newImg = new Image();
			newImg.src = canvas.toDataURL();
			resolve(newImg);
		};
	});
}

function isColor(pixel, color) {
	return pixel[0] === color.r && pixel[1] === color.g && pixel[2] === color.b;
}

function setColor(pixel, color) {
	pixel[0] = color.r;
	pixel[1] = color.g;
	pixel[2] = color.b;
}

function handleClick(id) {
	const hat = data[id];
	let placement;
	switch (hat.u) {
		case "1":
			placement = "head";
			break;
		case "2":
			placement = "mouth";
			break;
		default: // todo: add dildo
			placement = "belly";
	}

	let element = document.getElementById(id);

	if (currentHats[placement] == 0) {
		currentHats[placement] = id;
		element.style.backgroundColor = "yellow";
	} else if (currentHats[placement] != id) {
		let elementOld = document.getElementById(currentHats[placement]);
		elementOld.style.backgroundColor = "";
		currentHats[placement] = id;
		element.style.backgroundColor = "yellow";
	} else {
		currentHats[placement] = 0;
		element.style.backgroundColor = "";
	}

	changeHatImage(placement);
}

function changeAnimal(newAnimal) {
	animal = newAnimal;
	changeAnimalImage();
}

function clearHats() {
	for (const [placement, id] of Object.entries(currentHats)) {
		if (id != 0) {
			let element = document.getElementById(`${id}`);
			element.style.backgroundColor = "";
			currentHats[placement] = 0;
			changeHatImage(placement);
		}
	}
}
