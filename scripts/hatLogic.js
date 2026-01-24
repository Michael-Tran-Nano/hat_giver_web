import * as animation from "./animation.js";
import * as constant from "./constant.js";
import * as id from "./id.js";
import * as list from "./list.js";
import * as path from "./path.js";

export function handleClick(hat_id) {
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
		const elementOld = document.getElementById(window.currentHats[placement]);
		if (elementOld !== null) {
			elementOld.style.backgroundColor = "";
		}
		window.currentHats[placement] = hat_id;
		element.style.backgroundColor = "yellow";
	}

	changeHatImage(placement);
}

export function clearHat(placement) {
	const hat_id = window.currentHats[placement];
	if (hat_id != 0) {
		const element = document.getElementById(`${hat_id}`);
		element.style.backgroundColor = "";
		window.currentHats[placement] = 0;
		changeHatImage(placement);
	}
}

export function clearHats() {
	for (let placement in window.currentHats) {
		clearHat(placement);
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

		hatImg.style.left = `${base_x + body_x + hat_x + window.offset.x}px`;
		hatImg.style.top = `${base_y + body_y + hat_y + window.offset.y}px`;
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

function arrangeHatOrder() {
	const placementNames = Object.keys(window.currentHats);
	placementNames.sort(function (a, b) {
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
