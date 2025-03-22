// when moving away, it should be deleted.
// fix placement of images

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
	{ x: 47, y: 274 },
	{ x: 131, y: 274 },
	{ x: 214, y: 274 },
	{ x: 47, y: 358 },
	{ x: 131, y: 358 },
	{ x: 214, y: 358 },
	{ x: 47, y: 441 },
	{ x: 131, y: 441 },
	{ x: 214, y: 441 },
];

function createImages() {
	let cols = 3;
	let rows = 14;
	let index = 0;
	const canvasRect = imageCanvas.getBoundingClientRect();

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (index >= 42) return;
			const img = new Image();
			img.src = `tiles/${index + 1}.png`;
			img.classList.add("draggable");

			// Calculate positions relative to the canvas
			let xPos = col * (colSpace + imageLen) + colCorrection[col] + 17;
			let yPos = row * (rowSpace + imageLen) + rowCorrection[row] + 16;

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

	// Set the size of the new canvas to match the bingo plate
	saveCanvas.width = bingoCanvas.width;
	saveCanvas.height = bingoCanvas.height;

	// Draw the background of the bingo plate (plate.png)
	const background = new Image();
	background.src = "plate.png";

	background.onload = function () {
		// Draw the plate background to the new canvas
		saveCtx.drawImage(background, 0, 0, saveCanvas.width, saveCanvas.height);

		// Now draw the images placed on the bingo canvas
		let imagesLoaded = 0;

		// Iterate over all the images and draw them at their current positions
		images.forEach((imgObj) => {
			if (imgObj.onBingo) {
				// Create a new image element and set its source
				const img = new Image();
				img.src = imgObj.img.src;

				img.onload = function () {
					// Draw the image on the saved plate at its relative position on the bingo canvas
					// Use imgObj.x and imgObj.y directly to get the position on the bingoCanvas
					saveCtx.drawImage(img, imgObj.x - 21, imgObj.y - 21, 42, 42); // Adjust size if needed

					imagesLoaded++;

					// Check if all images are loaded and drawn
					if (imagesLoaded === images.filter((img) => img.onBingo).length) {
						const link = document.createElement("a");
						link.download = "filled_bingo_plate.png";
						link.href = saveCanvas.toDataURL();
						link.click();
					}
				};
			}
		});
	};
}

window.onload = createImages;
