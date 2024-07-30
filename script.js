let commands = {
	head: 0,
	mouth: 0,
	belly: 0,
};

let animal = "dog";

base_coor_dict = {
	dog: [141, 71],
	wolf: [139, 66],
	cat: [145, 69],
	bear: [137, 70],
};
head_coor_dict = {
	dog: [11, 1],
	wolf: [12, 5],
	cat: [8, 6],
	bear: [13, 1],
};
mouth_coor_dict = {
	dog: [3, 5],
	wolf: [3, 11],
	cat: [2, 12],
	bear: [2, 10],
};
belly_coor_dict = {
	dog: [23, 4],
	wolf: [25, 10],
	cat: [19, 9],
	bear: [27, 2],
};
dildo_coor_dict = {
	dog: [40, 15],
	wolf: [40, 26],
	cat: [31, 18],
	bear: [47, 16],
};
body_coor_dicts = {
	head: head_coor_dict,
	mouth: mouth_coor_dict,
	belly: belly_coor_dict,
	dildo: dildo_coor_dict,
};

let data;

document.addEventListener("DOMContentLoaded", async function () {
	data = await getList();
	populateList(data);
	makeImage();
});

async function getList() {
	try {
		const response = await fetch("https://hundeparken.net/api/items");
		const dataRaw = await response.json();
		const data = dataRaw.reduce((acc, item) => {
			const { id, ...rest } = item; // Extract the id and the rest of the properties
			acc[id] = rest; // Assign the rest of the properties to the dictionary with id as the key
			return acc;
		}, {});
		return data;
	} catch (error) {
		console.error("Error fetching or processing data:", error);
		return []; // Return an empty array in case of an error
	}
}

// Function to create the list items
function populateList(data) {
	const container = document.getElementById("list-container");
	container.innerHTML = ""; // Clear any existing content

	const itemsArray = Object.keys(data).map((key) => ({
		key: key,
		...data[key],
	}));
	itemsArray.sort((a, b) => a.n.localeCompare(b.n));

	itemsArray.forEach((item) => {
		if (item.u == "11") {
			return;
		}

		const listItem = document.createElement("div");
		listItem.className = "list-item";

		// Add a click event listener to the list item
		listItem.addEventListener("click", () => handleClick(item.key));
		listItem.id = item.key;

		// Create a span for the name
		const nameSpan = document.createElement("span");
		nameSpan.textContent = item.n;
		nameSpan.className = "item-name";

		// Create an img element for the image
		const image = document.createElement("img");
		imageNo = item.g.split(",")[0];
		image.src = `https://hundeparken.net/h5/game/gfx/item/${imageNo}.png`;
		image.alt = `${item.n} image`;
		image.className = "item-image";

		// Append name and image to the list item container
		listItem.appendChild(nameSpan);
		listItem.appendChild(image);

		// Append the list item to the container
		container.appendChild(listItem);
	});
}

function makeImage() {
	const images = [{ src: `images/${animal}.png`, x: 0, y: 0 }];

	for (const [key, value] of Object.entries(commands)) {
		if (value == 0) {
			continue;
		}
		let [x, y] = body_coor_dicts[key][animal];
		imageNo = data[value]["g"].split(",")[0];
		images.push({
			src: `https://hundeparken.net/h5/game/gfx/item/${imageNo}.png`,
			x: data[value]["x"] + x,
			y: data[value]["y"] + y,
		});
	}

	const container = document.getElementById("image-container");
	container.innerHTML = "";

	const img = document.createElement("img"); // Have this as the base
	img.src = "images/base.png";
	img.classList.add("stacked-image");
	container.appendChild(img);

	const [baseX, baseY] = base_coor_dict[animal];

	images.forEach(({ src, x, y }) => {
		const img = document.createElement("img");
		img.src = src;
		img.classList.add("stacked-image");
		img.style.left = `${x + baseX}px`;
		img.style.top = `${y + baseY}px`;
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
		default:
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
		}
		commands[key] = 0;
	}
	makeImage();
}
