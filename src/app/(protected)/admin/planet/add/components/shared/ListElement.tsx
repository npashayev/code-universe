import { cn } from '@/lib/utils/cn';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import RemoveButton from './RemoveButton';

interface Props extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  onRemove: () => void;
}

const ListElement = ({ children, onRemove, className, ...props }: Props) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-xl group',
        className,
      )}
      {...props}
    >
      <div className="flex-1 text-sm text-slate-300 font-medium">
        {children}
      </div>
      <RemoveButton onClick={onRemove} />
    </div>
  );
};

export default ListElement;
