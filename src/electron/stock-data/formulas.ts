export function getAveragePrice(data: CompanyStockData) {
  return data.reduce((sum, record) => sum + record.avg, 0) / data.length;
}

function getCheapestDay(stockData: CompanyStockData | undefined) {
  if (stockData == null || stockData.length === 0) return;
  return stockData.sort((a, b) => a.avg - b.avg)[0];
}

export function getCurrentDiscount(avgPrice: number, currentPrice: number) {
  if (avgPrice == null || currentPrice == null) return;
  if (avgPrice === 0 || currentPrice === 0) return;

  return currentPrice / avgPrice;
}