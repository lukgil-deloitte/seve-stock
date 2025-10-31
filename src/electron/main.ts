import { app, BrowserWindow } from "electron";

import { ipcMainHandle, isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./path-resolver.js";
import { getCpuModel, sendRamUsage } from "./node-example.js";
import { prepareData } from "./stock-data/prepare-data.js";

app.whenReady().then(async () => {
  const preparedData = await prepareData('20251025');
  console.log(preparedData);

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5132");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  mainWindow.webContents.openDevTools();
  sendRamUsage(mainWindow);
  ipcMainHandle("getCpuModel", () => getCpuModel());

  mainWindow.on("closed", () => {
    app.quit();
  });
});
