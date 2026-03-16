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
        'px-6 bg-white/12 disabled:cursor-not-allowed disabled:bg-white/6 hover:bg-white/25 rounded-xl transition-all text-white font-bold text-sm',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default AddButton;
