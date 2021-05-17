exports.loadGeneral = function() {
	var shFile = JSON.parse(fs.readFileSync(filePath + path.sep + ".stonehenge", "utf8", function(err) {
		if (err) {
			console.log("AN ERROR OCCURRED WHILE TRYING TO OPEN .stonehenge:", err);
		}
	}));

	pack = shFile;


	let packNameLabel = document.createElement("label");
	let packDescriptionLabel = document.createElement("label");
	let packIconLabel = document.createElement("label");

	let packFilename = document.createElement("p");
	packFilename.id = "pack-filename";
	packFilename.value = pack["name"];

	packNameLabel.classList.add("general-input-label");
	packDescriptionLabel.classList.add("general-input-label");
	packIconLabel.classList.add("general-input-label");

	packNameLabel.innerHTML = "Name";
	packDescriptionLabel.innerHTML = "Description";
	packIconLabel.innerHTML = "Icon (pack.png)";

	packNameLabel.setAttribute("for", "pack-name");
	packDescriptionLabel.setAttribute("for", "pack-description");
	packIconLabel.setAttribute("for", "pack-icon");

	let packName = document.createElement("input");
	let packDescription = document.createElement("input");
	let packIcon = document.createElement("input");

	packName.value = pack["name"];
	packDescription.value = pack["description"];

	packName.addEventListener("input", function(event) {
		generalChange("name", event.target.value);
	});

	packName.addEventListener("change", function(event) {
		generalSaveChange("name", event.target.value);
	});

	packDescription.addEventListener("change", function(event) {
		generalChange("description", event.target.value);
		generalSaveChange("description", event.target.value);
	});

	packName.name = "pack-name";
	packDescription.name = "pack-description";
	packIcon.name = "pack-icon";

	packName.classList.add("general-input");
	packDescription.classList.add("general-input");
	packIcon.classList.add("general-input-image");

	content.appendChild(packNameLabel);
	content.appendChild(packName);

	content.appendChild(packFilename);

	content.appendChild(packDescriptionLabel);
	content.appendChild(packDescription);

	//content.appendChild(packIconLabel);
	//content.appendChild(packIcon);
}
