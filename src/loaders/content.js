exports.loadContent = function() {
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
			cursor("loading");
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
