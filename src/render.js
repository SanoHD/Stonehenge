const spawn = require("child_process").execSync;
const dialog = require("electron").remote.dialog;
const dirTree = require("directory-tree");
//const getFolderSize = require("fast-folder-size");
const fs = require("fs");
const fsx = require("fs-extra");
const path = require("path");


const windowEnum = {
	WELCOME: "WELCOME",
	GENERAL: "GENERAL",
	TEXTURES: "TEXTURES",
	ITEMS: "ITEMS",
	SOUNDS: "SOUNDS",
	EXTRAS: "EXTRAS",
	EXPORT: "EXPORT"
};


var config = JSON.parse(fs.readFileSync("config.json", "utf8", function(err) {
	if (err) {
		console.log("AN ERROR OCCURRED WHILE TRYING TO OPEN config.json:", err);
	}
}));

var shFile;

var pack = {};
var viewWindow = windowEnum.WELCOME;

var packPath = null;
var openedTexture = null;
var loadedTextureFiles = [];
var onlyShowLoadedTextures = false;

var filePath;
var templatePath;
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
	if (viewWindow == windowEnum.TEXTURES) {
		document.getElementById("textures").style.height = (window.innerHeight - 100) + "px";
	}
});

function translate(val) {
	if (val in windowEnum) {
		val = {
			GENERAL: "window_general",
			TEXTURES: "window_textures",
			ITEMS: "window_items",
			SOUNDS: "window_sounds",
			EXTRAS: "window_extras",
			EXPORT: "window_export"
		}[val];
	}

	let translation;

	translation = languageStrings[val][language];

	if (translation === undefined) {
		translation = languageStrings[val]["en"];
	}

	return translation;
}

document.getElementById("welcome-title").innerHTML = translate("welcome_title");

let textCreate = document.getElementsByClassName("welcome-choose-text")[0];
let textEdit = document.getElementsByClassName("welcome-choose-text")[1];
textCreate.innerHTML = translate("welcome_create");
textEdit.innerHTML = translate("welcome_edit");
textCreate.innerHTML = textCreate.innerHTML.replace("{ICON}", "<span class=\"welcome-choose-text-color\">➕</span>")
textEdit.innerHTML = textEdit.innerHTML.replace("{ICON}", "<span class=\"welcome-choose-text-color\">✒</span>")

let smallTextCreate = document.getElementsByClassName("welcome-choose-text-small")[0];
let smallTextEdit = document.getElementsByClassName("welcome-choose-text-small")[1];
smallTextCreate.innerHTML = translate("welcome_create_small");
smallTextEdit.innerHTML = translate("welcome_edit_small");



function checkTextureLoaded(textureElement) {
	let src_ = textureElement.getElementsByTagName("p")[0].title;
	return loadedTextureFiles.includes(path.basename(src_));
}

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
		if (checkTextureLoaded(t)) {
			t.style.backgroundColor = "#fff";
		} else {
			t.getElementsByClassName("texture-loaded-text")[0].style.color = "#ddd";
		}
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

	let replaceButton = document.createElement("button");
	replaceButton.classList.add("sidebar-button");
	replaceButton.innerHTML = "Replace";

	let loadButton = document.createElement("button");
	loadButton.classList.add("sidebar-button");
	loadButton.innerHTML = "Load";
	if (loadedTextureFiles.includes(path.basename(texturePath))) {
		// Texture is loaded
		loadButton.style.backgroundColor = "#ddd";
		loadButton.style.cursor = "not-allowed";
		loadButton.innerHTML = "Loaded";

		editButton.addEventListener("click", function() {
			let cmd = config["editors"]["texture"].replace("%s", "\"" + texturePath.replaceAll("/", "\\") + "\"");
			let shell = spawn(cmd);
		});

		replaceButton.addEventListener("click", function() {
		});
	} else {
		// Texture is not loaded
		for (var button of [editButton, replaceButton]) {
			button.style.backgroundColor = "#ddd";
			button.style.cursor = "not-allowed";
		}

		loadButton.addEventListener("click", function() {
			let blockName = path.basename(texturePath);
			let oldBlockPath = texturePath;
			let newBlockPath = packPath + "/assets/minecraft/textures/block/".replaceAll("/", path.sep) + blockName;

			loadedTextureFiles.push(blockName);


			for (var t of document.getElementById("textures").getElementsByTagName("div")) {
				if (checkTextureLoaded(t)) {
					t.getElementsByClassName("texture-loaded-text")[0].style.color = "#3bbf65";
				} else {
					t.getElementsByClassName("texture-loaded-text")[0].style.color = "#ddd";
				}
			}

			console.log(oldBlockPath, "  --->  ", newBlockPath);

			fsx.copySync(oldBlockPath, newBlockPath);

			if (onlyShowLoadedTextures) {
				loadTextures();
			}

			loadSidebarContent(texturePath);
		});
	}

	ts.appendChild(title);
	ts.appendChild(image);
	ts.appendChild(loadButton);
	ts.appendChild(editButton);
	ts.appendChild(replaceButton);
}

function loadFiles(dirName) {
	let files = dirTree(dirName + "/assets/minecraft/textures/block");
	return files;
}

function loadSelectors() {
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
	// Remove sidebar
	let sb = document.getElementById("texture-sidebar");
	sb.innerHTML = "";
	sb.style.display = "none";

	content = document.getElementById("content-container");
	content.innerHTML = "";

	let textureContainer = document.createElement("div");
	textureContainer.innerHTML = "";
	textureContainer.id = "textures";
	textureContainer.style.height = (window.innerHeight - 100) + "px";

	let onlyShowLoadedTexturesSelector = document.createElement("select");
	let optionYes = document.createElement("option");
	optionYes.innerHTML = translate("textureonlyshowloaded_yes");
	optionYes.value = "yes";

	let optionNo = document.createElement("option");
	optionNo.innerHTML = translate("textureonlyshowloaded_no");
	optionNo.value = "no";

	onlyShowLoadedTexturesSelector.appendChild(optionYes);
	onlyShowLoadedTexturesSelector.appendChild(optionNo);

	onlyShowLoadedTexturesSelector.addEventListener("input", function(event) {
		if (event.target.value == "yes") {
			onlyShowLoadedTextures = true;
		} else {
			onlyShowLoadedTextures = false;
		}

		loadTextures();
	})

	if (onlyShowLoadedTextures) {
		onlyShowLoadedTexturesSelector.value = "yes";
	} else {
		onlyShowLoadedTexturesSelector.value = "no";
	}

	content.appendChild(onlyShowLoadedTexturesSelector);


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
	console.log("Template from:", pack["template"]);
	let textureFiles = loadFiles(pack["template"])["children"];

	textureFiles.forEach((texture, i) => {
		texture = texture["path"].replaceAll("\\", "/");

		// Just use .png files
		if (!texture.endsWith(".png")) {
			return;  // Like 'continue' in this case
		}

		let singleTextureContainer = document.createElement("div");
		singleTextureContainer.classList.add("texture");

		let singleTextureLoadedText = document.createElement("p");
		singleTextureLoadedText.classList.add("texture-loaded-text");
		singleTextureLoadedText.innerHTML = "Loaded";

		if (!loadedTextureFiles.includes(path.basename(texture))) {
			if (onlyShowLoadedTextures) {
				console.log("THIS ONE IS NOT LOADED");
				return;
			}
			singleTextureLoadedText.style.color = "#ddd";
		}

		// Add fade-in animation for the first 100 textures
		if (i <= 100) {
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
		singleTextureContainer.appendChild(singleTextureLoadedText);

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

function updateSHFile() {
	let shContent = JSON.stringify(pack, null, 2);

	fs.writeFileSync(filePath + path.sep + ".stonehenge", shContent);
}

function generalChange(object, value) {
	switch (object) {
		case "name":
			pack["name"] = value;

			let packFilename = document.getElementById("pack-filename");
			packFilename.innerHTML = toFilename(value);

			filePath = path.dirname(filePath) + path.sep + toFilename(value, raw=true);

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

			updateSHFile();

			break;

		case "description":
			pack["description"] = value;

			mcMetaFile = fs.readFileSync(packPath + path.sep + "pack.mcmeta", "utf8");
			mcMeta = JSON.parse(mcMetaFile);
			mcMeta["pack"]["description"] = pack["description"];

			mcMetaFileString = JSON.stringify(mcMeta, null, 2);
			fs.writeFileSync(packPath + path.sep + "pack.mcmeta", mcMetaFileString);

			updateSHFile();

			break;
	}
}

function loadGeneral() {
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

function loadContent() {
	content = document.getElementById("content-container");
	content.innerHTML = "";

	// Add title
	let title = document.createElement("h1");
	title.id = "title";
	content.appendChild(title);

	switch (viewWindow) {
		case windowEnum.GENERAL:
			title.innerHTML = translate("window_general");
			loadGeneral();
			break;

		case windowEnum.TEXTURES:
			title.innerHTML = translate("window_textures");
			loadTextures();
			break;

		case windowEnum.ITEMS:
			title.innerHTML = translate("window_items");
			break;

		case windowEnum.SOUNDS:
			title.innerHTML = translate("window_sounds");
			break;

		case windowEnum.EXTRAS:
			title.innerHTML = translate("window_extras");
			break;

		case windowEnum.EXPORT:
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

	if (viewWindow == windowEnum.WELCOME) {
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

				template = dialog.showOpenDialogSync({
					title: translate("opentemplatepath"),
					properties: ["openDirectory"],
					defaultPath: "C:\\Users\\jonas\\Desktop\\Ordner\\ProgrammierZeug\\Electron\\Stonehenge\\templates\\Default-Texture-Pack-1.16.x"
				})[0];

				pack = {
					name: "my-resource-pack",
					description: "Enter a description here!",
					version: "",
					template: template
				};

				fsx.mkdirSync(filePath);
				fsx.mkdirsSync(filePath + "/assets/minecraft/textures/block".replaceAll("/", path.sep));

				updateSHFile();

				fsx.copySync(template + path.sep + "pack.mcmeta", filePath + path.sep + "pack.mcmeta");

				templatePath = template;
				packPath = filePath;

				viewWindow = windowEnum.GENERAL;
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
				viewWindow = windowEnum.WELCOME;
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

				var shFile = JSON.parse(fs.readFileSync(filePath + path.sep + ".stonehenge", "utf8", function(err) {
					if (err) {
						console.log("AN ERROR OCCURRED WHILE TRYING TO OPEN .stonehenge:", err);
					}
				}));

				packPath = filePath;
				templatePath = pack["template"];
				viewWindow = windowEnum.GENERAL;

				loadedTextureFiles = []
				let _loadedTextureFiles = loadFiles(packPath)["children"];
				for (var tf of _loadedTextureFiles) {
					loadedTextureFiles.push(tf["name"]);
				}

				loadWindow();
			}
		});

	} else {
		document.getElementById("window-workspace").style.display = "inherit";

		loadSelectors();
		loadContent();
	}
}

loadWindow();
