import { PlanetCategory, PlanetFullListResponse } from '@/types/planet';
import { Search } from 'lucide-react';
import AddPlanetLink from '../../components/AddPlanetLink';
import {
  CategorySelector,
  ExtendedStatusSelector,
  LanguageSelector,
} from '../../planet/add/components/Selectors';
import { LanguageOption } from '@/types/reactSelectOptions';
import { Dispatch, SetStateAction } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categoryOptions } from '@/lib/constants/reactSelectOptions';
import DashboardLink from '@/app/(protected)/components/DashboardLink';
import HomeLink from '@/components/shared/HomeLink';
import PlanetStats from '@/components/shared/PlanetStats';

export interface Props {
  category: PlanetCategory;
  data: PlanetFullListResponse;
  currentLanguage: LanguageOption;
  setCurrentLanguage: Dispatch<SetStateAction<LanguageOption>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

const Header = ({
  category,
  data,
  currentLanguage,
  setCurrentLanguage,
  searchQuery,
  setSearchQuery,
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
    <header className="admin-page-header">
      <div className="flex items-center gap-4">
        <HomeLink className='h-10' />
        <DashboardLink className='h-10' />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Update Roadmap
        </h1>
      </div>

      <div className="flex items-center gap-12">
        <PlanetStats total={total} published={published} drafts={drafts} />

        <div className='flex items-center gap-4'>
          <LanguageSelector
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
          />

          <CategorySelector
            value={
              categoryOptions.find(o => o.value === category) ||
              categoryOptions[0]
            }
            onCategoryChange={onCategoryChange}
          />

          <ExtendedStatusSelector />
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
            size={16}
          />
          <input
            type="text"
            placeholder="Search for topic..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl pl-9 pr-4 py-2 text-sm outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <AddPlanetLink category={category} />

        <button className="header-button bg-green-800 hover:bg-green-600">
          Update
        </button>
      </div>
    </header>
  );
};

export default Header;
