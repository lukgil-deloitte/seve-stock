export interface StockRecordCache {
  timestamp: Date
  stockData: CompanyStockData
}

export interface CompaniesListCache {
  timestamp: Date
  companiesList: CompaniesList
}

interface CompanyWithStockData {
  company: string
  fullname: string
  stockData: CompanyStockData
}

export type PreparedData = Record<string, CompanyWithStockData>