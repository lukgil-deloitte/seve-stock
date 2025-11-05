import { useEffect, useState } from "react";

export function useCompanyStockData(ticker: string, stooqStartDate: string) {
  const [companyStockData, setCompanyStockData] = useState<CompanyStockData>();

  useEffect(() => {
    async function getCompanyStockData() {
      setCompanyStockData(await window.electron.getCompanyStockData(ticker, stooqStartDate));
    }

    getCompanyStockData();
  }, [ticker, stooqStartDate]);

  return companyStockData;
}