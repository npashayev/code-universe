import { cn } from '@/lib/utils/cn';
import { Loader, Trash2 } from 'lucide-react';
import { ComponentPropsWithoutRef } from 'react';

const RemoveButton = ({
  className,
  isDeleting = false,
  ...props
}: ComponentPropsWithoutRef<'button'> & { isDeleting?: boolean }) => {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/15 rounded-lg transition-all disabled:cursor-not-allowed',
        className,
      )}
      disabled={isDeleting}
    >
      {
        isDeleting
          ? <Loader size={18} className='animate-spin' />
          : <Trash2 size={18} />
      }
    </button>
  );
};

export default RemoveButton;
