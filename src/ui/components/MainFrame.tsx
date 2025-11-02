import { Combobox, Select } from "../design-system";
import { useCompaniesList } from "../hooks/useCompaniesList";

function createSelectOptions(companiesList: CompaniesList | undefined) {
  return companiesList?.map(({ company, symbol }) => ({ label: company, value: symbol })) ?? [];
}

export const MainFrame = () => {
  const companiesList = useCompaniesList();

  return (
    <div>
      <Select placeholder="Company" options={createSelectOptions(companiesList)} />
      <Combobox options={createSelectOptions(companiesList)} />
    </div>
  );
}; 