import { app, BrowserWindow } from "electron";

import { ipcMainHandle, isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./path-resolver.js";
import { getCpuModel, sendRamUsage } from "./node-example.js";
import { fetchStockData, getFreshStockData } from "./stock-data/stock-data.js";
import { getAveragePrice, getCurrentDiscount } from "./stock-data/formulas.js";
import { CompanyWithSymbol } from "./stock-data/types.js";
import { getFreshCompaniesList } from "./stock-data/companies-list.js";



let companiesList: CompanyWithSymbol[] | undefined;



async function prepareData() {
  companiesList = await getFreshCompaniesList();
  companiesList.forEach(({ symbol }) => getFreshStockData(symbol, '20251025'));
}

app.whenReady().then(async () => {
  await prepareData();
  const company = "MOL";
  const data = await fetchStockData(company);

  const pknData = await getFreshStockData('pkn', '20251027');
  console.log(pknData);

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
  sendRamUsage(mainWindow);
  ipcMainHandle("getCpuModel", () => getCpuModel());

  mainWindow.on("closed", () => {
    app.quit();
  });
});
