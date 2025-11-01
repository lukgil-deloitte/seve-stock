interface Window {
  electron: {
    getCheapestDay: () => Promise<string>
    getCompaniesList: () => Promise<CompaniesList>
  };
}

type EventPayloadMap = {
  getCheapestDay: string;
  getCompaniesList: CompaniesList
};

interface CompanyWithSymbol {
  symbol: string
  company: string
}

type CompaniesList = CompanyWithSymbol[]