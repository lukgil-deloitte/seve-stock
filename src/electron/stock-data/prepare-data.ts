import { getFreshStockData } from "./stock-data.js";
import { PreparedData } from "./types.js";

export async function prepareData(stooqDate: string, companiesList: CompaniesList | undefined) {
  if (companiesList === undefined) {
    console.error('[ERROR]:[prepareData] Companies list is undefined');
    return;
  }

  const preparedData: PreparedData = {};

  for (const { symbol, company } of companiesList) {
    const stockData = await getFreshStockData(symbol, stooqDate) ?? [];
    preparedData[symbol] = { company, stockData };
  }

  return preparedData;
}