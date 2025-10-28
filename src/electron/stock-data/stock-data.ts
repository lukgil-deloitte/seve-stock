import path from 'path';
import fs from 'fs';

import { CompanySymbolMap, stockDataDir } from "./constants.js";
import { StockCompany, StockRecord } from "./types.js";
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

export async function fetchStockData(company: StockCompany) {
  const url = `https://stooq.com/q/d/l/?s=${CompanySymbolMap[company]}&i=d`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${company}`);

    const data = await res.text();
    if (!data || data.trim().length === 0) throw new Error(`Empty response for ${company}`);

    const records = data.trim().split(/\r?\n/);
    records.shift();
    return records.map(record => createStockDataObject(record));

  } catch (err) {
    console.error('Site unavailable - ', err);
  }
}

export function saveStockData(company: keyof typeof CompanySymbolMap, data: StockRecord[]) {
  const filePath = path.join(stockDataDir, `${company}.json`);
  fs.mkdirSync(stockDataDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function getStockData(company: StockCompany, startDate: string) {
  const endDate = convertNativeDateToStooqDate(new Date());

  const filePath = path.join(stockDataDir, `${company}.json`);
  const savedStockData = fs.readFileSync(filePath, 'utf-8');
  const parsedData: StockRecord[] = JSON.parse(savedStockData);
  const filteredData = parsedData.filter((stockRecord) =>
    convertStringDateToStooqDate(stockRecord.date) >= startDate &&
    convertStringDateToStooqDate(stockRecord.date) <= endDate);

  return filteredData;
}