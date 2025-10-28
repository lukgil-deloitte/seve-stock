import path from 'path';
import fs from 'fs';

import { stockDataDir } from "./constants.js";
import { StockRecord } from "./types.js";
import { convertNativeDateToStooqDate, convertStringDateToStooqDate } from './dates.js';


function createStockDataObject(record: string): StockRecord {
  const recordData = record.split(',');
  const open = parseFloat(recordData[1]);
  const high = parseFloat(recordData[2]);
  const low = parseFloat(recordData[3]);
  const close = parseFloat(recordData[4]);
  const avg = (open + close) / 2;

  return {
    date: recordData[0],
    open,
    high,
    low,
    close,
    avg
  };
}

export async function fetchStockData(companySymbol: string) {
  const url = `https://stooq.com/q/d/l/?s=${companySymbol}&i=d`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${companySymbol}`);

    const data = await res.text();
    if (!data || data.trim().length === 0) throw new Error(`Empty response for ${companySymbol}`);

    const records = data.trim().split(/\r?\n/);
    records.shift();
    return records.map(record => createStockDataObject(record));

  } catch (err) {
    console.error('Site unavailable - ', err);
  }
}

export function saveStockData(company: string, data: StockRecord[]) {
  const filePath = path.join(stockDataDir, `${company}.json`);
  fs.mkdirSync(stockDataDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function getStockData(company: string, startDate: string) {
  const endDate = convertNativeDateToStooqDate(new Date());

  const filePath = path.join(stockDataDir, `${company}.json`);
  const savedStockData = fs.readFileSync(filePath, 'utf-8');
  const parsedData: StockRecord[] = JSON.parse(savedStockData);
  const filteredData = parsedData.filter((stockRecord) =>
    convertStringDateToStooqDate(stockRecord.date) >= startDate &&
    convertStringDateToStooqDate(stockRecord.date) <= endDate);

  return filteredData;
}

export async function scrapCompanies() {
  const res = await fetch('https://pl.tradingview.com/markets/stocks-poland/market-movers-large-cap/');
  const html = await res.text();
  const matchedData = [...html.matchAll(/data-rowkey="GPW:([A-Z]+)[\s\S]*?https:\/\/s3-symbol-logo\.tradingview\.com\/([^.]+)/g)];

  const companiesWithSymbols = matchedData.map(m => ({
    symbol: m[1],
    name: m[2]
  }));
  const today = new Date();

  const companiesWithSymbolsWithTimestamp = {
    timestamp: today,
    companiesWithSymbols
  };

  const filePath = path.join(stockDataDir, `companies-and-symbols.json`);
  fs.mkdirSync(stockDataDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(companiesWithSymbolsWithTimestamp, null, 2));
}