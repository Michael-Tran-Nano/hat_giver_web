// when moving away, it should be deleted.

window.saveBingoPlate = saveBingoPlate;

const imageCanvas = document.getElementById("imageCanvas");
const imageCanvasContainer = document.getElementById("imageCanvasContainer");
const bingoCanvas = document.getElementById("bingoCanvas");
const ctxBingo = bingoCanvas.getContext("2d");

const imageLen = 42;
const colSpace = 35;
const colCorrection = [0, 0, -1];
const colCorrection2 = [0, -2, -3];
const rowSpace = 19;
const rowCorrection = [0, 0, 0, 0, -1, 4, 3, 0, 0, 0, 0, -1, 4, 3];
const images = [];
const slots = [
	{ x: 46, y: 273 },
	{ x: 130, y: 273 },
	{ x: 213, y: 273 },
	{ x: 46, y: 357 },
	{ x: 130, y: 357 },
	{ x: 213, y: 357 },
	{ x: 46, y: 440 },
	{ x: 130, y: 440 },
	{ x: 213, y: 440 },
];

function createImages() {
	let cols = 3;
	let rows = 14;
	let index = 0;

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (index >= 42) return;
			const img = new Image();
			img.src = `bingo/tiles/${index + 1}.png`;
			img.classList.add("draggable");

			// Calculate positions relative to the canvas
			let xPos = col * (colSpace + imageLen) + colCorrection[col] + 16;
			let yPos = row * (rowSpace + imageLen) + rowCorrection[row] + 15;

			if (index > 20) {
				xPos += 643 + colCorrection2[col];
				yPos += -427;
			}

			img.style.position = "absolute";
			img.style.left = `${xPos}px`;
			img.style.top = `${yPos}px`;
			img.draggable = true;
			img.dataset.index = index;
			img.ondragstart = dragStart;

			imageCanvasContainer.appendChild(img);
			images.push({ img, x: xPos, y: yPos, onBingo: false });
			index++;
		}
	}
}

function dragStart(event) {
	event.dataTransfer.setData("index", event.target.dataset.index);
}

bingoCanvas.ondragover = (event) => event.preventDefault();
bingoCanvas.ondrop = (event) => {
	event.preventDefault();
	const imgIndex = event.dataTransfer.getData("index");
	const imgObj = images[imgIndex];
	if (!imgObj) return;

	const rect = bingoCanvas.getBoundingClientRect();
	const x = event.clientX - rect.left - 21;
	const y = event.clientY - rect.top - 21;

	const closestSlot = slots.find(
		(slot) => Math.abs(slot.x - x) < 20 && Math.abs(slot.y - y) < 20
	);

	if (closestSlot) {
		const img = new Image();
		img.src = imgObj.img.src;
		img.classList.add("draggable");
		img.style.position = "absolute";
		img.style.left = `${closestSlot.x}px`;
		img.style.top = `${closestSlot.y}px`;
		img.dataset.index = imgIndex;
		img.dataset.slot = `${closestSlot.x}-${closestSlot.y}`;
		img.onclick = () => removeImage(img, imgIndex);
		img.draggable = true;
		img.ondragstart = dragStart;
		bingoCanvas.parentElement.appendChild(img);

		imgObj.img.remove();
		imgObj.onBingo = true;
	} else {
		moveToOriginalPosition(imgObj);
	}
};

function removeImage(img, index) {
	img.remove();
	const imgObj = images[index];
	if (imgObj) {
		moveToOriginalPosition(imgObj);
	}
}

function moveToOriginalPosition(imgObj) {
	imgObj.img.style.left = imgObj.x + "px";
	imgObj.img.style.top = imgObj.y + "px";
	imageCanvasContainer.appendChild(imgObj.img);
	imgObj.onBingo = false;
}

function saveBingoPlate() {
	// Create a new canvas to render the saved plate with images
	const saveCanvas = document.createElement("canvas");
	const saveCtx = saveCanvas.getContext("2d");

	// Disable smoothing for pixel-perfect rendering
	saveCtx.imageSmoothingEnabled = false;

	// Load the background image first
	const background = new Image();
	background.src = "bingo/plate.png";

	background.onload = function () {
		// Match canvas size to the exact size of the background image
		saveCanvas.width = background.width;
		saveCanvas.height = background.height;

		// Draw the background with original dimensions
		saveCtx.drawImage(background, 0, 0, background.width, background.height);

		const plateImages = document.querySelectorAll(".bingo-container img");

		// Convert NodeList to an array and create promises for image loading
		const imagePromises = Array.from(plateImages).map((img) => {
			return new Promise((resolve) => {
				const plateImage = new Image();
				plateImage.src = img.src;
				plateImage.onload = function () {
					const left = parseInt(img.style.left, 10);
					const top = parseInt(img.style.top, 10);
					saveCtx.drawImage(
						plateImage,
						left,
						top + 7,
						plateImage.width,
						plateImage.height
					);
					resolve();
				};
			});
		});

		// Wait for all images to load before saving
		Promise.all(imagePromises).then(() => {
			const link = document.createElement("a");
			link.download = "filled_bingo_plate.png";
			link.href = saveCanvas.toDataURL("image/png"); // Ensure lossless quality
			link.click();
		});
	};
}

window.onload = createImages;
