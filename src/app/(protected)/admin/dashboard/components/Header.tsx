import HomeLink from '@/components/shared/HomeLink';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="admin-page-header">
      <div className="flex items-center gap-6">
        <HomeLink className='h-10' />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin/planet/add?category=html"
          className="header-button bg-orange-500 hover:bg-orange-600"
          target="_blank"
          rel="noreferrer"
        >
          <Plus size={16} />
          Add Planet
        </Link>
      </div>
    </header>
  );
};

export default Header;
