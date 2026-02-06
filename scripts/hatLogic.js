import * as animation from "./animation.js";
import * as cc from "./cc.js";
import * as constant from "./constant.js";
import * as id from "./id.js";
import * as list from "./list.js";
import * as path from "./path.js";
import * as string from "./string.js";

export function handleClick(hat_id) {
	const hat = window.data[hat_id];
	const placement = list.getPlacementFromNumber(hat.u);

	if (window.currentHats[placement] == hat_id) {
		window.currentHats[placement] = 0;
	} else {
		window.currentHats[placement] = hat_id;
	}

	changeHatImage(placement);
}

export function markSelectedHatFromWatch(oldHatId, newHatId) {
	if (oldHatId) {
		const element = document.getElementById(oldHatId);
		element.style.backgroundColor = "";
	}
	if (newHatId) {
		const element = document.getElementById(newHatId);
		element.style.backgroundColor = "yellow";
	}
}

export function clearHat(placement) {
	const hat_id = window.currentHats[placement];
	if (hat_id != 0) {
		window.currentHats[placement] = 0;
		changeHatImage(placement);
	}
}

export function clearHats() {
	for (let placement in window.currentHats) {
		clearHat(placement);
	}
}

export function readjustHats() {
	for (const [placement, hat_id] of Object.entries(window.currentHats)) {
		if (hat_id != 0) {
			changeHatImage(placement);
		}
	}
}

export function changeHatImage(placement) {
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
		const shape = hatInfo[id.shapePositions][window.animal];
		const [hat_x, hat_y] =
			shape?.x || shape?.y ? [shape?.x, shape?.y] : [hatInfo["x"], hatInfo["y"]];
		const cPos = window.customPositions[placement];
		const [cus_x, cus_y] = [cPos.x, cPos.y];

		window.windowPositions[placement].x = base_x + body_x + hat_x;
		window.windowPositions[placement].y = base_y + body_y + hat_y;
		hatImg.style.left = `${window.windowPositions[placement].x + cus_x + window.offset.x}px`;
		hatImg.style.top = `${window.windowPositions[placement].y + cus_y + window.offset.y}px`;
		const images = hatInfo["g"].split(",");
		const imageNo = images[0];
		hatImg.src = path.getHatImage(imageNo);

		if (images.length > 1) {
			const rate = hatInfo["a"];
			const duration = 10000 / rate;
			animation.startImageChange(placement, animation.animationHolder, images, duration);
		}

		arrangeHatOrder();
	}
}

export function setHatPriority(placement, priority) {
	if (priority === 0) {
		window.hatPriority[placement] = 0;
	} else {
		for (const [iPlacement, iPriority] of Object.entries(window.hatPriority)) {
			if (iPriority === priority) {
				window.hatPriority[iPlacement] = 0;
			}
		}

		window.hatPriority[placement] = priority;
	}

	arrangeHatOrder();
}

export function enablePrioritybuttonsFromWatch(placement, oldPriority, newPriority) {
	const oldId = id.priorityToId[oldPriority];
	document.getElementById(`${placement}-${oldId}`).disabled = false;

	const newId = id.priorityToId[newPriority];
	document.getElementById(`${placement}-${newId}`).disabled = true;
}

function arrangeHatOrder() {
	const placementNames = Object.keys(window.currentHats);
	placementNames.sort(function (a, b) {
		const priorityA = window.hatPriority[a] || 0;
		const priorityB = window.hatPriority[b] || 0;
		if (priorityA !== priorityB) {
			return priorityA - priorityB;
		}
		return getRankOfPlacement(a) - getRankOfPlacement(b);
	});

	const imageContainer = document.getElementById(id.imageContainer);
	placementNames.forEach((placement) => {
		const hatElement = document.getElementById(placement);
		imageContainer.appendChild(hatElement);
	});
}

function getRankOfPlacement(placement) {
	const hatData = window.data[window.currentHats[placement]];
	const layerName = id.placementTranslation[placement];
	return hatData?.wearLayer[layerName] ?? 0;
}

export function toggleAdjustment() {
	const adjustmentButton = document.getElementById(id.adjustmentButton);
	const positionPanel = document.getElementById(id.positionPanel);

	window.adjustmentPanelShown = !window.adjustmentPanelShown;

	if (window.adjustmentPanelShown) {
		adjustmentButton.textContent = string.hideAjustment;
		positionPanel.hidden = false;
	} else {
		adjustmentButton.textContent = string.openAjustment;
		positionPanel.hidden = true;
	}
}

export function updateCustomPosition(placement, axis, value) {
	const parsedValue = parseInt(value);
	if (isNaN(parsedValue)) {
		return;
	}

	window.customPositions[placement][axis] = Number(value);
	const slider = document.getElementById(`${placement}-slider-${axis}`);
	const field = document.getElementById(`${placement}-field-${axis}`);
	slider.value = parsedValue;
	field.value = parsedValue;

	const hatImg = document.getElementById(placement);
	const position = window.windowPositions[placement];

	if (axis === "x") {
		hatImg.style.left = `${position.x + parsedValue + window.offset.x}px`;
	} else {
		hatImg.style.top = `${position.y + parsedValue + window.offset.y}px`;
	}
}

export function resetCustomAdjustments() {
	resetCustomPositions();
	resetPriorities();
}

function resetCustomPositions() {
	for (let placement in window.currentHats) {
		updateCustomPosition(placement, "x", 0);
		updateCustomPosition(placement, "y", 0);
	}
}

function resetPriorities() {
	for (const placement in window.hatPriority) {
		window.hatPriority[placement] = 0;
	}
}

export function uploadHat(placement) {
	const fileInput = document.getElementById(id.fileInput);
	fileInput.dataset.placement = placement;
	fileInput.click();
}

export function uploadHatListener() {
	const fileInput = document.getElementById(id.fileInput);
	const file = fileInput.files[0];
	if (!file || !fileInput.dataset.placement) {
		return;
	}

	const placement = fileInput.dataset.placement;
	const reader = new FileReader();

	// Add the custom hat to the relevant places
	reader.onload = () => {
		const hatId = id.placementToCustomId[placement];
		window.customHats[hatId] = reader.result;

		const listImage = document.getElementById(`${hatId}-${id.image}`);
		listImage.src = reader.result;

		window.currentHats[placement] = hatId;
		changeHatImage(placement);

		handleHatVisibility();
		const imageList = document.getElementById(id.listContainer);
		imageList.scrollTop = 0;
	};
	reader.readAsDataURL(file);
}

export function handleHatVisibility() {
	const listItems = document.querySelectorAll(`.${id.listItemClass}`);
	listItems.forEach((item) => {
		const name = item.querySelector(`.${id.itemNameClass}`).dataset.names;

		if (["-1", "-2", "-3"].includes(item.id) && !window.customHats[item.id]) {
			item.style.display = "none";
			return;
		}

		if (name.includes(window.searchQuery) && cc.shouldBeVisible(window.customHatLevel, item)) {
			item.style.display = "flex";
		} else {
			item.style.display = "none";
		}
	});
}
