exports.loadSelectors = function() {
	let cs = document.getElementById("content-selectors");
	cs.innerHTML = "";

	let boxes = [windowEnum.GENERAL, windowEnum.TEXTURES, windowEnum.ITEMS, windowEnum.SOUNDS, windowEnum.EXTRAS, windowEnum.EXPORT];
	for (var i in boxes) {
		let selection = boxes[i];

		let selectionBox = document.createElement("p");
		selectionBox.innerHTML = translate(selection);
		selectionBox.classList.add("single-content-selector");

		// If selected
		if (viewWindow === selection) {
			selectionBox.style.backgroundColor = "#eee";
		}

		// If first element
		if (i == 0) {
			selectionBox.style.borderTopLeftRadius = "5px";
		}

		// If last element
		if (i == boxes.length - 1) {
			selectionBox.style.borderTopRightRadius = "5px";
		}

		selectionBox.addEventListener("click", function() {
			viewWindow = selection;
			loadSelectors();
			loadContent();
		});

		// Add to parent
		cs.appendChild(selectionBox);
	}
}
