exports.loadWindow = function() {
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
				defaultPath: rootDir + path.sep + "projects"
			})[0];

			if (filePath === undefined) {
				loadWindow();
				pack = {};

			} else {
				filePath = filePath + "\\my-resource-pack";

				template = dialog.showOpenDialogSync({
					title: translate("opentemplatepath"),
					properties: ["openDirectory"],
					defaultPath: rootDir + path.sep + "templates" + path.sep + "Default-Texture-Pack-1.16.x"
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
				defaultPath: rootDir + path.sep + "projects"
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

				loadTextureFiles();

				loadWindow();
			}
		});

	} else {
		document.getElementById("window-workspace").style.display = "inherit";

		loadSelectors();
		loadContent();
	}
}
