import path from 'path';
import fs from 'fs';
import { differenceInMinutes, subYears } from 'date-fns';

import { dataCacheDirname } from "./constants.js";
import { StockDataRecord, StockRecordCache } from "./types.js";
import { convertNativeDateToStooqDate, convertStringDateToStooqDate, timestampParser } from './utils.js';

function createStockDataObject(record: string): StockDataRecord {
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

async function fetchStockData(companySymbol: string) {
  const today = convertNativeDateToStooqDate(new Date());
  const tenYearsAgo = convertNativeDateToStooqDate(subYears(new Date(), 10));
  const url = `https://stooq.com/q/d/l/?s=${companySymbol}&d1=${tenYearsAgo}&d2=${today}&i=d`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${companySymbol}`);

    const data = await res.text();
    if (!data || data.trim().length === 0) throw new Error(`Empty response for ${companySymbol}`);
    if (data === 'Exceeded the daily hits limit') throw new Error(`Exceeded the daily hits limit when fetching ${companySymbol}`);

    const records = data.trim().split(/\r?\n/);
    records.shift();
    const stockData = records.map(record => createStockDataObject(record));
    const today = new Date();

    const stockDataWithTimestamp = {
      timestamp: today,
      stockData
    };

    const filePath = path.join(dataCacheDirname, `${companySymbol}.json`);
    fs.mkdirSync(dataCacheDirname, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(stockDataWithTimestamp, null, 2));

    return stockData;

  } catch (err) {
    console.error('[ERROR]:[fetchStockData]', err);
  }
}

export async function getFreshStockData(companySymbol: string, startDate: string) {
  const endDate = convertNativeDateToStooqDate(new Date());
  const filePath = path.join(dataCacheDirname, `${companySymbol}.json`);
  let freshStockData: StockDataRecord[] | undefined;

  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData: StockRecordCache = JSON.parse(rawData, timestampParser);
    const { timestamp, stockData } = parsedData;

    if (stockData.length === 0) throw new Error('Empty cache file');

    const minutesSinceUpdate = differenceInMinutes(new Date(), timestamp);

    if (minutesSinceUpdate >= 60) {
      console.log(`[LOG]:[getFreshStockData] Stock data for ${companySymbol} is stale, trying to fetch...`);
      const fetchedStockData = await fetchStockData(companySymbol);

      if (fetchedStockData === undefined || fetchedStockData.length === 0) {
        console.error(`[ERROR]:[getFreshStockData] Unable to fetch fresh stock data for ${companySymbol}, using stale data from cache`);
        freshStockData = stockData;
      } else {
        freshStockData = fetchedStockData;
      }

    } else {
      freshStockData = stockData;
    }

  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      console.log(`[LOG]:[getFreshStockData] No cache file found for ${companySymbol}, trying to fetch...`);
      freshStockData = await fetchStockData(companySymbol);
    }
    else if (err instanceof Error && err.message === 'Empty cache file') {
      console.log(`[LOG]:[getFreshStockData] Cache file for ${companySymbol} is empty, trying to fetch...`);
      freshStockData = await fetchStockData(companySymbol);
    }
    else {
      console.error('[ERROR]:[getFreshStockData]', err);
    }
  }

  return freshStockData?.filter((stockRecord) =>
    convertStringDateToStooqDate(stockRecord.date) >= startDate &&
    convertStringDateToStooqDate(stockRecord.date) <= endDate);
}

