interface Window {
  electron: {
    getCompaniesList: () => Promise<CompaniesList | undefined>
    getCompanyStockData: (ticker, startDate) => Promise<CompanyStockData | undefined>
  };
}

type EventPayloadMap = {
  getCompaniesList: Promise<CompaniesList | undefined>
  getCompanyStockData: Promise<CompanyStockData | undefined>
};

interface CompanyWithSymbol {
  ticker: string
  company: string
  fullname: string
}

type CompaniesList = CompanyWithSymbol[]

interface StockDataRecord {
  date: string;
  open: number
  high: number
  low: number
  close: number
  avg: number
};

type CompanyStockData = StockDataRecord[]