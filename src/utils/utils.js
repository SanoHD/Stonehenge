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
