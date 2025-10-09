import { app, BrowserWindow } from "electron";

import { ipcMainHandle, isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./path-resolver.js";
import { getCpuModel, sendRamUsage } from "./node-example.js";
import { CompanySymbolMap, fetchStockData, StockRecord } from "./fetch-stock-data.js";

const d1 = '20240101';
const d2 = '20240105';
let cachedData: StockRecord[] | undefined;

function getCheapestDay(stockData: StockRecord[] | undefined) {
  if (stockData == null || stockData.length === 0) return;
  return stockData.sort((a, b) => a.avg - b.avg)[0];
}

function getCachedData() {
  return [...(cachedData || [])];
}

app.whenReady().then(async () => {
  cachedData = await fetchStockData(CompanySymbolMap["PKN ORLEN"], d1, d2);

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

  const cheapestDay = getCheapestDay(getCachedData());

  console.log('cachedData: ', cachedData);
  console.log('----------------------------');
  console.log('cheapestDay: ', cheapestDay);


  sendRamUsage(mainWindow);

  ipcMainHandle("getCpuModel", () => getCpuModel());


  mainWindow.on("closed", () => {
    app.quit();
  });
});
