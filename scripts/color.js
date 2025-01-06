import * as constant from "./constant.js";

export function hexToRgb(hex) {
	hex = hex.replace(/^#/, "");

	if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
		return null;
	}

	let bigint = parseInt(hex, 16);
	let r = (bigint >> 16) & 255;
	let g = (bigint >> 8) & 255;
	let b = bigint & 255;

	return { r: r, g: g, b: b };
}

export function rgbToHex({ r, g, b }) {
	if (
		typeof r !== "number" ||
		r < 0 ||
		r > 255 ||
		typeof g !== "number" ||
		g < 0 ||
		g > 255 ||
		typeof b !== "number" ||
		b < 0 ||
		b > 255
	) {
		return null;
	}

	return (
		"#" +
		((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
	);
}

export function isColor(pixel, color) {
	return pixel[0] === color.r && pixel[1] === color.g && pixel[2] === color.b;
}

export function setColor(pixel, color) {
	pixel[0] = color.r;
	pixel[1] = color.g;
	pixel[2] = color.b;
}

export function getShadow(color) {
	return {
		r: Math.max(Math.ceil(color.r * 0.7) - 1, 0),
		g: Math.max(Math.ceil(color.g * 0.7) - 1, 0),
		b: Math.max(Math.ceil(color.b * 0.7) - 1, 0),
	};
}

export function recolorAnimalImage(
	src,
	targetColor,
	shadowColor,
	customShadowColor
) {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.src = src;
		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;

			const targetColorShadow = customShadowColor
				? shadowColor
				: getShadow(targetColor);

			// 4th is alpha
			for (let i = 0; i < data.length; i += 4) {
				const pixel = data.subarray(i, i + 4);
				if (isColor(pixel, constant.white)) {
					setColor(pixel, targetColor);
				} else if (isColor(pixel, constant.shadowWhite)) {
					setColor(pixel, targetColorShadow);
				}
			}

			ctx.putImageData(imageData, 0, 0);
			const newImg = new Image();
			newImg.src = canvas.toDataURL();
			resolve(newImg);
		};
	});
}
