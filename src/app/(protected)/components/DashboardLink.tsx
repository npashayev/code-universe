import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { LayoutDashboard } from 'lucide-react';

interface Props {
  className?: string;
}

const DashboardLink = ({ className }: Props) => {
  return (
    <Link
      href="/admin/dashboard"
      className={cn("nav-item", className)}
    >
      <LayoutDashboard size={14} />
      <span className="nav-item-text">
        Dashboard
      </span>
    </Link>
  );
};

export default DashboardLink;
