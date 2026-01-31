import * as color from "./scripts/color.js";
import * as constant from "./scripts/constant.js";
import * as setup from "./scripts/setup.js";
import * as path from "./scripts/path.js";
import * as list from "./scripts/list.js";
import * as id from "./scripts/id.js";
import * as cc from "./scripts/cc.js";
import * as hatLogic from "./scripts/hatLogic.js";

console.log("Person til at gøre hjemmesiden pænere søges");

window.changeAnimal = changeAnimal;
window.changeBackground = changeBackground;
window.clearHat = hatLogic.clearHat;
window.clearHats = hatLogic.clearHats;
window.resetPosition = resetPosition;
window.toggleShadow = toggleShadow;
window.matchShadow = matchShadow;
window.turnOnCc = turnOnCc;
window.ccToggle = ccToggle;
window.toggleAdjustment = hatLogic.toggleAdjustment;
window.updateCustomPosition = hatLogic.updateCustomPosition;
window.resetCustomPositions = hatLogic.resetCustomPositions;

window.animal = id.dog;
window.currentHats = createWatchedObject(
	{
		head: 0,
		belly: 0,
		mouth: 0,
	},
	({ property, oldValue, newValue }) => {
		hatLogic.markSelectedHatFromWatch(oldValue, newValue);
	}
);
window.customHatLevel = 0; // 0: No custom hats, 1: All hats, 2: Only custom hats
window.adjustmentPanelShown = false;

// Set positions (without custom changes)
window.windowPositions = {
	head: { x: 0, y: 0 },
	belly: { x: 0, y: 0 },
	mouth: { x: 0, y: 0 },
};

// For dragging
window.offset = {
	x: 0,
	y: 0,
};

// Custom positions
window.customPositions = {
	head: { x: 0, y: 0 },
	belly: { x: 0, y: 0 },
	mouth: { x: 0, y: 0 },
};

let targetColor = { r: 255, g: 255, b: 255 };
let shadowColor = { r: 178, g: 178, b: 178 };

let backgroundCount = 0;
let skipObjects = true;
let searchQuery = "";
let customShadowColor = false;
let language = constant.languages.Norsk;

document.addEventListener("DOMContentLoaded", async function () {
	window.data = await setup.getHatData();
	list.populateList(window.data, hatLogic.handleClick, skipObjects, language);
	setup.defineImages(window.offset);

	const searchBar = document.getElementById(id.searchBar);
	searchBar.addEventListener("input", handleSearch);

	const colorInput = document.getElementById(id.colorWheel);
	colorInput.addEventListener("input", (event) => changeAnimalColorFromPalette(event, id.fur));
	const hexText = document.getElementById(id.hexText);
	hexText.addEventListener("input", (event) => changeAnimalColorFromBar(event, id.fur));

	const colorInputShadow = document.getElementById(id.colorWheelShadow);
	colorInputShadow.addEventListener("input", (event) =>
		changeAnimalColorFromPalette(event, id.shadowFur)
	);
	const hexTextShadow = document.getElementById(id.hexTextShadow);
	hexTextShadow.addEventListener("input", (event) => changeAnimalColorFromBar(event, id.shadowFur));

	color.populateBetaDogs(changeToBetaDog);
	list.addLanguageOptions();
	handleHatVisibility();
});

function handleSearch(event) {
	searchQuery = event.target.value.toLowerCase();

	// A litte surprise
	if (searchQuery == "unlock objects") {
		skipObjects = false;
		list.populateList(window.data, hatLogic.handleClick, skipObjects, language);
	} else if (searchQuery == "lock objects") {
		skipObjects = true;
		list.populateList(window.data, hatLogic.handleClick, skipObjects, language);
	}

	handleHatVisibility();
}

function turnOnCc() {
	cc.handleTurnOnCc();
	handleHatVisibility();
}

function ccToggle() {
	cc.handleCcToggle();
	handleHatVisibility();
}

function handleHatVisibility() {
	const listItems = document.querySelectorAll(`.${id.listItemClass}`);
	listItems.forEach((item) => {
		const name = item.querySelector(`.${id.itemNameClass}`).dataset.names;

		if (name.includes(searchQuery) && cc.shouldBeVisible(window.customHatLevel, item)) {
			item.style.display = "flex";
		} else {
			item.style.display = "none";
		}
	});
}

function resetPosition() {
	changeAnimal(window.animal);
	document.getElementById(id.resetPosition).hidden = true;
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

	hatLogic.readjustHats();
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
	const hexText = document.getElementById(isMain ? id.hexText : id.hexTextShadow);
	hexText.value = hexColor.toUpperCase();
}

function changeAnimalColorFromBar(event, mode) {
	const isMain = mode == id.fur;
	const hexColor = event.target.value;
	const newColor = color.hexToRgb(hexColor);

	const hexText = document.getElementById(isMain ? id.hexText : id.hexTextShadow);
	const colorInput = document.getElementById(isMain ? id.colorWheel : id.colorWheelShadow);
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

function createWatchedObject(obj, onChange) {
	return new Proxy(obj, {
		set(target, property, newValue) {
			const oldValue = target[property];

			if (oldValue !== newValue) {
				onChange({
					property,
					oldValue,
					newValue,
				});
			}

			target[property] = newValue;
			return true;
		},
	});
}
