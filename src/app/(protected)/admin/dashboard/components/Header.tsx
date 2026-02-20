import HomeLink from '@/components/shared/HomeLink';
import { Globe, Plus } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-60 bg-night backdrop-blur-xl border-b border-white/5 py-6 px-12 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <HomeLink className='h-10' />
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-lg shadow-orange-500/10">
            <Globe className="text-orange-500" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Admin Dashboard
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin/planet/add?category=html"
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer text-sm"
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
