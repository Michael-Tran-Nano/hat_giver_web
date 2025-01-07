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
window.toggleShadow = toggleShadow;
window.matchShadow = matchShadow;

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
let shadowColor = { r: 178, g: 178, b: 178 };

let backgroundCount = 0;
let skipObjects = true;
let customShadowColor = false;

document.addEventListener("DOMContentLoaded", async function () {
	window.data = await setup.getHatData();
	list.populateList(window.data, handleClick, skipObjects);
	setup.defineImages(window.offset);

	const searchBar = document.getElementById(id.searchBar);
	searchBar.addEventListener("input", handleSearch);

	const colorInput = document.getElementById(id.colorWheel);
	colorInput.addEventListener("input", (event) =>
		changeAnimalColorFromPalette(event, id.fur)
	);
	const hexText = document.getElementById(id.hexText);
	hexText.addEventListener("input", (event) =>
		changeAnimalColorFromBar(event, id.fur)
	);

	const colorInputShadow = document.getElementById(id.colorWheelShadow);
	colorInputShadow.addEventListener("input", (event) =>
		changeAnimalColorFromPalette(event, id.shadowFur)
	);
	const hexTextShadow = document.getElementById(id.hexTextShadow);
	hexTextShadow.addEventListener("input", (event) =>
		changeAnimalColorFromBar(event, id.shadowFur)
	);

	color.populateBetaDogs(changeToBetaDog);
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
			targetColor,
			shadowColor,
			customShadowColor
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
		targetColor,
		shadowColor,
		customShadowColor
	);
	animalImg.src = recoloredImage.src;
}

function changeAnimalColorFromPalette(event, mode) {
	const isMain = mode == id.fur;
	const hexColor = event.target.value;
	if (isMain) {
		targetColor = color.hexToRgb(hexColor);
	} else {
		shadowColor = color.hexToRgb(hexColor);
	}

	changeAnimalColor();
	const hexText = document.getElementById(
		isMain ? id.hexText : id.hexTextShadow
	);
	hexText.value = hexColor.toUpperCase();
}

function changeAnimalColorFromBar(event, mode) {
	const isMain = mode == id.fur;
	const hexColor = event.target.value;
	const newColor = color.hexToRgb(hexColor);

	const hexText = document.getElementById(
		isMain ? id.hexText : id.hexTextShadow
	);
	const colorInput = document.getElementById(
		isMain ? id.colorWheel : id.colorWheelShadow
	);
	if (newColor !== null) {
		if (isMain) {
			targetColor = newColor;
		} else {
			shadowColor = newColor;
		}
		colorInput.value = color.rgbToHex(newColor);
		changeAnimalColor();
		hexText.style.color = "";
	} else {
		hexText.style.color = "red";
	}
}

function toggleShadow() {
	customShadowColor = !customShadowColor;
	document.getElementById(id.shadowPanel).hidden = !customShadowColor;
	document.getElementById(id.matchShadow).hidden = !customShadowColor;
	document.getElementById(id.betaDogs).hidden = !customShadowColor;
	if (!customShadowColor) {
		matchShadow();
	}
}

function matchShadow() {
	shadowColor = color.getShadow(targetColor);
	changeAnimalColor();
	const hexColor = color.rgbToHex(shadowColor);
	const colorInput = document.getElementById(id.colorWheelShadow);
	colorInput.value = hexColor;
	const hexText = document.getElementById(id.hexTextShadow);
	hexText.value = hexColor;
}

function changeToBetaDog(fur, shadow) {
	targetColor = color.hexToRgb(fur);
	shadowColor = color.hexToRgb(shadow);
	document.getElementById(id.colorWheel).value = fur;
	document.getElementById(id.hexText).value = fur;
	document.getElementById(id.colorWheelShadow).value = shadow;
	document.getElementById(id.hexTextShadow).value = shadow;
	changeAnimalColor();
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
