import { PLANET_CATEGORY, PlanetCategory } from '@/types/planet';
import Header from './components/Header';
import CategoryStatsList, {
  CategoryStatsItem,
} from './components/CategoryStatsList';

const MOCK_CATEGORY_STATS: CategoryStatsItem[] = (
  Object.keys(PLANET_CATEGORY) as PlanetCategory[]
).map((category, index) => ({
  category,
  total: index === 0 ? 6 : 0,
  published: index === 0 ? 4 : 0,
  drafts: index === 0 ? 2 : 0,
}));

const DashboardPage = () => {
  return (
    <div className="page">
      <Header />
      <main className="px-[10%]">
        <CategoryStatsList items={MOCK_CATEGORY_STATS} />
      </main>
    </div>
  );
};

export default DashboardPage;
