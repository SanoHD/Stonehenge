const spawn = require("child_process").execSync;
const dialog = require("electron").remote.dialog;
const dirTree = require("directory-tree");
const fs = require("fs");
const fsx = require("fs-extra");
const path = require("path");

const utilsChange = require("./utils/change.js");
const utilsEnums  = require("./utils/enums.js");
const utilsTexts  = require("./utils/texts.js");
const utilsUtils  = require("./utils/utils.js");

const loadContent_ = require("./loaders/content.js");
const loadGeneral_  = require("./loaders/general.js");
const loadSelectors_ = require("./loaders/selectors.js");
const loadSidebar_ = require("./loaders/sidebar.js");
const loadTextures_ = require("./loaders/textures.js");
const loadWelcome_ = require("./loaders/welcome.js");
const loadWindow_ = require("./loaders/window.js");



var loadContent = loadContent_.loadContent;
var loadGeneral = loadGeneral_.loadGeneral;
var loadSelectors = loadSelectors_.loadSelectors;
var loadSidebarContent = loadSidebar_.loadSidebarContent;
var toggleTextureSidebar = loadSidebar_.toggleTextureSidebar;
var loadTextures = loadTextures_.loadTextures;
var createWelcomePage = loadWelcome_.createWelcomePage;
var loadWindow = loadWindow_.loadWindow;

var generalChange = utilsChange.generalChange;
var generalSaveChange = utilsChange.generalSaveChange;
var filenameToBlockName = utilsTexts.filenameToBlockName;
var translate = utilsTexts.translate;
var toFilename = utilsTexts.toFilename;
var updateSHFile = utilsUtils.updateSHFile;
var loadTextureFiles = utilsUtils.loadTextureFiles;
var checkTextureLoaded = utilsUtils.checkTextureLoaded;
var loadFiles = utilsUtils.loadFiles;
var cursor = utilsUtils.cursor;

const windowEnum = utilsEnums.windowEnum;



var config = JSON.parse(fs.readFileSync("config.json", "utf8", function(err) {
	if (err) {
		console.log("AN ERROR OCCURRED WHILE TRYING TO OPEN config.json:", err);
	}
}));

var shFile;
var pack = {};
var viewWindow = windowEnum.WELCOME;

var packPath = null;
var openedTexture = null;
var loadedTextureFiles = [];
var onlyShowLoadedTextures = false;
var textureSearchText = null;

var filePath;
var templatePath;
var template;
var content;
var rootDir = path.dirname(__dirname);

var language = config["language"];
var languageStrings = fsx.readJSONSync("language.json");


window.addEventListener("resize", function() {
	if (viewWindow == windowEnum.TEXTURES) {
		document.getElementById("textures").style.height = (window.innerHeight - 100) + "px";
	}
});


createWelcomePage();

loadWindow();
