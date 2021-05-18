exports.loadExport = function () {
	let exportButton = document.createElement("p");
	exportButton.id = "export-button";
	exportButton.innerHTML = translate("export_button_text");

	exportButton.addEventListener("click", function() {
		exportPath = dialog.showOpenDialogSync({
			title: translate("open_export_path"),
			properties: ["openDirectory"],
			defaultPath: rootDir + path.sep + "exported"
		})[0];

		if (exportPath === undefined) {
			return;
		}

		let p1 = packPath;
		let p2 = exportPath + path.sep + toFilename(pack["name"], raw=true) + ".zip"

		console.log(p1, "TO", p2);

		let zipped = new admZip();
		zipped.addLocalFolder(p1);
		zipped.writeZip(p2);

	});

	content.appendChild(exportButton);
};
