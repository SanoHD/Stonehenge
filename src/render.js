const spawn = require("child_process").execSync;
const dialog = require("electron").remote.dialog;
const dirTree = require("directory-tree");
const getFolderSize = require("fast-folder-size");
const fs = require("fs");
const fsx = require("fs-extra");
const path = require("path");



var config = JSON.parse(fs.readFileSync("config.json", "utf8", function(err) {
	if (err) {
		console.log("AN ERROR OCCURRED WHILE TRYING TO OPEN en_us.json:", err);
	}
}));

var pack = {};
var viewWindow = "Welcome";
var packPath = null;
var openedTexture = null;
var filePath;
var template;
var content;
var language = config["language"];
var languageStrings = fsx.readJSONSync("language.json");

var langFile = JSON.parse(fs.readFileSync("src\\en_us.json", "utf8", function(err) {
	if (err) {
		console.log("AN ERROR OCCURRED WHILE TRYING TO OPEN en_us.json:", err);
	}
}));

if (langFile === undefined) {
	langFile = {};
}



window.addEventListener("resize", function() {
	if (viewWindow == "Textures") {
		document.getElementById("textures").style.height = (window.innerHeight - 100) + "px";
	}
});

function translate(val) {
	let translation;

	translation = languageStrings[val][language];

	if (translation === undefined) {
		translation = languageStrings[val]["en"];
	}

	return translation;
}

document.getElementById("welcome-title").innerHTML = translate("welcome_title");

function toggleTextureSidebar(event, type, texturePath) {
	let ts = document.getElementById("texture-sidebar");
	let et = event.target;

	if (et.tagName != "DIV") {
		et = et.parentNode;
	}

	let open = null;

	if (openedTexture == et) {
		open = 0;

	} else {
		openedTexture = et;

		if (type === undefined) {
			open = ts.style.display == "block" ? 0 : 1;
		} else {
			open = type;
		}
	}

	// Reset select-color of all textures available
	for (var t of document.getElementsByClassName("texture")) {
		t.style.backgroundColor = "#fff";
	}

	if (open) {
		// Select-color clicked texture
		openedTexture.style.backgroundColor = "#b0ecfd";

		// Open sidebar
		ts.classList.remove("texture-sidebar-animation-close");
		ts.classList.add("texture-sidebar-animation-open");
		ts.style.display = "block";
		document.getElementById("textures").style.width = "70%";
		loadSidebarContent(texturePath);

	} else {
		openedTexture = null;

		// Close sidebar
		ts.classList.remove("texture-sidebar-animation-open");
		ts.classList.add("texture-sidebar-animation-close");
		document.getElementById("textures").style.width = "100%";

		setTimeout(function() {
			ts.style.display = "none";
		}, 400);
	}
}

function loadSidebarContent(texturePath) {
	let ts = document.getElementById("texture-sidebar");
	ts.innerHTML = "";

	textureNameNoExtension = texturePath.slice(0, -4);

	let title = document.createElement("h1");
	title.id = "sidebar-texture-title";

	if ("block.minecraft." + path.basename(textureNameNoExtension) in langFile) {
		title.innerHTML = langFile["block.minecraft." + path.basename(textureNameNoExtension)];
	} else {
		title.innerHTML = path.basename(texturePath);
	}


	let image = document.createElement("img");
	image.id = "sidebar-texture-image";
	image.src = texturePath;


	let editButton = document.createElement("button");
	editButton.classList.add("sidebar-button");
	editButton.innerHTML = "Edit";
	editButton.addEventListener("click", function() {
		let cmd = config["editors"]["texture"].replace("%s", "\"" + texturePath.replaceAll("/", "\\") + "\"");
		let shell = spawn(cmd);
	});

	let replaceButton = document.createElement("button");
	replaceButton.classList.add("sidebar-button");
	replaceButton.innerHTML = "Replace";
	replaceButton.addEventListener("click", function() {
	});


	ts.appendChild(title);
	ts.appendChild(image);
	ts.appendChild(editButton);
	ts.appendChild(replaceButton);
}

function loadFiles(dirName=packPath) {
	let files = dirTree(dirName + "/assets/minecraft/textures/block");
	return files;
}

function loadSelectors() {
	let cs = document.getElementById("content-selectors");
	cs.innerHTML = "";

	let boxes = ["General", "Textures", "Items", "Sounds", "Extras"];
	for (var i in boxes) {
		let selection = boxes[i];

		let selectionBox = document.createElement("p");
		selectionBox.innerHTML = selection;
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

		selectionBox.onclick = function() {
			viewWindow = selection;
			loadSelectors();
			loadContent();
		}

		// Add to parent
		cs.appendChild(selectionBox);
	}
}

function loadTextures() {
	let content = document.getElementById("content-container");
	content.innerHTML = "";

	let textureContainer = document.createElement("div");
	textureContainer.innerHTML = "";
	textureContainer.id = "textures";
	textureContainer.style.height = (window.innerHeight - 100) + "px";

	/*
	textureContainer.onscroll = function() {
		let scrollPercent = textureContainer.scrollTop / (textureContainer.scrollHeight - textureContainer.clientHeight);
		if (scrollPercent > 0.7) {
			loadTextures(min + 25, max + 25);
		} else if (scrollPercent < 0.3 && scrollPercent > 0 && min >= 25) {
			loadTextures(min - 25, max - 25);
		}
	}
	*/

	let textureFiles = loadFiles(packPath)["children"];

	textureFiles.forEach((texture, i) => {
		texture = texture["path"].replaceAll("\\", "/");

		// Just use .png files
		if (!texture.endsWith(".png")) {
			return;  // Like 'continue' in this case
		}

		let singleTextureContainer = document.createElement("div");
		singleTextureContainer.classList.add("texture");

		// Add fade-in animation for the first 50 textures
		if (i <= 50) {
			singleTextureContainer.style.animationDelay = (i * 15) + "ms";
		}

		singleTextureContainer.addEventListener("click", function(event) {
			// Open sidebar
			toggleTextureSidebar(event, 1, texture);
		});

		// Image of texture
		let singleTextureImage = document.createElement("img");
		singleTextureImage.classList.add("texture-image");
		singleTextureImage.src = texture;

		// Title of texture
		let singleTextureTitle = document.createElement("p");
		singleTextureTitle.classList.add("texture-title");
		singleTextureTitle.innerHTML = path.basename(texture);
		singleTextureTitle.title = texture;

		// Add image and title to parent
		singleTextureContainer.appendChild(singleTextureImage);
		singleTextureContainer.appendChild(singleTextureTitle);

		// Add container to all textures
		textureContainer.appendChild(singleTextureContainer);
	});

	// Add container to content
	content.appendChild(textureContainer);
}

function toFilename(value, raw=false) {
	let newFileName = "";
	for (var char of value.split("")) {
		if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_".includes(char)) {
			newFileName += char;
		} else {
			newFileName += "_";
		}
	}

	if (raw) {
		return newFileName;
	} else {
		return "(Will be exported as " + newFileName + ".zip)";
	}
}

function generalChange(object, value) {
	switch (object) {
		case "name":
			pack["name"] = value;

			let packFilename = document.getElementById("pack-filename");
			packFilename.innerHTML = toFilename(value);
			break;

		case "description":
			pack["description"] = value;
			break;

	}
}

function generalSaveChange(object, value) {
	switch (object) {
		case "name":
			pack["name"] = value;
			newPackPath = path.parse(packPath)["dir"] + path.sep + toFilename(value, raw=true);
			fsx.renameSync(packPath, newPackPath);
			packPath = newPackPath;

			break;

		case "description":
			let description = value;
			pack["description"] = description;

			mcMetaFile = fs.readFileSync(packPath + path.sep + "pack.mcmeta", "utf8");
			mcMeta = JSON.parse(mcMetaFile);
			mcMeta["pack"]["description"] = description;

			mcMetaFileString = JSON.stringify(mcMeta, null, 2);
			fs.writeFileSync(packPath + path.sep + "pack.mcmeta", mcMetaFileString);

			break;
	}
}

function loadGeneral() {
	let packNameLabel = document.createElement("label");
	let packDescriptionLabel = document.createElement("label");
	let packIconLabel = document.createElement("label");

	let packFilename = document.createElement("p");
	packFilename.id = "pack-filename";
	packFilename.value = toFilename(pack["name"]);

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

function loadContent() {
	content = document.getElementById("content-container");
	content.innerHTML = "";

	// Add title
	let title = document.createElement("h1");
	title.id = "title";
	content.appendChild(title);

	switch (viewWindow) {
		case "General":
			title.innerHTML = translate("window_general");
			loadGeneral();
			break;

		case "Textures":
			title.innerHTML = translate("window_textures");
			loadTextures();
			break;

		case "Items":
			title.innerHTML = translate("window_items");
			break;

		case "Sounds":
			title.innerHTML = translate("window_sounds");
			break;

		case "Extras":
			title.innerHTML = translate("window_extras");
			break;

		case "Export":
			title.innerHTML = translate("window_export");
			break;

		default:
			title.innerHTML = translate("window_invalid");
	}
}

function loadWindow() {
	document.getElementById("window-welcome").style.display = "none";
	document.getElementById("window-loading").style.display = "none";
	document.getElementById("window-workspace").style.display = "none";

	if (viewWindow == "Welcome") {
		document.getElementById("window-welcome").style.display = "inherit";

		let welcomeNewButton = document.getElementById("welcome-choose-new");
		welcomeNewButton.addEventListener("click", function() {
			filePath = dialog.showOpenDialogSync({
				title: translate("newpackpath"),
				properties: ["openDirectory"],
				defaultPath: "C:\\Users\\jonas\\Desktop\\Ordner\\ProgrammierZeug\\Electron\\Stonehenge\\projects"
			})[0];

			if (filePath === undefined) {
				loadWindow();
				pack = {};

			} else {
				filePath = filePath + "\\my-resource-pack";
				pack = {
					"name": "my-resource-pack",
					"description": "Enter a description here!",
					"version": ""
				};

				template = dialog.showOpenDialogSync({
					title: translate("opentemplatepath"),
					properties: ["openDirectory"],
					defaultPath: "C:\\Users\\jonas\\Desktop\\Ordner\\ProgrammierZeug\\Electron\\Stonehenge\\templates\\Default-Texture-Pack-1.16.x"
				})[0];

				packPath = filePath;

				fsx.copy(template, filePath).then(function() {
					viewWindow = "General";
					clearInterval(loadingEllipsisInterval);
					clearInterval(loadingPercentInterval);
					loadWindow();
				});

				viewWindow = "Loading";
				loadWindow();
			}
		});


		let welcomeEditButton = document.getElementById("welcome-choose-edit");
		welcomeEditButton.addEventListener("click", function() {
			filePath = dialog.showOpenDialogSync({
				title: translate("openpackpath"),
				properties: ["openDirectory"],
				defaultPath: "C:\\Users\\jonas\\Desktop\\Ordner\\ProgrammierZeug\\Electron\\Stonehenge\\projects"
			});

			if (filePath === undefined) {
				viewWindow = "Welcome";
				loadWindow();
				pack = {};

			} else {
				filePath = filePath[0];
				mcMetaFile = fs.readFileSync(filePath + path.sep + "pack.mcmeta", "utf8");
				mcMeta = JSON.parse(mcMetaFile);

				pack = {
					"name": path.basename(filePath),
					"description": mcMeta["pack"]["description"],
					"version": ""
				};

				packPath = filePath;
				viewWindow = "General";

				loadWindow();
			}
		});

	} else if (viewWindow == "Loading") {
		document.getElementById("window-loading").style.display = "inherit";

		let ellipsis = ".";

		let wl = document.getElementById("window-loading");
		wl.innerHTML = "";

		let text = document.createElement("p");
		text.id = "loading-text";
		text.innerHTML = "We are preparing everything.";

		let subText = document.createElement("p");
		subText.id = "loading-subtext";
		subText.innerHTML = "0%";

		wl.appendChild(text);
		wl.appendChild(subText);

		loadingEllipsisInterval = setInterval(function () {
			text.innerHTML = "We are preparing everything" + ellipsis;
			switch (ellipsis) {
				case ".":
					ellipsis = "..";
					break;

				case "..":
					ellipsis = "...";
					break;

				default:
					ellipsis = "."
			}
		}, 500);



		var p1;
		var p2;
		loadingPercentInterval = setInterval(function () {
			getFolderSize(filePath, function(err, bytes) {
				if (err) {
					console.error(err);
				}

				p1 = bytes;
			});


			getFolderSize(template, function(err, bytes) {
				if (err) {
					console.error(err);
				}

				p2 = bytes;
			});

			let percent = p1 / p2 * 100;
			if (isNaN(percent)) {
				subText.innerHTML = "0%";
			} else {
				subText.innerHTML = Math.floor(percent) + "%";
			}

		}, 1000);

	} else {
		document.getElementById("window-workspace").style.display = "inherit";

		loadSelectors();
		loadContent();
	}
}

loadWindow();
