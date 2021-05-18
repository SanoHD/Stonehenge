exports.updateSHFile = function() {
	let shContent = JSON.stringify(pack, null, 2);

	fs.writeFileSync(filePath + path.sep + ".stonehenge", shContent);
}

exports.loadTextureFiles = function() {
	loadedTextureFiles = []
	let _loadedTextureFiles = loadFiles(packPath)["children"];
	for (var tf of _loadedTextureFiles) {
		loadedTextureFiles.push(tf["name"]);
	}
}

exports.checkTextureLoaded = function(textureElement, isFilename=false) {
	let src_ = null;

	if (isFilename) {
		src_ = textureElement;
	} else {
		src_ = textureElement.getElementsByTagName("p")[0].title;
	}

	return loadedTextureFiles.includes(path.basename(src_));
}

exports.loadFiles = function(dirName) {
	let files = dirTree(dirName + "/assets/minecraft/textures/block");
	return files;
}

exports.cursor = function(type) {
	switch (type) {
		case "normal":
			document.body.style.cursor = "default";
			break;

		case "loading":
			document.body.style.cursor = "wait";
			break;
	}
}
