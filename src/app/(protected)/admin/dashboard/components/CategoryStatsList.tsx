import Link from 'next/link';
import PlanetStats from '@/components/shared/PlanetStats';
import { CategoryStatsItem, PLANET_CATEGORY } from '@/types/planet';

interface Props {
  items: CategoryStatsItem[];
}

const CategoryStatsList = ({ items }: Props) => {
  return (
    <ul className="space-y-3">
      {items.map(item => {
        const { total, drafts, published } = item.stats;
        return (
          <li key={item.category}>
            <Link
              href={`/admin/roadmap?category=${item.category}`}
              className="group flex items-center justify-between gap-6 py-4 px-6 rounded-2xl border transition-all duration-300 bg-orange-500/10 border-white/20 opacity-90 hover:opacity-100 hover:border-orange-500/50 text-white"
            >
              <h3 className="text-lg font-bold tracking-tight text-white">
                {PLANET_CATEGORY[item.category]}
              </h3>

              <PlanetStats
                total={total}
                published={published}
                drafts={drafts}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default CategoryStatsList;
