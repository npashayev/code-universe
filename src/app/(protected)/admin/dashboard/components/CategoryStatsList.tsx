import { PlanetCategory } from '@/types/planet';
import { categoryOptions } from '@/lib/constants/reactSelectOptions';
import Link from 'next/link';
import PlanetStats from '@/components/shared/PlanetStats';

export interface CategoryStatsItem {
  category: PlanetCategory;
  total: number;
  published: number;
  drafts: number;
}

interface Props {
  items: CategoryStatsItem[];
}

const CategoryStatsList = ({ items }: Props) => {
  return (
    <ul className="space-y-3 pt-12 pb-24">
      {items.map(item => {
        const option = categoryOptions.find(o => o.value === item.category);
        const label = option?.label ?? item.category;
        return (
          <li key={item.category}>
            <Link
              href={`/admin/roadmap?category=${item.category}`}
              className="group flex items-center justify-between gap-6 py-4 px-6 rounded-2xl border transition-all duration-300 bg-orange-500/10 border-white/20 opacity-90 hover:opacity-100 hover:border-orange-500/50 text-white"
            >
              <h3 className="text-lg font-bold tracking-tight text-white">
                {label}
              </h3>

              <PlanetStats total={item.total} published={item.published} drafts={item.drafts} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default CategoryStatsList;
