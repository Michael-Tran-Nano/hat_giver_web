let commands = {
	head: 0,
	mouth: 0,
	belly: 0,
};

let targetColor = { r: 255, g: 0, b: 0 }; // { r: 170, g: 170, b: 255 };
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
	makeImageBase();
	makeImage();
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
		// skip objects
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

function makeImageBase() {
	const container = document.getElementById("image-container");
	const img = document.createElement("img");
	img.src = `images/base.png`;
	img.classList.add("stacked-image");
	container.appendChild(img);
}

async function makeImage() {
	const [base_x, base_y] = base_coor_dict[animal];
	const images = [{ src: `images/${animal}.png`, x: 0, y: 0, animal: true }];

	for (const [placement, id] of Object.entries(commands)) {
		if (id == 0) {
			continue;
		}
		let [animal_x, animal_y] = body_coor_dicts[placement][animal];
		imageNo = data[id]["g"].split(",")[0];
		images.push({
			src: `https://hundeparken.net/h5/game/gfx/item/${imageNo}.png`,
			x: data[id]["x"] + animal_x,
			y: data[id]["y"] + animal_y,
			animal: false,
		});
	}

	const container = document.getElementById("image-container");
	// Keep background
	const firstChild = container.firstElementChild;
	while (container.lastElementChild !== firstChild) {
		container.removeChild(container.lastElementChild);
	}

	const processedImages = await Promise.all(
		images.map(({ src, x, y, animal }) => {
			if (animal && !Object.values(targetColor).every((value) => value === 0)) {
				return recolorAnimal(src, targetColor).then((newImg) => {
					newImg.classList.add("stacked-image");
					newImg.style.left = `${x + base_x}px`;
					newImg.style.top = `${y + base_y}px`;
					return newImg;
				});
			} else {
				const img = document.createElement("img");
				img.src = src;
				img.classList.add("stacked-image");
				img.style.left = `${x + base_x}px`;
				img.style.top = `${y + base_y}px`;
				return img;
			}
		})
	);

	processedImages.forEach((img) => container.appendChild(img));
}

function recolorAnimal(src, targetColor) {
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

			// When you define the color, this shadow should be defined as well
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
	let position;
	switch (hat.u) {
		case "1":
			position = "head";
			break;
		case "2":
			position = "mouth";
			break;
		default: // todo: add dildo
			position = "belly";
	}

	let element = document.getElementById(id);

	if (commands[position] == 0) {
		commands[position] = id;
		element.style.backgroundColor = "yellow";
	} else if (commands[position] != id) {
		let elementOld = document.getElementById(commands[position]);
		elementOld.style.backgroundColor = "";
		commands[position] = id;
		element.style.backgroundColor = "yellow";
	} else {
		commands[position] = 0;
		element.style.backgroundColor = "";
	}

	makeImage();
}

function changeAnimal(newAnimal) {
	animal = newAnimal;
	makeImage();
}

function clearHats() {
	for (const [key, id] of Object.entries(commands)) {
		if (id != 0) {
			let element = document.getElementById(`${id}`);
			element.style.backgroundColor = "";
			commands[key] = 0;
		}
	}
	makeImage();
}
