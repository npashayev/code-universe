import { PlanetCategory } from '@/types/planet';
import { Search } from 'lucide-react';
import {
  ExtendedStatusOption,
  LanguageOption,
} from '@/types/reactSelectOptions';
import { Dispatch, SetStateAction } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLink from '@/components/admin/ui/DashboardLink';
import HomeLink from '@/components/ui/HomeLink';
import PlanetStats from '@/components/admin/PlanetStats';
import { useUpdatePlanetList } from '@/lib/hooks/admin/queries/usePlanet';
import {
  AdminPlanetListResponse,
  AdminPlanetSummary,
} from '@/lib/planet/getPlanetList';
import AddPlanetLink from '@/components/admin/ui/AddPlanetLink';
import {
  CategorySelector,
  ExtendedStatusSelector,
  LanguageSelector,
} from '@/components/admin/Selectors';

export interface Props {
  data: AdminPlanetListResponse;
  currentLanguage: LanguageOption;
  setCurrentLanguage: Dispatch<SetStateAction<LanguageOption>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  status: ExtendedStatusOption;
  setStatus: Dispatch<SetStateAction<ExtendedStatusOption>>;
  orderedPlanets: AdminPlanetSummary[];
}

const Header = ({
  data,
  currentLanguage,
  setCurrentLanguage,
  searchQuery,
  setSearchQuery,
  status,
  setStatus,
  orderedPlanets,
}: Props) => {
  const router = useRouter();

  const { stats, category } = data;
  const { total, published, drafts } = stats;

  const searchParams = useSearchParams();

  const onCategoryChange = (category: PlanetCategory) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set('category', category);
    router.push(`?${updatedSearchParams.toString()}`);
  };

  const { mutate: updateList, isPending } = useUpdatePlanetList();

  const updatePlanetList = () => {
    const updatedList = orderedPlanets.map((planet) => ({
      id: planet.id,
      step: planet.step,
      status: planet.status,
    }));

    updateList({
      category,
      planetList: updatedList,
    });
  };

  return (
    <header className="admin-page-header flex-col gap-10">
      <div className="flex items-center justify-between w-full gap-8">
        <div className="flex items-center gap-4">
          <HomeLink className="h-10" />
          <DashboardLink className="h-10" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Update Roadmap
          </h1>
        </div>
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
            size={16}
          />
          <input
            type="text"
            placeholder="Search for topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl pl-9 pr-4 py-2 text-sm outline-none transition-all placeholder:text-slate-600"
          />
        </div>
        <div className="flex items-center gap-3">
          <AddPlanetLink category={category} />

          <button
            className="header-button bg-green-800 hover:bg-green-600"
            onClick={updatePlanetList}
            disabled={isPending}
          >
            {isPending ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between w-full gap-12">
        <PlanetStats total={total} published={published} drafts={drafts} />

        <div className="flex items-center gap-4">
          <LanguageSelector
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
          />

          <CategorySelector
            category={category}
            onCategoryChange={onCategoryChange}
          />

          <ExtendedStatusSelector status={status} setStatus={setStatus} />
        </div>
      </div>
    </header>
  );
};

export default Header;
