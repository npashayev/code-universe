import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils/cn';

const Textarea = ({
  className,
  rows = 4,
  ...props
}: ComponentPropsWithoutRef<'textarea'>) => (
  <textarea
    rows={rows}
    className={cn(
      'w-full bg-white/8 border border-white/15 focus:border-orange-500/60 rounded-xl px-4 py-3 outline-none transition-all text-white resize-y',
      className,
    )}
    {...props}
  />
);

export default Textarea;
