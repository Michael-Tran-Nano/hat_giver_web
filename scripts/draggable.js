export function makeDragAble(offset) {
	let isDragging = false;
	const draggable = document.getElementById("animal");
	const head = document.getElementById("head");
	const belly = document.getElementById("belly");
	const mouth = document.getElementById("mouth");

	let start_x, start_y;
	let end_x, end_y;
	let offset_ani_x, offset_ani_y;
	let offset_head_x, offset_head_y;
	let offset_belly_x, offset_belly_y;
	let offset_mouth_x, offset_mouth_y;

	draggable.addEventListener("mousedown", (event) => {
		event.preventDefault();
		isDragging = true;
		draggable.style.cursor = "grabbing";

		start_x = event.clientX;
		start_y = event.clientY;
		offset_ani_x = event.clientX - draggable.offsetLeft;
		offset_ani_y = event.clientY - draggable.offsetTop;
		offset_head_x = event.clientX - head.offsetLeft;
		offset_head_y = event.clientY - head.offsetTop;
		offset_belly_x = event.clientX - belly.offsetLeft;
		offset_belly_y = event.clientY - belly.offsetTop;
		offset_mouth_x = event.clientX - mouth.offsetLeft;
		offset_mouth_y = event.clientY - mouth.offsetTop;

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	});

	function onMouseMove(event) {
		if (isDragging) {
			// TODO: add springy effect
			draggable.style.left = event.clientX - offset_ani_x + "px";
			draggable.style.top = event.clientY - offset_ani_y + "px";
			head.style.left = event.clientX - offset_head_x + "px";
			head.style.top = event.clientY - offset_head_y + "px";
			belly.style.left = event.clientX - offset_belly_x + "px";
			belly.style.top = event.clientY - offset_belly_y + "px";
			mouth.style.left = event.clientX - offset_mouth_x + "px";
			mouth.style.top = event.clientY - offset_mouth_y + "px";
			end_x = event.clientX;
			end_y = event.clientY;
		}
	}

	function onMouseUp() {
		// TODO: add reset position button
		offset["x"] += end_x - start_x;
		offset["y"] += end_y - start_y;
		isDragging = false;
		draggable.style.cursor = "grab";

		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	}
}
