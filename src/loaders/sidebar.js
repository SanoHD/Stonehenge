exports.loadSidebarContent = function(texturePath) {
	let ts = document.getElementById("texture-sidebar");
	// Clear content first
	ts.innerHTML = "";

	textureNameNoExtension = texturePath.slice(0, -4);

	let title = document.createElement("h1");
	title.id = "sidebar-texture-title";

	// The name of the block displayed above the texture in the sidebar
	// Create name with filenameToBlockName()
	title.innerHTML = texts.filenameToBlockName(path.basename(textureNameNoExtension));

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
