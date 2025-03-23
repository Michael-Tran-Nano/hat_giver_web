window.saveBingoPlate = saveBingoPlate;

const imageCanvas = document.getElementById("imageCanvas");
const imageCanvasContainer = document.getElementById("imageCanvasContainer");
const bingoCanvas = document.getElementById("bingoCanvas");
const ctxBingo = bingoCanvas.getContext("2d");

const imageLen = 42;
const images = [];
const slotLen = 74;
const slots = [
	{ x: 46, y: 273, no: 1 },
	{ x: 130, y: 273, no: 2 },
	{ x: 213, y: 273, no: 3 },
	{ x: 46, y: 357, no: 4 },
	{ x: 130, y: 357, no: 5 },
	{ x: 213, y: 357, no: 6 },
	{ x: 46, y: 440, no: 7 },
	{ x: 130, y: 440, no: 8 },
	{ x: 213, y: 440, no: 9 },
];

const colNumber = 3;
const colSpace = 35;
const colStart = 16;
const colCorrection = [0, 0, -1];
const colCorrection2 = [0, -2, -3];
const rowNumber = 14;
const rowSpace = 19;
const rowStart = 15;
const rowCorrection = [0, 0, 0, 0, -1, 4, 3, 0, 0, 0, 0, -1, 4, 3];
const sideSplitIndex = 21;
const sideXShift = 643;
const sideYShift = -427;
const saveCorrectionY = 7;

function createImages() {
	let cols = colNumber;
	let rows = rowNumber;
	let index = 0;

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const img = new Image();
			img.src = `bingo/tiles/${index + 1}.png`;
			img.classList.add("draggable");

			let xPos = col * (colSpace + imageLen) + colCorrection[col] + colStart;
			let yPos = row * (rowSpace + imageLen) + rowCorrection[row] + rowStart;
			if (index >= sideSplitIndex) {
				xPos += sideXShift + colCorrection2[col];
				yPos += sideYShift;
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
	const x = event.clientX - rect.left - imgObj.img.width / 2;
	const y = event.clientY - rect.top - imgObj.img.height / 2;

	const closestSlot = slots.find(
		(slot) =>
			Math.abs(slot.x - x) < slotLen / 2 && Math.abs(slot.y - y) < slotLen / 2
	);

	if (closestSlot) {
		const slotNo = closestSlot.no;
		const occupantImg = document.querySelector(`img[data-slot='${slotNo}']`);
		if (occupantImg) {
			const occupantIndex = occupantImg.dataset.index;
			removeImage(occupantImg, occupantIndex);
		}

		const img = new Image();
		img.src = imgObj.img.src;
		img.classList.add("clickable");
		img.style.position = "absolute";
		img.style.left = `${closestSlot.x}px`;
		img.style.top = `${closestSlot.y}px`;
		img.dataset.index = imgIndex;
		img.dataset.slot = `${slotNo}`;
		img.onclick = () => removeImage(img, imgIndex);
		bingoCanvas.parentElement.appendChild(img);

		imgObj.img.remove();
		imgObj.onBingo = true;
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
	const saveCanvas = document.createElement("canvas");
	const saveCtx = saveCanvas.getContext("2d");
	saveCtx.imageSmoothingEnabled = false;

	const background = new Image();
	background.src = "bingo/plate.png";

	background.onload = function () {
		saveCanvas.width = background.width;
		saveCanvas.height = background.height;
		saveCtx.drawImage(background, 0, 0, background.width, background.height);

		const plateImages = document.querySelectorAll(".bingo-container img");

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
						top + saveCorrectionY,
						plateImage.width,
						plateImage.height
					);
					resolve();
				};
			});
		});

		Promise.all(imagePromises).then(() => {
			const link = document.createElement("a");
			link.download = "filled_bingo_plate.png";
			link.href = saveCanvas.toDataURL("image/png");
			link.click();
		});
	};
}

window.onload = createImages;
