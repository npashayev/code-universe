import { cn } from '@/lib/utils/cn';
import { ComponentPropsWithoutRef } from 'react';

const AddButton = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'button'>) => {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'px-6 bg-white/10 disabled:cursor-not-allowed disabled:bg-white/5 hover:bg-white/20 rounded-xl transition-all text-white font-bold text-sm',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default AddButton;
