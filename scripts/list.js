import * as path from "./path.js";
import * as id from "./id.js";
import * as constant from "./constant.js";

export function populateList(data, handleClick, skipObjects, language) {
	const container = document.getElementById(id.listContainer);
	container.innerHTML = "";

	const itemsArray = Object.keys(data).map((key) => ({
		key: key,
		...data[key],
	}));

	itemsArray.forEach((item) => {
		// skip non-hats
		if (skipObjects && item.u == "11") {
			return;
		}

		if (constant.excludedHatIds.includes(item.key)) {
			return;
		}

		const listItem = document.createElement("div");
		listItem.className = id.listItemClass;
		listItem.addEventListener("click", () => handleClick(item.key));
		listItem.id = item.key;

		// Type icon
		const placement = getPlacementFromNumber(item.u);
		const leftImage = document.createElement("img");
		leftImage.src = `images/${placement}.png`;
		leftImage.alt = `${item.name.en} left image`;
		leftImage.className = "left-image";

		// Name
		const nameSpan = document.createElement("span");
		nameSpan.className = id.itemNameClass;
		nameSpan.dataset.names =
			`${item.name.dk}|${item.name.no}|${item.name.se}|${item.name.en}`.toLowerCase();
		nameSpan.dataset.dk = `${item.name.dk.trim()}${constant.seperator}${item.description.dk}`;
		nameSpan.dataset.no = `${item.name.no.trim()}${constant.seperator}${item.description.no}`;
		nameSpan.dataset.se = `${item.name.se.trim()}${constant.seperator}${item.description.se}`;
		nameSpan.dataset.en = `${item.name.en.trim()}${constant.seperator}${item.description.en}`;

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

	handleLanguage(language);
}

export function getPlacementFromNumber(u) {
	if (u == "1") {
		return id.head;
	} else if (u == "2") {
		return id.mouth;
	}
	return id.belly;
}

export function addLanguageOptions() {
	const languageSelect = document.getElementById(id.language);

	for (const language of Object.keys(constant.languages)) {
		const option = document.createElement("option");
		option.value = `${constant.languages[language]}`;
		option.textContent = language;
		languageSelect.appendChild(option);
	}

	languageSelect.addEventListener("change", (event) => {
		handleLanguage(event.target.value);
	});
}

function handleLanguage(language) {
	const container = document.getElementById(id.listContainer);
	const listItems = Array.from(container.querySelectorAll(`.${id.listItemClass}`));
	listItems.forEach((listItem) => {
		let localText = "";
		const itemName = listItem.querySelector(`.${id.itemNameClass}`);
		switch (language) {
			case constant.languages.Dansk:
				localText = itemName.dataset.dk;
				break;
			case constant.languages.Norsk:
				localText = itemName.dataset.no;
				break;
			case constant.languages.Svenska:
				localText = itemName.dataset.se;
				break;
			case constant.languages.English:
				localText = itemName.dataset.en;
				break;
			default:
				localText = itemName.dataset.no;
		}

		const parts = localText.split(constant.seperator);
		const newName = parts[0];
		const description = parts[1];

		itemName.textContent = newName || "MISSING NAME";
		listItem.title = description + getAllNameDescription(itemName.dataset);
	});

	listItems.sort((a, b) => {
		const textA = a.querySelector(`.${id.itemNameClass}`).textContent;
		const textB = b.querySelector(`.${id.itemNameClass}`).textContent;
		return textA.localeCompare(textB, "da-DK");
	});

	listItems.forEach((item) => container.appendChild(item));
}

function getAllNameDescription(nameDataset) {
	const dk = nameDataset.dk.split(constant.seperator)[0];
	const no = nameDataset.no.split(constant.seperator)[0];
	const se = nameDataset.se.split(constant.seperator)[0];
	const en = nameDataset.en.split(constant.seperator)[0];
	return `\n\ndk: ${dk}\nno: ${no}\nse: ${se}\nen: ${en}`;
}
