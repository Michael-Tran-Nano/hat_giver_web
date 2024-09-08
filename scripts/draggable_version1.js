import * as constant from "./constant.js";
import * as id from "./id.js";

export function makeDragAble(offset) {
	let isDragging = false;

	let offset_ani_x, offset_ani_y;

	let inRest = true;
	let intervalId;

	const draggable = document.getElementById(id.animal);
	const hatOrder = [id.head, id.belly, id.mouth];
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
		intervalId = setInterval(() => {
			let count = 0;
			hats.forEach((hat, i) => {
				const placement = hatOrder[i];
				let x = 0;
				let y = 0;

				const hatId = window.currentHats[placement];
				if (hatId == 0) {
					count++;
					return;
				}
				const hatInfo = window.data[hatId];

				const [body_x, body_y] =
					constant.bodyCoorDicts[placement][window.animal];
				const [hat_x, hat_y] = [hatInfo["x"], hatInfo["y"]];

				let delta_x = body_x + hat_x + draggable.offsetLeft - hat.offsetLeft;
				let delta_y = body_y + hat_y + draggable.offsetTop - hat.offsetTop;

				if (delta_x != 0) {
					x = delta_x / 10;
					x = Math.abs(x) < 1 ? (x > 0 ? 1 : -1) : x;
				}
				if (delta_y != 0) {
					y = delta_y / 10;
					y = Math.abs(y) < 1 ? (y > 0 ? 1 : -1) : y;
				}

				if (delta_x == 0 && delta_y == 0) {
					count++;
					return;
				}

				hat.style.left = hat.offsetLeft + x + "px";
				hat.style.top = hat.offsetTop + y + "px";
			});
			if (count == hatOrder.length) {
				clearInterval(intervalId);
				console.log("stop");
				inRest = true;
			}
		}, 1000 / 33);
	}
}
