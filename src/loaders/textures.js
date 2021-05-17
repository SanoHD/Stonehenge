exports.loadTextures = function() {
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
	onlyShowLoadedTexturesSelector.style.padding = "2px";

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

		// Change source of texture image from template to resource pack, if texture is loaded
		if (loadedTextureFiles.includes(path.basename(texture))) {
			singleTextureImage.src = packPath + "/assets/minecraft/textures/block/".replaceAll("/", path.sep) + path.basename(texture);
		} else {
			singleTextureImage.src = texture;
		}

		// Title of texture
		let singleTextureTitle = document.createElement("p");
		singleTextureTitle.classList.add("texture-title");
		singleTextureTitle.innerHTML = path.basename(texture);

		if (loadedTextureFiles.includes(path.basename(texture))) {
			singleTextureTitle.title = packPath + "/assets/minecraft/textures/block/".replaceAll("/", path.sep) + path.basename(texture);
		} else {
			singleTextureTitle.title = texture;
		}

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
