import * as color from "./scripts/color.js";
import * as constant from "./scripts/constant.js";
import * as setup from "./scripts/setup.js";
import * as path from "./scripts/path.js";
import * as animation from "./scripts/animation.js";
import * as list from "./scripts/list.js";

window.changeAnimal = changeAnimal;
window.changeBackground = changeBackground;
window.clearHat = clearHat;
window.clearHats = clearHats;
window.resetPosition = resetPosition;

let currentHats = {
	head: 0,
	belly: 0,
	mouth: 0,
};
let offset = {
	x: 0,
	y: 0,
	animal_ref_x: constant.baseCoorDict.dog[0],
	animal_ref_y: constant.baseCoorDict.dog[1],
};

let headAnimation = null;
let bellyAnimation = null;
let mouthAnimation = null;
let animationHolder = {
	head: headAnimation,
	belly: bellyAnimation,
	mouth: mouthAnimation,
};

let targetColor = { r: 255, g: 255, b: 255 };

let animal = "dog";
let backgroundCount = 0;
let skipObjects = true;
let data;

document.addEventListener("DOMContentLoaded", async function () {
	data = await setup.getHatData();
	list.populateList(data, handleClick, skipObjects);
	setup.defineImages(offset);

	const searchBar = document.getElementById("search-bar");
	searchBar.addEventListener("input", handleSearch);

	const colorInput = document.getElementById("animal-color");
	colorInput.addEventListener("input", changeAnimalColorFromPalette);

	const hexText = document.getElementById("hex-text");
	hexText.addEventListener("input", changeAnimalColorFromBar);
});

function handleSearch(event) {
	const searchQuery = event.target.value.toLowerCase();
	const listItems = document.querySelectorAll(".list-item");

	// A litte surprise
	if (searchQuery == "unlock objects") {
		skipObjects = false;
		list.populateList(data, handleClick, skipObjects);
	} else if (searchQuery == "lock objects") {
		skipObjects = true;
		list.populateList(data, handleClick, skipObjects);
	}

	listItems.forEach((item) => {
		const name = item.querySelector(".item-name").textContent.toLowerCase();
		if (name.includes(searchQuery)) {
			item.style.display = "flex";
		} else {
			item.style.display = "none";
		}
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
		hatImg.style.left = `${base_x + body_x + hat_x + offset.x}px`;
		hatImg.style.top = `${base_y + body_y + hat_y + offset.y}px`;
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

function resetPosition() {
	changeAnimal(animal);
	document.getElementById("reset-position").hidden = true;
}

function changeAnimal(newAnimal) {
	animal = newAnimal;
	changeAnimalImage();
}

async function changeAnimalImage() {
	const animalImg = document.getElementById("animal");

	if (Object.values(targetColor).every((value) => value === 255)) {
		animalImg.src = `images/${animal}.png`;
	} else {
		const recoloredImage = await color.recolorAnimalImage(
			`images/${animal}.png`,
			targetColor
		);
		animalImg.src = recoloredImage.src;
	}

	const [x, y] = constant.baseCoorDict[animal];
	animalImg.style.left = `${x}px`;
	animalImg.style.top = `${y}px`;
	offset.x = 0;
	offset.y = 0;
	offset.animal_ref_x = x;
	offset.animal_ref_y = y;
	for (const [placement, id] of Object.entries(currentHats)) {
		if (id != 0) {
			changeHatImage(placement);
		}
	}
}

async function changeAnimalColor() {
	const animalImg = document.getElementById("animal");

	const recoloredImage = await color.recolorAnimalImage(
		`images/${animal}.png`,
		targetColor
	);
	animalImg.src = recoloredImage.src;
}

function changeAnimalColorFromPalette(event) {
	const hexColor = event.target.value;
	targetColor = color.hexToRgb(hexColor);
	changeAnimalColor();

	const hexText = document.getElementById("hex-text");
	hexText.value = hexColor;
}

function changeAnimalColorFromBar(event) {
	const hexColor = event.target.value;
	const newColor = color.hexToRgb(hexColor);

	const hexText = document.getElementById("hex-text");
	const colorInput = document.getElementById("animal-color");
	if (newColor !== null) {
		targetColor = newColor;
		changeAnimalColor();
		colorInput.value = color.rgbToHex(targetColor);
		hexText.style.color = "";
	} else {
		hexText.style.color = "red";
	}
}

function changeBackground(change) {
	backgroundCount += change;
	const background = document.getElementById("background");
	background.src = path.getBackgroundImage(backgroundCount);
}

function handleClick(id) {
	const hat = data[id];
	const placement = list.getPlacementFromNumber(hat.u);

	const element = document.getElementById(id);

	if (currentHats[placement] == 0) {
		currentHats[placement] = id;
		element.style.backgroundColor = "yellow";
	} else if (currentHats[placement] == id) {
		currentHats[placement] = 0;
		element.style.backgroundColor = "";
	} else {
		let elementOld = document.getElementById(currentHats[placement]);
		if (elementOld !== null) {
			elementOld.style.backgroundColor = "";
		}
		currentHats[placement] = id;
		element.style.backgroundColor = "yellow";
	}

	changeHatImage(placement);
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
