import { getPlanetCategoryStats } from '@/lib/planet/getPlanetCategoryStats';

import Header from './components/Header';
import CategoryStatsList from './components/CategoryStatsList';

export default async function DashboardPage() {
  const data = await getPlanetCategoryStats();

  return (
    <div className="page">
      <Header />
      <main className="admin-main">
        <CategoryStatsList items={data} />
      </main>
    </div>
  );
}
