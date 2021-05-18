exports.loadGeneral = function() {
	var shFile = JSON.parse(fs.readFileSync(filePath + path.sep + ".stonehenge", "utf8", function(err) {
		if (err) {
			console.log("AN ERROR OCCURRED WHILE TRYING TO OPEN .stonehenge:", err);
		}
	}));

	pack = shFile;

	let divPackName = document.createElement("div");
	let divPackDescription = document.createElement("div");
	let divPackIcon = document.createElement("div");

	divPackName.style.marginTop = "5px";
	divPackDescription.style.marginTop = "5px";
	divPackIcon.style.marginTop = "5px";

	divPackIcon.style.height = "200px";

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
	let packIcon = document.createElement("img");

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

	if (fs.existsSync(packPath + path.sep + "pack.png")) {
		packIcon.src = packPath + path.sep + "pack.png";
	} else {
		packIcon.src = rootDir + path.sep + "assets" + path.sep + "emptypackpng.png";
	}

	packName.name = "pack-name";
	packDescription.name = "pack-description";
	packIcon.name = "pack-icon";

	packName.classList.add("general-input");
	packDescription.classList.add("general-input");
	packIcon.id = "pack-icon-image";
	packIconLabel.style.height = "200px";
	packIconLabel.style.marginTop = "30px";

	divPackIcon.style.display = "flex";
	divPackIcon.style.marginTop = "20px";
	divPackIcon.style.paddingTop = "10px";
	divPackIcon.style.paddingBottom = "10px";


	divPackName.appendChild(packNameLabel);
	divPackName.appendChild(packName);

	divPackDescription.appendChild(packDescriptionLabel);
	divPackDescription.appendChild(packDescription);

	divPackIcon.appendChild(packIconLabel);
	divPackIcon.appendChild(packIcon);

	content.appendChild(divPackName);
	content.appendChild(packFilename);
	content.appendChild(divPackDescription);
	content.appendChild(divPackIcon);
}
