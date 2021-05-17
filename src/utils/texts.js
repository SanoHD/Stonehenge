exports.filenameToBlockName = function(fn) {
	console.log("FROM", "'" + fn + "'");

	let parts = [];
	let singlePart = "";
	for (var char of fn.split("")) {
		if (char == "_") {
			parts.push(singlePart);
			singlePart = "";

		} else if (!isNaN(char)) {
			// Digit
			if (!isNaN(singlePart)) {
				// If already a number, add digit
				singlePart += char;
			} else {
				// If already a text, push and add char
				parts.push(singlePart);
				singlePart = char;
			}

		} else {
			// Char
			if (!isNaN(singlePart)) {
				// If already a number, push and add digit
				parts.push(singlePart);
				singlePart = char;
			} else {
				// If already a text, add char
				singlePart += char;
			}
		}
	}

	parts.push(singlePart);

	console.log(parts);

	parts = parts.filter(e => {
		return e != "";
	});

	for (var i in parts) {
		parts[i] = parts[i][0].toUpperCase() + parts[i].substr(1);
	}

	console.log(parts);

	return parts.join(" ");
}

exports.translate = function(val) {
	if (val in windowEnum) {
		val = {
			GENERAL: "window_general",
			TEXTURES: "window_textures",
			ITEMS: "window_items",
			SOUNDS: "window_sounds",
			EXTRAS: "window_extras",
			EXPORT: "window_export"
		}[val];
	}

	let translation;

	translation = languageStrings[val][language];

	if (translation === undefined) {
		translation = languageStrings[val]["en"];
	}

	return translation;
}

exports.toFilename = function(value, raw=false) {
	let newFileName = "";
	for (var char of value.split("")) {
		if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_".includes(char)) {
			newFileName += char;
		} else {
			newFileName += "_";
		}
	}

	if (raw) {
		return newFileName;
	} else {
		return "(Will be exported as " + newFileName + ".zip)";
	}
}
