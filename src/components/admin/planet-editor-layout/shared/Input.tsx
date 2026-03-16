import { cn } from '@/lib/utils/cn';
import { ComponentPropsWithoutRef } from 'react';

const Input = ({
  className,
  type = 'text',
  ...props
}: ComponentPropsWithoutRef<'input'>) => {
  return (
    <input
      type={type}
      className={cn(
        'w-full bg-white/8 border border-white/12 focus:border-orange-500/60 rounded-xl px-4 py-3 outline-none transition-all text-white',
        className,
      )}
      {...props}
    />
  );
};

export default Input;
