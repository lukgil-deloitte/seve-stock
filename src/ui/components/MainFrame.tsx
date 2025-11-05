import { useState } from "react";

import { Combobox } from "../design-system";
import { useCompaniesList } from "../hooks/useCompaniesList";
import { CandleChart } from "./candle-chart/candle-chart";
import { useCompanyStockData } from "../hooks/useCompanyStockData";
import { createCandlestickData } from "./candle-chart/candle-chart.utils";

function createSelectOptions(companiesList: CompaniesList | undefined) {
  return companiesList?.map(({ company, ticker }) => ({ label: company, value: ticker })) ?? [];
}

export const MainFrame = () => {
  const companiesList = useCompaniesList();
  const [value, setValue] = useState("");

  const companyStockData = useCompanyStockData(value, '20241010');

  return (
    <div>
      <Combobox options={createSelectOptions(companiesList)} value={value} setValue={setValue} />

      {value !== "" && <CandleChart data={createCandlestickData(companyStockData ?? [])} />}
    </div>
  );
}; 