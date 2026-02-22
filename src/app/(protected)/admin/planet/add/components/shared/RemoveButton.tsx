import { cn } from '@/lib/utils/cn';
import { Trash2 } from 'lucide-react';
import { ComponentPropsWithoutRef } from 'react';

const RemoveButton = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'button'>) => {
  return (
    <button
      type="button"
      className={cn(
        'p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/15 rounded-lg transition-all',
        className,
      )}
      {...props}
    >
      <Trash2 size={18} />
    </button>
  );
};

export default RemoveButton;
