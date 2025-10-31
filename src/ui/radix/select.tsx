import { Select } from 'radix-ui';
import {
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import { forwardRef, type ComponentPropsWithoutRef, type ComponentPropsWithRef, type PropsWithChildren, type ReactNode, type Ref, type RefObject } from 'react';

interface SelectRadixProps {
  placeholder?: string;
}

export const SelectRadix = ({ placeholder }: SelectRadixProps) => (
  <Select.Root>

    <Select.Trigger>
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content>
        <Select.Viewport>

          <SelectItem value={'Dupsko'}   >Dupa</SelectItem>
          <SelectItem value={'Qupsko'}   >Qupa</SelectItem>
          <SelectItem value={'Wupsko'}   >Wupa</SelectItem>
          <SelectItem value={'Eupsko'}   >Eupa</SelectItem>
          <SelectItem value={'Rupsko'}   >Rupa</SelectItem>

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
    <Select.ItemIndicator>
      {/* <CheckIcon /> */}
    </Select.ItemIndicator>
  </Select.Item>
);
