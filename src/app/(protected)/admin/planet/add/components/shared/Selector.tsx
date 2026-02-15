import { getAdminPageSelectStyles } from '@/lib/utils/getAdminPageSelectStyles';
import { ChevronDown } from 'lucide-react';
import Select, { CSSObjectWithLabel, SingleValue } from 'react-select';
import { ReactNode } from 'react';
import { BaseOption } from '@/types/reactSelectOptions';

interface Props<T extends BaseOption<unknown>> {
  children?: ReactNode;
  instanceId: string;
  value: T | null;
  options: T[];
  onChange: (opt: SingleValue<T>) => void;
  styles?: {
    controlStyles?: Partial<CSSObjectWithLabel>;
  };
  isSearchable?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
}

const Selector = <T extends BaseOption<unknown>>({
  children,
  instanceId,
  value,
  options,
  onChange,
  styles,
  isSearchable = false,
  isDisabled = false,
  placeholder,
}: Props<T>) => {
  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-orange-500 transition-colors">
        {children}
      </div>

      <Select<T, false>
        instanceId={instanceId}
        value={value}
        options={options}
        onChange={onChange}
        styles={getAdminPageSelectStyles<T>(styles)}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        placeholder={placeholder}
      />

      <ChevronDown
        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        size={15}
      />
    </div>
  );
};

export default Selector;
