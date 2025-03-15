import * as path from "./path.js";
import * as id from "./id.js";
import * as constants from "./constant.js";

export function populateList(data, handleClick, skipObjects) {
	const container = document.getElementById(id.listContainer);
	container.innerHTML = "";

	const itemsArray = Object.keys(data).map((key) => ({
		key: key,
		...data[key],
	}));
	itemsArray.sort((a, b) => a.n.localeCompare(b.n));

	itemsArray.forEach((item) => {
		// skip non-hats
		if (skipObjects && item.u == "11") {
			return;
		}

		if (constants.excludedHatIds.includes(item.key)) {
			return;
		}

		const listItem = document.createElement("div");
		listItem.className = "list-item";
		listItem.addEventListener("click", () => handleClick(item.key));
		listItem.id = item.key;
		listItem.title = item.d;

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

export function getPlacementFromNumber(u) {
	if (u == "1") {
		return id.head;
	} else if (u == "2") {
		return id.mouth;
	}
	return id.belly;
}
