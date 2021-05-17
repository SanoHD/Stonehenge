exports.generalChange = function(object, value) {
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

exports.generalSaveChange = function(object, value) {
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
