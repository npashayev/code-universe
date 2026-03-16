import { ReactNode, ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface Props extends ComponentPropsWithoutRef<'label'> {
  children: ReactNode;
}

const Label = ({ children, className, ...props }: Props) => {
  return (
    <label
      className={cn(
        'text-xs font-bold text-slate-400 uppercase tracking-wider block',
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
