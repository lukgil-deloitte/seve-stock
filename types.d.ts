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
  ticker: string
  company: string
  fullname: string
}

type CompaniesList = CompanyWithSymbol[]