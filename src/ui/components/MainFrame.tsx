import { useEffect, useState } from "react";
import { SelectRadix as Select, type SelectOptions } from "../radix/select/select";

export const MainFrame = () => {
  const [selectOptions, setSelectOptions] = useState<SelectOptions>([]);

  // przenies do osobnego hooka
  useEffect(() => {
    async function getCompaniesList() {
      const companiesList = await window.electron.getCompaniesList();
      setSelectOptions(companiesList.map(({ company, symbol }) => ({ label: company, value: symbol })));
    }

    getCompaniesList();
  }, []);

  return (
    <div>
      <Select placeholder="Company" options={selectOptions} />
    </div>
  );
};