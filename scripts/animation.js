import * as path from "./path.js";

export function startImageChange(placement, animationHolder, images, duration) {
	const srcs = images.map(path.getHatImage);

	let currentImageIndex = 0;
	const animalImageElement = document.getElementById(placement);

	animationHolder[placement] = setInterval(() => {
		currentImageIndex = (currentImageIndex + 1) % srcs.length;
		animalImageElement.src = srcs[currentImageIndex];
	}, duration);
}

export function stopImageChange(placement, animationHolder) {
	if (animationHolder[placement]) {
		clearInterval(animationHolder[placement]);
		animationHolder[placement] = null;
	}
}
