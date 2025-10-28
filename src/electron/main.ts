import { app, BrowserWindow } from "electron";

import { ipcMainHandle, isDev } from "./utils.js";
import { getPreloadPath, getUIPath } from "./path-resolver.js";
import { getCpuModel, sendRamUsage } from "./node-example.js";
import { fetchStockData, getStockData, saveStockData } from "./stock-data/stock-data.js";
import { StockCompany } from "./stock-data/types.js";
import { getAveragePrice, getCurrentDiscount } from "./stock-data/formulas.js";
import { stockDataDir } from "./stock-data/constants.js";
import fs from 'fs';
import path from 'path';


const startDate = '20201013';

app.whenReady().then(async () => {
  const company: StockCompany = "MOL";
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

  async function scrapCompanies() {
    const res = await fetch('https://stooq.pl/t/?i=513&v=8&o=5', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'pl,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Referer': 'https://google.com/',
      }
    });

    const html = await res.text();
    const filePath = path.join(stockDataDir, `dupa.json`);
    fs.mkdirSync(stockDataDir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(html, null, 2));
  }

  scrapCompanies();

  sendRamUsage(mainWindow);

  ipcMainHandle("getCpuModel", () => getCpuModel());

  mainWindow.on("closed", () => {
    app.quit();
  });
});
