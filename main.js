import * as color from "./scripts/color.js";
import * as constant from "./scripts/constant.js";
import * as setup from "./scripts/setup.js";
import * as path from "./scripts/path.js";
import * as animation from "./scripts/animation.js";
import * as list from "./scripts/list.js";
import * as id from "./scripts/id.js";

console.log("Person til at gøre hjemmesiden pænere søges");

window.changeAnimal = changeAnimal;
window.changeBackground = changeBackground;
window.clearHat = clearHat;
window.clearHats = clearHats;
window.resetPosition = resetPosition;

window.animal = id.dog;
window.currentHats = {
	head: 0,
	belly: 0,
	mouth: 0,
};
window.offset = {
	x: 0,
	y: 0,
};

let targetColor = { r: 255, g: 255, b: 255 };

let backgroundCount = 0;
let skipObjects = true;

document.addEventListener("DOMContentLoaded", async function () {
	window.data = await setup.getHatData();
	list.populateList(window.data, handleClick, skipObjects);
	setup.defineImages(window.offset);

	const searchBar = document.getElementById(id.searchBar);
	searchBar.addEventListener("input", handleSearch);

	const colorInput = document.getElementById(id.colorWheel);
	colorInput.addEventListener("input", changeAnimalColorFromPalette);

	const hexText = document.getElementById(id.hexText);
	hexText.addEventListener("input", changeAnimalColorFromBar);
});

function handleSearch(event) {
	const searchQuery = event.target.value.toLowerCase();
	const listItems = document.querySelectorAll(".list-item");

	// A litte surprise
	if (searchQuery == "unlock objects") {
		skipObjects = false;
		list.populateList(window.data, handleClick, skipObjects);
	} else if (searchQuery == "lock objects") {
		skipObjects = true;
		list.populateList(window.data, handleClick, skipObjects);
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
	const hatId = window.currentHats[placement];
	const hatInfo = window.data[hatId];

	// Remove animation for placement if exist
	animation.stopImageChange(animation.animationHolder[placement]);

	if (hatId == 0) {
		hatImg.src = "";
	} else {
		const [base_x, base_y] = constant.baseCoorDict[window.animal];
		const [body_x, body_y] = constant.bodyCoorDicts[placement][window.animal];
		const [hat_x, hat_y] = [hatInfo["x"], hatInfo["y"]];
		hatImg.style.left = `${base_x + body_x + hat_x + window.offset.x}px`;
		hatImg.style.top = `${base_y + body_y + hat_y + window.offset.y}px`;
		const images = hatInfo["g"].split(",");
		const imageNo = images[0];
		hatImg.src = path.getHatImage(imageNo);

		if (images.length > 1) {
			const rate = hatInfo["a"];
			const duration = 10000 / rate;
			animation.startImageChange(
				placement,
				animation.animationHolder,
				images,
				duration
			);
		}
	}
}

function resetPosition() {
	changeAnimal(window.animal);
	document.getElementById("reset-position").hidden = true;
}

function changeAnimal(newAnimal) {
	window.animal = newAnimal;
	changeAnimalImage();
}

async function changeAnimalImage() {
	const animalImg = document.getElementById(id.animal);

	if (Object.values(targetColor).every((value) => value === 255)) {
		animalImg.src = `images/${window.animal}.png`;
	} else {
		const recoloredImage = await color.recolorAnimalImage(
			`images/${window.animal}.png`,
			targetColor
		);
		animalImg.src = recoloredImage.src;
	}

	const [x, y] = constant.baseCoorDict[window.animal];
	animalImg.style.left = `${x}px`;
	animalImg.style.top = `${y}px`;
	window.offset.x = 0;
	window.offset.y = 0;
	for (const [placement, hat_id] of Object.entries(window.currentHats)) {
		if (hat_id != 0) {
			changeHatImage(placement);
		}
	}
}

async function changeAnimalColor() {
	const animalImg = document.getElementById(id.animal);

	const recoloredImage = await color.recolorAnimalImage(
		`images/${window.animal}.png`,
		targetColor
	);
	animalImg.src = recoloredImage.src;
}

function changeAnimalColorFromPalette(event) {
	const hexColor = event.target.value;
	targetColor = color.hexToRgb(hexColor);
	changeAnimalColor();

	const hexText = document.getElementById(id.hexText);
	hexText.value = hexColor;
}

function changeAnimalColorFromBar(event) {
	const hexColor = event.target.value;
	const newColor = color.hexToRgb(hexColor);

	const hexText = document.getElementById(id.hexText);
	const colorInput = document.getElementById(id.colorWheel);
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
	const background = document.getElementById(id.background);
	background.src = path.getBackgroundImage(backgroundCount);
}

function handleClick(hat_id) {
	const hat = window.data[hat_id];
	const placement = list.getPlacementFromNumber(hat.u);

	const element = document.getElementById(hat_id);

	if (window.currentHats[placement] == 0) {
		window.currentHats[placement] = hat_id;
		element.style.backgroundColor = "yellow";
	} else if (window.currentHats[placement] == hat_id) {
		window.currentHats[placement] = 0;
		element.style.backgroundColor = "";
	} else {
		let elementOld = document.getElementById(window.currentHats[placement]);
		if (elementOld !== null) {
			elementOld.style.backgroundColor = "";
		}
		window.currentHats[placement] = hat_id;
		element.style.backgroundColor = "yellow";
	}

	changeHatImage(placement);
}

function clearHat(placement) {
	const hat_id = window.currentHats[placement];
	if (hat_id != 0) {
		const element = document.getElementById(`${hat_id}`);
		element.style.backgroundColor = "";
		window.currentHats[placement] = 0;
		changeHatImage(placement);
	}
}

function clearHats() {
	for (let placement in window.currentHats) {
		clearHat(placement);
	}
}
