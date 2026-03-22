import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

interface Props extends ComponentPropsWithoutRef<'header'> {
  children: ReactNode;
}

const SectionHeader = ({ children, className, ...props }: Props) => {
  return (
    <header
      className={cn(
        'flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-white/12 pb-4 mb-6',
        className,
      )}
      {...props}
    >
      {children}
    </header>
  );
};

export default SectionHeader;
