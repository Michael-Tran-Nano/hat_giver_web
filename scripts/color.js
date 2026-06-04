import * as constant from "./constant.js";
import * as hatLogic from "./hatLogic.js";
import * as id from "./id.js";
import * as string from "./string.js";
import * as path from "./path.js";

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

	return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

export function isColor(pixel, color) {
	if ("a" in color) {
		return (
			pixel[0] === color.r && pixel[1] === color.g && pixel[2] === color.b && pixel[3] == color.a
		);
	}

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

export function recolorAnimalImage(src, targetColor, shadowColor, customShadowColor) {
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

			const targetColorShadow = customShadowColor ? shadowColor : getShadow(targetColor);

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

export function populateBetaDogs(changeToBetaDog) {
	const betaSelect = document.getElementById(id.betaDogs);
	constant.betaDogs.forEach((dog) => {
		const option = document.createElement("option");
		option.value = `#${dog.fur},#${dog.shadow}`;
		option.textContent = dog.name;
		betaSelect.appendChild(option);
	});

	betaSelect.addEventListener("change", (event) => {
		const [fur, shadow] = event.target.value.split(",");
		changeToBetaDog(fur, shadow);
	});
}

export function updateTinkAbility(placement) {
	const divPanel = document.getElementById(`${placement}-tint`);
	const hat_id = window.currentHats[placement];
	const hat = window.data[hat_id];

	if (window.currentHats[placement] != 0 && hat?.layers?.some((layer) => layer.isTintable)) {
		const tintOpenButton = document.getElementById(id.tintOpenButton);
		tintOpenButton.hidden = false;
		divPanel.hidden = false;

		const tintButton = document.getElementById(`${placement}-tint-button`);
		if (tintingPossible(hat)) {
			tintButton.disabled = false;
			tintButton.title = "";
		} else {
			tintButton.disabled = true;
			tintButton.title = string.tintUnavailable;
		}
	} else {
		divPanel.hidden = true;
	}
}

function tintingPossible(hat) {
	const tintGfx = hat.layers?.find((layer) => layer.isTintable)?.gfx.split(",");
	const nonTintGfx = hat.layers?.find((layer) => !layer.isTintable)?.gfx.split(",");
	return [].concat(tintGfx, nonTintGfx).every((imageNo) => window.availableTints.has(imageNo));
}

export function toggleTintPanel() {
	const tintPanel = document.getElementById(id.tintPanel);
	tintPanel.hidden = !tintPanel.hidden;

	const tintButton = document.getElementById(id.tintOpenButton);
	tintButton.textContent = tintPanel.hidden ? string.openTint : string.closeTint;
}

export async function tintHat(placement) {
	const tintColor = hexToRgb(document.getElementById(`${placement}-tint-color`).value);
	const hatId = window.currentHats[placement];
	const hatInfo = window.data[hatId];

	const imageIds = hatInfo.g.split(",");
	const tintGfx = hatInfo.layers?.find((layer) => layer.isTintable)?.gfx.split(",");
	const nonTintGfx = hatInfo.layers?.find((layer) => !layer.isTintable)?.gfx.split(",");
	if (tintGfx && nonTintGfx) {
		var length = Math.min(tintGfx.length, nonTintGfx.length, imageIds.length);
		var doneCombos = new Set();
		for (let i = 0; i < length; i++) {
			var combo = `${nonTintGfx[i]},${tintGfx[i]}`;
			if (doneCombos.has(combo)) {
				continue;
			}

			const src = await recolorHat(tintGfx[i], nonTintGfx[i], tintColor);
			window.tintedSrcs[imageIds[i]] = src;

			doneCombos.add(combo);
		}

		updateTint(placement, hatId, nonTintGfx);
	}
}

export async function recolorHat(tintGf, nonTintGf, tintColor) {
	const [nonTintImg, tintImg] = await Promise.all([
		path.loadImage(path.getTintGraphic(nonTintGf)),
		path.loadImage(path.getTintGraphic(tintGf)),
	]);

	const { canvas, ctx, imageData: nonTintImageData } = getImageData(nonTintImg);
	const { imageData: tintImageData } = getImageData(tintImg);

	tintImageDataArray(nonTintImageData.data, tintImageData.data, tintColor);

	ctx.putImageData(nonTintImageData, 0, 0);
	return canvas.toDataURL();
}

function getImageData(img) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0);

	return {
		canvas,
		ctx,
		imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
	};
}

function tintImageDataArray(nonTintDataArray, tintDataArray, tintColor) {
	const colorArray = [tintColor.r, tintColor.g, tintColor.b];

	for (let i = 0; i < nonTintDataArray.length; i += 4) {
		const nonTintedPixel = nonTintDataArray.subarray(i, i + 4);
		const tintedPixel = tintDataArray.subarray(i, i + 4);

		if (!isColor(tintedPixel, constant.empty)) {
			tintPixel(tintedPixel, colorArray);
			exchangePixel(nonTintedPixel, tintedPixel);
		}
	}
}

function tintPixel(tintedPixel, tintArray) {
	for (let i = 0; i < 3; i++) {
		tintedPixel[i] = Math.ceil((tintArray[i] / 255) * tintedPixel[i]);
	}
}

function exchangePixel(nonTintPixel, tintPixel) {
	for (let i = 0; i < nonTintPixel.length; i++) {
		nonTintPixel[i] = tintPixel[i];
	}
}

export function removeTint(placement) {
	const hatId = window.currentHats[placement];
	const hatInfo = window.data[hatId];
	const imageIds = [...new Set(hatInfo.g.split(","))];
	if (imageIds) {
		for (let i = 0; i < imageIds.length; i++) {
			delete window.tintedSrcs[imageIds[i]];
		}

		updateTint(placement, hatId, imageIds);
	}
}

function updateTint(placement, hatId, nonTintGfx) {
	hatLogic.changeHatImage(placement);

	// Update list image as well
	const listImage = document.getElementById(`${hatId}-${id.image}`);
	listImage.src = path.getHatImage(nonTintGfx[0]);
}
