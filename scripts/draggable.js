import * as constant from "./constant.js";
import * as id from "./id.js";

// spring settings
const k = 1;
const e = 0.75;

const timer = 1000 / 33;

export function makeDragAble(offset) {
	let isDragging = false;
	let inRest = true;
	let intervalId;
	let offset_ani_x, offset_ani_y;

	const draggable = document.getElementById(id.animal);
	const hatOrder = [id.head, id.belly, id.mouth];
	const weigths = [1, 2, 0.5];
	const hats = hatOrder.map((placement) => document.getElementById(placement));

	draggable.addEventListener("mousedown", (event) => {
		document.getElementById(id.resetPosition).hidden = false;

		event.preventDefault();
		isDragging = true;
		draggable.style.cursor = "grabbing";

		offset_ani_x = event.clientX - draggable.offsetLeft;
		offset_ani_y = event.clientY - draggable.offsetTop;

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	});

	function onMouseMove(event) {
		if (isDragging) {
			draggable.style.left = event.clientX - offset_ani_x + "px";
			draggable.style.top = event.clientY - offset_ani_y + "px";

			if (inRest) {
				inRest = false;
				move();
			}
		}
	}

	function onMouseUp() {
		const [ref_x, ref_y] = constant.baseCoorDict[window.animal];
		offset.x = draggable.offsetLeft - ref_x;
		offset.y = draggable.offsetTop - ref_y;
		isDragging = false;
		draggable.style.cursor = "grab";

		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	}

	function move() {
		const velocities = hatOrder.map(() => [0, 0]);

		intervalId = setInterval(() => {
			let inRestCount = 0;

			hats.forEach((hat, i) => {
				const hatPlacement = hatOrder[i];
				const displacement = getDisplacement(hat, hatPlacement, draggable);

				if (displacement === null) {
					inRestCount++;
					return;
				}

				let m = weigths[i];
				let [v_x, v_y] = [
					newVelocity(velocities[i][0], displacement[0], m),
					newVelocity(velocities[i][1], displacement[1], m),
				];
				velocities[i] = [v_x, v_y];
				if (standingStill(displacement, v_x, v_y)) {
					inRestCount++;
					return;
				}

				hat.style.left = hat.offsetLeft + v_x + "px";
				hat.style.top = hat.offsetTop + v_y + "px";
			});

			if (inRestCount == hatOrder.length) {
				clearInterval(intervalId);
				console.log("stop");
				inRest = true;
			}
		}, timer);
	}
}

function getDisplacement(hat, hatPlacement, draggable) {
	const hatId = window.currentHats[hatPlacement];
	if (hatId == 0) {
		return null;
	}
	const hatInfo = window.data[hatId];

	const [body_x, body_y] = constant.bodyCoorDicts[hatPlacement][window.animal];
	let [hat_x, hat_y] = [hatInfo["x"], hatInfo["y"]];
	const shape = hatInfo[id.shapePositions][window.animal];
	// what about (0, 0)?
	if (shape?.x || shape?.y) {
		hat_x = shape?.x;
		hat_y = shape?.y;
	}

	const cPos = window.customPositions[hatPlacement];
	let delta_x = hat.offsetLeft - body_x - hat_x - cPos.x - draggable.offsetLeft;
	let delta_y = hat.offsetTop - body_y - hat_y - cPos.y - draggable.offsetTop;

	return [delta_x, delta_y];
}

function newVelocity(v_i, delta_d, m) {
	let v_f = (v_i - (k * delta_d) / m) * e;
	if (Math.abs(delta_d) <= 2 && Math.abs(v_f) < 3) {
		v_f = -delta_d;
	}
	return v_f;
}

function standingStill(displacement, v_x, v_y) {
	return [displacement[0], displacement[1], v_x, v_y].every((v) => v === 0);
}
