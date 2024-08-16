export const api = "https://hundeparken.net/api/items";

export const getHatImage = (imageNo) =>
	parseInt(imageNo) >= 0
		? `https://hundeparken.net/h5/game/gfx/item/${imageNo}.png`
		: `./images/self_images/${imageNo}.png`;
