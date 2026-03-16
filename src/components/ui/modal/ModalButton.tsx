'use client';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils/cn';

const baseClasses =
  'flex-1 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all';

const ModalButton = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'button'>) => (
  <button type="button" {...props} className={cn(baseClasses, className)}>
    {children}
  </button>
);

export default ModalButton;
