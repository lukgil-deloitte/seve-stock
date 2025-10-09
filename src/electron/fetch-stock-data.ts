export const CompanySymbolMap = {
  'PKN ORLEN': 'pkn',
  'PKO BP': 'pko',
  'Santander Polska': 'spl',
  'PZU': 'pzu',
  'Bank Pekao': 'peo',
  'KGHM': 'kgh',
  'LPP': 'lpp',
  'Dino Polska': 'dnp',
  'CD Projekt': 'cdr',
  'PGE': 'pge'
} as const;

export interface StockRecord {
  date: string;
  open: number
  high: number
  low: number
  close: number
  avg: number
}

function createRecordObject(record: string): StockRecord {
  const recordData = record.split(',');
  const open = parseFloat(recordData[1]);
  const high = parseFloat(recordData[2]);
  const low = parseFloat(recordData[3]);
  const close = parseFloat(recordData[4]);
  const avg = (open + close) / 2;

  return {
    date: recordData[0],
    open,
    high,
    low,
    close,
    avg
  };
}


export async function fetchStockData(company: string, startDate: string, endDate: string) {
  const url = `https://stooq.com/q/d/l/?s=${company}&d1=${startDate}&d2=${endDate}&i=d`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${company}`);

    const data = await res.text();
    if (!data || data.trim().length === 0) throw new Error(`Empty response for ${company}`);

    const records = data.trim().split(/\r?\n/);
    records.shift();
    return records.map(record => createRecordObject(record));

  } catch (err) {
    console.error('Site unavailable - ', err);
  }
}