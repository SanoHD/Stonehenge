const {app, BrowserWindow} = require("electron");
const url = require("url");
const path = require("path");

function createWindow() {
	const win = new BrowserWindow({
		show: false,
		width: 800,
		height: 600,
		webPreferences: {
			contextIsolation: false,
			enableRemoteModule: true,
			nodeIntegration: true
		}
	});

	win.maximize();

	win.loadURL(url.format({
		pathname: path.join(__dirname, "src/index.html"),
		protocol: "file:",
		slashes: true
	}))
}

app.on("ready", createWindow);
