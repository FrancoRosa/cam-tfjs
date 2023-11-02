const { app, BrowserWindow, Menu } = require("electron");
const express = require("express");
const path = require("path");

// Create an Express app
const expressApp = express();
const port = 8088;
// Serve static files from the "public" directory
expressApp.use(express.static(path.join(__dirname, "build")));

// Serve the static HTML file
expressApp.get("/", (req, res) => {
  const dir = path.join(__dirname, "build/index.html");
  console.log(dir);
  res.sendFile(dir);
});

// Create the main Electron window
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 640,
    height: 480,
  });

  mainWindow.loadURL(`http://localhost:${port}`); // Load the Express app

  Menu.setApplicationMenu(null);
  // Open the DevTools if needed
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
  expressApp.listen(port, () => {
    console.log(`Server is running on port ${8088}`);
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
