export const api = "https://hundeparken.net/api/items";

export function getHatImage(imageNo) {
	if (imageNo in window.customHats) {
		return window.customHats[imageNo];
	}

	return parseInt(imageNo) >= 0
		? `https://hundeparken.net/h5/game/gfx/item/${imageNo}.png`
		: `./images/self_images/${imageNo}.png`;
}

const backgroundImgs = [
	"base.png",
	"base_sand.png",
	"base_snow.png",
	"base_pluto.png",
	"base_halloween.png",
	"base_water.png",
	"chess.png",
	"base_tricolore.png",
	"base_tricolore2.png",
	"RAINBOWPLATFORM.png",
	"kizz.gif",
];

export const getBackgroundImage = (count) => {
	const index = ((count % backgroundImgs.length) + backgroundImgs.length) % backgroundImgs.length;
	return `images/backgrounds/${backgroundImgs[index]}`;
};
