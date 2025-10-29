import path from 'path';
import fs from 'fs';
import { differenceInMinutes } from 'date-fns';

import { stockDataCacheDirname } from "./constants.js";
import { StockRecord, StockRecordCache } from "./types.js";
import { convertNativeDateToStooqDate, convertStringDateToStooqDate, timestampParser } from './utils.js';

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
    const stockData = records.map(record => createStockDataObject(record));
    const today = new Date();

    const stockDataWithTimestamp = {
      timestamp: today,
      stockData
    };

    const filePath = path.join(stockDataCacheDirname, `${companySymbol}.json`);
    fs.mkdirSync(stockDataCacheDirname, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(stockDataWithTimestamp, null, 2));

    return stockData;

  } catch (err) {
    console.error('Site unavailable - ', err);
  }
}

export async function getFreshStockData(companySymbol: string, startDate: string) {
  const endDate = convertNativeDateToStooqDate(new Date());
  const filePath = path.join(stockDataCacheDirname, `${companySymbol}.json`);
  let freshStockData: StockRecord[] | undefined;

  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData: StockRecordCache = JSON.parse(rawData, timestampParser);
    const { timestamp, stockData } = parsedData;
    const minutesSinceUpdate = differenceInMinutes(new Date(), timestamp);

    if (minutesSinceUpdate >= 60) {
      freshStockData = await fetchStockData(companySymbol);
    } else {
      freshStockData = stockData;
    }

  } catch (e) {
    if (e instanceof Error && 'code' in e && e.code === 'ENOENT') {
      freshStockData = await fetchStockData(companySymbol);
    } else {
      throw new Error('Unknown error :(');
    }
  }

  return freshStockData?.filter((stockRecord) =>
    convertStringDateToStooqDate(stockRecord.date) >= startDate &&
    convertStringDateToStooqDate(stockRecord.date) <= endDate);
}

