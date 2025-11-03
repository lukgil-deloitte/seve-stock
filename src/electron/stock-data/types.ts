export interface StockDataRecord {
  date: string;
  open: number
  high: number
  low: number
  close: number
  avg: number
};

export interface StockRecordCache {
  timestamp: Date;
  stockData: StockDataRecord[]
}

export interface CompaniesListCache {
  timestamp: Date
  companiesList: CompaniesList
}

interface CompanyWithStockData {
  company: string;
  fullname: string;
  stockData: StockDataRecord[]
}

export type PreparedData = Record<string, CompanyWithStockData>