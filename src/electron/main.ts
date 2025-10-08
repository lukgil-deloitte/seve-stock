import { app, BrowserWindow } from "electron";

import { ipcMainHandle, isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./path-resolver.js";
import { getCpuModel, sendRamUsage } from "./node-example.js";
import { CompanySymbolMap, fetchStockData } from "./fetch-stock-data.js";

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5132");
  } else {
    mainWindow.loadFile(getUIPath());
  }
  mainWindow.webContents.openDevTools()


  sendRamUsage(mainWindow);

  ipcMainHandle("getCpuModel", () => getCpuModel());

  // ipcMainHandle('getCheapestDay', () => )

  const d1 = '20240101'
  const d2 = '20240105'

  fetchStockData(CompanySymbolMap["PKN ORLEN"], d1, d2)

  mainWindow.on("closed", () => {
    app.quit();
  });
});
