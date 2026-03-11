import RemoveButton from '@/components/admin/RemoveButton';
import { cn } from '@/lib/utils/cn';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

interface Props extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  onRemove: () => void;
}

const ListElement = ({ children, onRemove, className, ...props }: Props) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-2 bg-white/8 border border-white/16 rounded-xl group',
        className,
      )}
      {...props}
    >
      <div className="flex-1 min-w-0 text-sm text-slate-200 font-medium">
        {children}
      </div>
      <RemoveButton onClick={onRemove} />
    </div>
  );
};

export default ListElement;
