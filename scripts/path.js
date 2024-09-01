export const api = "https://hundeparken.net/api/items";

export const getHatImage = (imageNo) =>
	parseInt(imageNo) >= 0
		? `https://hundeparken.net/h5/game/gfx/item/${imageNo}.png`
		: `./images/self_images/${imageNo}.png`;

const backgroundImgs = [
	`base.png`,
	`base_sand.png`,
	"base_snow.png",
	"base_tricolore.png",
	"base_tricolore2.png",
];

export const getBackgroundImage = (count) => {
	const index =
		((count % backgroundImgs.length) + backgroundImgs.length) %
		backgroundImgs.length;
	return `images/${backgroundImgs[index]}`;
};
