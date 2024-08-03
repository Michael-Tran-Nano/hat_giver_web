import * as constant from "./constant.js";

export function hexToRgb(hex) {
	hex = hex.replace(/^#/, "");
	let bigint = parseInt(hex, 16);
	let r = (bigint >> 16) & 255;
	let g = (bigint >> 8) & 255;
	let b = bigint & 255;
	return { r: r, g: g, b: b };
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
		r: Math.ceil(color.r * 0.7) - 1,
		g: Math.ceil(color.g * 0.7) - 1,
		b: Math.ceil(color.b * 0.7) - 1,
	};
}

export function recolorAnimalImage(src, targetColor) {
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

			const targetColorShadow = getShadow(targetColor);

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
