export interface StockRecord {
  date: string;
  open: number
  high: number
  low: number
  close: number
  avg: number
};

export interface StockRecordCache {
  timestamp: Date;
  stockData: StockRecord[]
}

export interface CompanyWithSymbol {
  symbol: string
  company: string
}

export interface CompaniesListCache {
  timestamp: Date
  companiesList: CompanyWithSymbol[]
}