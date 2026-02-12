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
        'w-full bg-white/5 border border-white/5 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white',
        className,
      )}
      {...props}
    />
  );
};

export default Input;
