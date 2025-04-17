window.generatePlate = generatePlate;
window.generateRandomPlate = generateRandomPlate;
window.saveCanvas = saveCanvas;
window.onload = drawEmptyPlate(false);

const selectorGrid = document.getElementById("selectorGrid");
const imageOptions = 42;
const warningDiv = document.getElementById("warning");
const selectors = [];
const xStart = 46;
const yStart = 280;
const spacing = 84;

for (let i = 0; i < 9; i++) {
	const wrapper = document.createElement("div");
	wrapper.classList.add("selector-wrapper");

	const select = document.createElement("select");
	for (let j = 1; j <= imageOptions; j++) {
		const option = document.createElement("option");
		option.value = j;
		option.textContent = j;
		if (j === i + 1) option.selected = true;
		select.appendChild(option);
	}

	const preview = document.createElement("img");
	preview.src = `bingo/tiles/${i + 1}.png`;
	preview.className = "preview";

	select.addEventListener("change", () => {
		preview.src = `bingo/tiles/${select.value}.png`;
	});

	selectors.push(select);
	wrapper.appendChild(select);
	wrapper.appendChild(preview);
	selectorGrid.appendChild(wrapper);
}

function drawEmptyPlate(callback) {
	const canvas = document.getElementById("bingoplateCanvas");
	const ctx = canvas.getContext("2d");
	const plateImage = new Image();
	plateImage.src = "bingo/plate.png";
	plateImage.onload = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(plateImage, 0, 0);
		if (callback) callback();
	};
}

function generatePlate() {
	const values = selectors.map((select) => select.value);
	const duplicates = findDuplicates(values);
	showWarnings(duplicates);

	drawEmptyPlate(() => {
		const canvas = document.getElementById("bingoplateCanvas");
		const ctx = canvas.getContext("2d");
		const imageSize = 42;

		values.forEach((value, i) => {
			const img = new Image();
			img.src = `bingo/tiles/${value}.png`;
			img.onload = () => {
				const [x, y] = [
					xStart + spacing * (i % 3),
					yStart + spacing * Math.floor(i / 3),
				];
				ctx.drawImage(img, x, y, imageSize, imageSize);
			};
		});
	});
}

function generateRandomPlate() {
	const nums = generateUniqueRandomNumbers(9, 1, imageOptions);
	nums.forEach((num, i) => {
		selectors[i].value = num;
		selectors[i].dispatchEvent(new Event("change"));
	});
	showWarnings([]);
	generatePlate();
}

function generateUniqueRandomNumbers(count, min, max) {
	const numbers = new Set();
	while (numbers.size < count) {
		numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
	}
	return Array.from(numbers);
}

function findDuplicates(arr) {
	const seen = {};
	const duplicates = [];
	arr.forEach((val) => {
		seen[val] = (seen[val] || 0) + 1;
		if (seen[val] === 2) {
			duplicates.push(val);
		}
	});
	return duplicates;
}

function showWarnings(duplicates) {
	if (duplicates.length > 0) {
		warningDiv.textContent = duplicates
			.map((d) => `${d} is used more than once!`)
			.join(" ");
	} else {
		warningDiv.textContent = "";
	}
}

function saveCanvas() {
	const canvas = document.getElementById("bingoplateCanvas");
	const link = document.createElement("a");
	link.download = "bingo-plate.png";
	link.href = canvas.toDataURL("image/png");
	link.click();
}
