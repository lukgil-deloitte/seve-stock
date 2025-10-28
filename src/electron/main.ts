import { app, BrowserWindow } from "electron";

import { ipcMainHandle, isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./path-resolver.js";
import { getCpuModel, sendRamUsage } from "./node-example.js";
import { fetchStockData, getStockData, saveStockData, scrapCompanies } from "./stock-data/stock-data.js";
import { getAveragePrice, getCurrentDiscount } from "./stock-data/formulas.js";
import { stockDataDir } from "./stock-data/constants.js";

const startDate = '20201013';

app.whenReady().then(async () => {
  const company = "MOL";
  const data = await fetchStockData(company);
  if (data != null) saveStockData(company, data);

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
  mainWindow.webContents.openDevTools();


  // const records = await getStockData('PKN ORLEN', startDate);
  // const avgPrice = getAveragePrice(records);
  // console.log('avgPrice', avgPrice);
  // const currentPrice = records[records.length - 1].avg;
  // console.log('currentPrice', currentPrice);
  // const currentDiscount = getCurrentDiscount(avgPrice, currentPrice);
  // console.log('currentDiscount', currentDiscount);

  scrapCompanies();

  sendRamUsage(mainWindow);

  ipcMainHandle("getCpuModel", () => getCpuModel());

  mainWindow.on("closed", () => {
    app.quit();
  });
});
