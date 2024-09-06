export function makeDragAble(offset) {
	let isDragging = false;

	let offset_ani_x, offset_ani_y;
	const hatOffSets = [];

	const draggable = document.getElementById("animal");
	const hats = [
		document.getElementById("head"),
		document.getElementById("belly"),
		document.getElementById("mouth"),
	];

	draggable.addEventListener("mousedown", (event) => {
		document.getElementById("reset-position").hidden = false;

		event.preventDefault();
		isDragging = true;
		draggable.style.cursor = "grabbing";

		offset_ani_x = event.clientX - draggable.offsetLeft;
		offset_ani_y = event.clientY - draggable.offsetTop;
		hats.forEach((hat, i) => {
			hatOffSets[i] = [
				event.clientX - hat.offsetLeft,
				event.clientY - hat.offsetTop,
			];
		});

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	});

	function onMouseMove(event) {
		if (isDragging) {
			// TODO: add springy effect
			draggable.style.left = event.clientX - offset_ani_x + "px";
			draggable.style.top = event.clientY - offset_ani_y + "px";
			hats.forEach((hat, i) => {
				hat.style.left = event.clientX - hatOffSets[i][0] + "px";
				hat.style.top = event.clientY - hatOffSets[i][1] + "px";
			});
		}
	}

	function onMouseUp() {
		offset.x = draggable.offsetLeft - offset.animal_ref_x;
		offset.y = draggable.offsetTop - offset.animal_ref_y;
		isDragging = false;
		draggable.style.cursor = "grab";

		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	}
}
