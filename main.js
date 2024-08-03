import * as color from "./scripts/color.js";
import * as constant from "./scripts/constant.js";
import * as setup from "./scripts/setup.js";
import * as path from "./scripts/path.js";
import * as animation from "./scripts/animation.js";

window.changeAnimal = changeAnimal;
window.clearHat = clearHat;
window.clearHats = clearHats;

let currentHats = {
	head: 0,
	belly: 0,
	mouth: 0,
};

let headAnimation = null;
let bellyAnimation = null;
let mouthAnimation = null;
let animationHolder = {
	head: headAnimation,
	belly: bellyAnimation,
	mouth: mouthAnimation,
};

let targetColor = { r: 0, g: 0, b: 0 };

let animal = "dog";

let data;

document.addEventListener("DOMContentLoaded", async function () {
	data = await setup.getHatData();
	populateList(data);
	defineImages();

	const searchBar = document.getElementById("search-bar");
	searchBar.addEventListener("input", handleSearch);

	const colorInput = document.getElementById("animal-color");
	colorInput.addEventListener("input", (event) => {
		const hexColor = event.target.value;
		targetColor = color.hexToRgb(hexColor);
		changeAnimalColor();
	});
});

function populateList(data) {
	const container = document.getElementById("list-container");
	container.innerHTML = "";

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

		// Type icon
		const placement = getPlacementFromNumber(item.u);
		const leftImage = document.createElement("img");
		leftImage.src = `images/${placement}.png`;
		leftImage.alt = `${item.n} left image`;
		leftImage.className = "left-image";

		// Name
		const nameSpan = document.createElement("span");
		nameSpan.textContent = item.n;
		nameSpan.className = "item-name";

		// Image
		const image = document.createElement("img");
		let imageNo = item.g.split(",")[0];
		image.src = path.getHatImage(imageNo);
		image.alt = `${item.n} image`;
		image.className = "item-image";

		listItem.appendChild(leftImage);
		listItem.appendChild(nameSpan);
		listItem.appendChild(image);
		container.appendChild(listItem);
	});
}

function handleSearch(event) {
	const searchQuery = event.target.value.toLowerCase();
	const listItems = document.querySelectorAll(".list-item");

	listItems.forEach((item) => {
		const name = item.querySelector(".item-name").textContent.toLowerCase();
		if (name.includes(searchQuery)) {
			item.style.display = "flex";
		} else {
			item.style.display = "none";
		}
	});
}

function defineImages() {
	const container = document.getElementById("image-container");

	const [base_x, base_y] = constant.baseCoorDict[animal];

	const images = [
		{ src: `images/base.png`, x: 0, y: 0, id: "background" },
		{ src: `images/${animal}.png`, x: base_x, y: base_y, id: "animal" },
		{ src: "", x: 0, y: 0, id: "head" },
		{ src: "", x: 0, y: 0, id: "belly" },
		{ src: "", x: 0, y: 0, id: "mouth" },
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
	const hatId = currentHats[placement];
	const hatInfo = data[hatId];

	// Remove animation for placement if exist
	animation.stopImageChange(placement, animationHolder);

	if (hatId == 0) {
		hatImg.src = "";
	} else {
		const [base_x, base_y] = constant.baseCoorDict[animal];
		const [body_x, body_y] = constant.bodyCoorDicts[placement][animal];
		const [hat_x, hat_y] = [hatInfo["x"], hatInfo["y"]];
		hatImg.style.left = `${base_x + body_x + hat_x}px`;
		hatImg.style.top = `${base_y + body_y + hat_y}px`;
		const images = hatInfo["g"].split(",");
		const imageNo = images[0];
		hatImg.src = path.getHatImage(imageNo);

		if (images.length > 1) {
			const rate = hatInfo["a"];
			const duration = 10000 / rate;
			animation.startImageChange(placement, animationHolder, images, duration);
		}
	}
}

function changeAnimal(newAnimal) {
	animal = newAnimal;
	changeAnimalImage();
}

async function changeAnimalImage() {
	const animalImg = document.getElementById("animal");

	if (Object.values(targetColor).every((value) => value === 0)) {
		animalImg.src = `images/${animal}.png`;
	} else {
		animalImg.src = await color.recolorAnimalImage(
			`images/${animal}.png`,
			targetColor
		);
	}

	const [x, y] = constant.baseCoorDict[animal];
	animalImg.style.left = `${x}px`;
	animalImg.style.top = `${y}px`;
	for (const [placement, id] of Object.entries(currentHats)) {
		if (id != 0) {
			changeHatImage(placement);
		}
	}
}

async function changeAnimalColor() {
	const animalImg = document.getElementById("animal");

	animalImg.src = await color.recolorAnimalImage(
		`images/${animal}.png`,
		targetColor
	);
}

function handleClick(id) {
	const hat = data[id];
	const placement = getPlacementFromNumber(hat.u);

	const element = document.getElementById(id);

	if (currentHats[placement] == 0) {
		currentHats[placement] = id;
		element.style.backgroundColor = "yellow";
	} else if (currentHats[placement] == id) {
		currentHats[placement] = 0;
		element.style.backgroundColor = "";
	} else {
		let elementOld = document.getElementById(currentHats[placement]);
		elementOld.style.backgroundColor = "";
		currentHats[placement] = id;
		element.style.backgroundColor = "yellow";
	}

	changeHatImage(placement);
}

function getPlacementFromNumber(u) {
	if (u == "1") {
		return "head";
	} else if (u == "2") {
		return "mouth";
	}
	return "belly";
}

function clearHat(placement) {
	const id = currentHats[placement];
	if (id != 0) {
		const element = document.getElementById(`${id}`);
		element.style.backgroundColor = "";
		currentHats[placement] = 0;
		changeHatImage(placement);
	}
}

function clearHats() {
	for (let placement in currentHats) {
		clearHat(placement);
	}
}
