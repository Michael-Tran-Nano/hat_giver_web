let commands = {
	head: 0,
	mouth: 0,
	belly: 0,
};

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

function makeImage() {
	const [base_x, base_y] = base_coor_dict[animal];
	const images = [
		{ src: `images/base.png`, x: -base_x, y: -base_y },
		{ src: `images/${animal}.png`, x: 0, y: 0 },
	];

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
		});
	}

	const container = document.getElementById("image-container");
	container.innerHTML = "";

	images.forEach(({ src, x, y }) => {
		const img = document.createElement("img");
		img.src = src;
		img.classList.add("stacked-image");
		img.style.left = `${x + base_x}px`;
		img.style.top = `${y + base_y}px`;
		container.appendChild(img);
	});
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
