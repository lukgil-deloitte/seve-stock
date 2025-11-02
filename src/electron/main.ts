import { app, BrowserWindow } from "electron";

import { ipcMainHandle, isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./path-resolver.js";
import { prepareData } from "./stock-data/prepare-data.js";
import { getFreshCompaniesList } from "./stock-data/companies-list.js";

app.whenReady().then(async () => {
  const companiesList = await getFreshCompaniesList();
  // const preparedData = await prepareData('20251025', companiesList);

  // console.log('preparedData', preparedData);

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: getPreloadPath()
    }
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5132");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  mainWindow.webContents.openDevTools();
  ipcMainHandle("getCompaniesList", () => companiesList ?? []);

  //TODO: subscribe to logs

  mainWindow.on("closed", () => {
    app.quit();
  });
});