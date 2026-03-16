import { Home } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

interface Props {
  className?: string;
}

const HomeLink = ({ className }: Props) => {
  return (
    <Link href="/" className={cn('nav-item', className)}>
      <Home size={16} />
      <span className="nav-item-text">Home</span>
    </Link>
  );
};

export default HomeLink;
