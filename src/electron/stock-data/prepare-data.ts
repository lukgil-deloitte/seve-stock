import { getFreshCompaniesList } from "./companies-list.js";
import { getFreshStockData } from "./stock-data.js";
import { StockDataRecord } from "./types.js";

interface CompanyWithStockData {
  company: string;
  stockData: StockDataRecord[]
}

type PreparedData = Record<string, CompanyWithStockData>

export async function prepareData(stooqDate: string) {
  const companiesList = await getFreshCompaniesList();
  if (companiesList === undefined) return;

  const preparedData: PreparedData = {};

  for (const { symbol, company } of companiesList) {
    const stockData = await getFreshStockData(symbol, stooqDate) ?? [];
    preparedData[symbol] = { company, stockData };
  }

  return preparedData;
}