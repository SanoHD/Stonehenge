exports.loadSidebarContent = function(texturePath) {
	let ts = document.getElementById("texture-sidebar");
	// Clear content first
	ts.innerHTML = "";

	textureNameNoExtension = texturePath.slice(0, -4);

	let title = document.createElement("h1");
	title.id = "sidebar-texture-title";

	// The name of the block displayed above the texture in the sidebar
	// Create name with filenameToBlockName()
	title.innerHTML = filenameToBlockName(path.basename(textureNameNoExtension));

	// Add the image
	let image = document.createElement("img");
	image.id = "sidebar-texture-image";
	image.src = texturePath;

	// Add the 'edit' button
	let editButton = document.createElement("button");
	editButton.classList.add("sidebar-button");
	editButton.innerHTML = "Edit";

	// Add the 'replace' button
	let replaceButton = document.createElement("button");
	replaceButton.classList.add("sidebar-button");
	replaceButton.innerHTML = "Replace";

	// Add the 'load' button
	let loadButton = document.createElement("button");
	loadButton.classList.add("sidebar-button");
	loadButton.innerHTML = "Load";
	if (loadedTextureFiles.includes(path.basename(texturePath))) {
		// Texture is loaded
		loadButton.style.backgroundColor = "#ddd";
		loadButton.style.cursor = "not-allowed";
		loadButton.innerHTML = "Loaded";

		let imgPath = packPath + "/assets/minecraft/textures/block/".replaceAll("/", path.sep) + path.basename(texturePath);

		editButton.addEventListener("click", function() {
			let cmd = config["editors"]["texture"].replace("%s", "\"" + imgPath + "\"");
			let shell = spawn(cmd);
			loadTextureFiles();
			loadTextures();
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

			loading.loadSidebarContent(texturePath);
		});
	}

	ts.appendChild(title);
	ts.appendChild(image);
	ts.appendChild(loadButton);
	ts.appendChild(editButton);
	ts.appendChild(replaceButton);
}

exports.toggleTextureSidebar = function(event, type, texturePath) {
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
