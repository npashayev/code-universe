import Header from './components/Header';
import CategoryStatsList from './components/CategoryStatsList';
import { use } from 'react';
import { getPlanetCategoryStats } from '@/lib/planet/getPlanetCategoryStats';

export default function DashboardPage() {
  const data = use(getPlanetCategoryStats());
  return (
    <div className="page">
      <Header />
      <main className="admin-main">
        <CategoryStatsList items={data} />
      </main>
    </div>
  );
}
