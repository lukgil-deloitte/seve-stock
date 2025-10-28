import { CompanySymbolMap } from "./constants.js";

export interface StockRecord {
  date: string;
  open: number
  high: number
  low: number
  close: number
  avg: number
};

export type StockCompany = keyof typeof CompanySymbolMap;