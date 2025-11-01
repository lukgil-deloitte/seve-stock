import { Select } from 'radix-ui';
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { selectContent, selectItem, selectTrigger } from './select.module.scss';

interface SelectOption {
  value: string;
  label: string
}

export type SelectOptions = SelectOption[]

interface SelectProps {
  placeholder?: string;
  options: SelectOption[]
}

export const SelectRadix = ({ placeholder, options }: SelectProps) => (
  <Select.Root>
    <Select.Trigger className={selectTrigger}>
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content className={selectContent}>
        <Select.Viewport>
          {options.map(({ label, value }) => <SelectItem className={selectItem} key={value} value={value}>{label}</SelectItem>)}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

type SelectItemProps = React.ComponentPropsWithRef<typeof Select.Item>;

const SelectItem = ({ children, ...props }: SelectItemProps) => (
  <Select.Item
    {...props}
  >
    <Select.ItemText>{children}</Select.ItemText>
  </Select.Item>
);