import { Edit } from 'lucide-react';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils/cn';

type Props = ComponentPropsWithoutRef<typeof Link>;

const UpdateLink = ({ className, ...props }: Props) => {
  return (
    <Link
      className={cn(
        'p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/15 rounded-lg transition-all',
        className,
      )}
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      <Edit size={18} />
    </Link>
  );
};

export default UpdateLink;
