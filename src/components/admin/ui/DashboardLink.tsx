import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface Props {
  className?: string;
}

const DashboardLink = ({ className }: Props) => {
  return (
    <Link href="/admin/dashboard" className={cn('nav-item', className)}>
      <LayoutDashboard size={14} />
      <span className="nav-item-text">Dashboard</span>
    </Link>
  );
};

export default DashboardLink;
