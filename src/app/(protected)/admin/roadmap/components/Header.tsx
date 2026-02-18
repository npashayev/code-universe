import { PlanetCategory, PlanetFullListResponse } from '@/types/planet';
import { Globe, Plus } from 'lucide-react';
import Link from 'next/link';
import {
  CategorySelector,
  ExtendedStatusSelector,
  LanguageSelector,
} from '../../planet/add/components/Selectors';
import { LanguageOption } from '@/types/reactSelectOptions';
import { Dispatch, SetStateAction } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categoryOptions } from '@/lib/constants/reactSelectOptions';

export interface Props {
  category: PlanetCategory;
  data: PlanetFullListResponse;
  currentLanguage: LanguageOption;
  setCurrentLanguage: Dispatch<SetStateAction<LanguageOption>>;
}

const Header = ({
  category,
  data,
  currentLanguage,
  setCurrentLanguage,
}: Props) => {
  const { stats } = data;
  const { total, published, drafts } = stats;
  const router = useRouter();
  const searchParams = useSearchParams();

  const onCategoryChange = (category: PlanetCategory) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('category', category);
    router.push(`?${updatedSearchParams.toString()}`);
  };

  return (
    <header className="sticky top-0 z-60 bg-night backdrop-blur-xl border-b border-white/5 py-6 px-12 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-lg shadow-orange-500/10">
          <Globe className="text-orange-500" size={20} />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Update Roadmap
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
        <div className="flex items-center gap-8 mr-10">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">
              Total
            </span>
            <span className="text-xl font-mono font-bold text-white leading-none">
              {total}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] text-green-500/70 uppercase font-black tracking-tighter">
              Published
            </span>
            <span className="text-xl font-mono font-bold text-green-400 leading-none">
              {published}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-orange-500/70 uppercase font-black tracking-tighter">
              Drafts
            </span>
            <span className="text-xl font-mono font-bold text-orange-400 leading-none">
              {drafts}
            </span>
          </div>
        </div>

        <LanguageSelector
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
        />

        <CategorySelector
          value={
            categoryOptions.find(
              o => o.value === searchParams.get('category'),
            ) ||
            categoryOptions.find(o => o.value === category) ||
            categoryOptions[0]
          }
          onCategoryChange={onCategoryChange}
        />

        <ExtendedStatusSelector />

        <div className="flex items-center gap-4">
          {/* Search */}
          {/* <div className="relative group flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-orange-500 transition-colors"
                size={14}
              />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-orange-500/50 rounded-xl pl-9 pr-4 py-2 text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div> */}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`/admin/planet/add?category=${category}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer text-sm"
          target="_blank"
          rel="noreferrer"
        >
          <Plus size={16} />
          Add Planet
        </Link>

        <button className="flex items-center gap-2 px-5 py-2.5 bg-green-800 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer text-sm">
          Update
        </button>
      </div>
    </header>
  );
};

export default Header;
