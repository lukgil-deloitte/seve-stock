import fs from 'fs';
import path from 'path';
import { differenceInDays } from 'date-fns';

import { companiesListFilename, stockDataCacheDirname } from './constants.js';
import { CompaniesListCache } from './types.js';
import { timestampParser } from './utils.js';


export async function scrapCompanies() {
  const res = await fetch(
    'https://pl.tradingview.com/markets/stocks-poland/market-movers-large-cap/');
  const html = await res.text();
  const matchedData = [...html.matchAll(
    /data-rowkey="GPW:([A-Z]+)[\s\S]*?https:\/\/s3-symbol-logo\.tradingview\.com\/([^.]+)/g)];

  const companiesList = matchedData.map(m => ({
    symbol: m[1],
    company: m[2]
  }));
  const today = new Date();

  const companiesWithSymbolsWithTimestamp = {
    timestamp: today,
    companiesList
  };

  const filePath = path.join(stockDataCacheDirname, companiesListFilename);
  fs.mkdirSync(stockDataCacheDirname, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(companiesWithSymbolsWithTimestamp, null, 2));

  return companiesList;
}


export async function getFreshCompaniesList() {
  const filePath = path.join(stockDataCacheDirname, companiesListFilename);

  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData: CompaniesListCache = JSON.parse(rawData, timestampParser);
    const { timestamp, companiesList } = parsedData;
    const daysSinceUpdate = differenceInDays(new Date(), timestamp);

    if (daysSinceUpdate >= 7) {
      return await scrapCompanies();
    } else {
      return companiesList;
    }

  } catch (e) {
    if (e instanceof Error && 'code' in e && e.code === 'ENOENT') {
      return await scrapCompanies();
    } else {
      throw new Error('Unknown error :(');
    }
  }
}