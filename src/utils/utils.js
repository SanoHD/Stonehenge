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

exports.checkTextureLoaded = function(textureElement) {
	let src_ = textureElement.getElementsByTagName("p")[0].title;
	return loadedTextureFiles.includes(path.basename(src_));
}

exports.loadFiles = function(dirName) {
	let files = dirTree(dirName + "/assets/minecraft/textures/block");
	return files;
}
