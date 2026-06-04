export const api = "https://hundeparken.net/api/items";

export function getHatImage(imageNo) {
	if (imageNo in window.customHats) {
		return window.customHats[imageNo];
	}

	if (imageNo in window.tintedSrcs) {
		return window.tintedSrcs[imageNo];
	}

	return parseInt(imageNo) >= 0
		? `https://hundeparken.net/h5/game/gfx/item/${imageNo}.png`
		: `./images/self_images/${imageNo}.png`;
}

export function getTintGraphic(imageNo) {
	return `./images/tintGraphics/${imageNo}.png`;
}

export function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "Anonymous";

		img.onload = () => resolve(img);
		img.onerror = reject;

		img.src = src;
	});
}

const backgroundImgs = [
	"base.png",
	"base_sand.png",
	"base_snow.png",
	"base_pluto.png",
	"base_halloween.png",
	"base_valentine.png",
	"base_water.png",
	"chess.png",
	"base_tricolore.png",
	"base_tricolore2.png",
	"RAINBOWPLATFORM.png",
	"titlescreen.png",
	"kizz.gif",
];

export const getBackgroundImage = (count) => {
	const index = ((count % backgroundImgs.length) + backgroundImgs.length) % backgroundImgs.length;
	return `images/backgrounds/${backgroundImgs[index]}`;
};
