import { PlanetCategory } from '@/types/planet';
import { categoryOptions } from '@/lib/constants/reactSelectOptions';
import Link from 'next/link';

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
              className="group flex items-center justify-between gap-6 py-4 px-6 rounded-2xl border transition-all duration-300 bg-white/1 border-white/5 opacity-60 hover:opacity-100 hover:border-slate-500/30 text-white bg-orange-400/5 border-white/10 hover:border-orange-500/30"
            >
              <h3 className="text-lg font-bold tracking-tight text-white">
                {label}
              </h3>
              <div className="flex items-center gap-8 shrink-0">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">
                    Total
                  </span>
                  <span className="text-xl font-mono font-bold text-white leading-none">
                    {item.total}
                  </span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-green-500/70 uppercase font-black tracking-tighter">
                    Published
                  </span>
                  <span className="text-xl font-mono font-bold text-green-400 leading-none">
                    {item.published}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-orange-500/70 uppercase font-black tracking-tighter">
                    Drafts
                  </span>
                  <span className="text-xl font-mono font-bold text-orange-400 leading-none">
                    {item.drafts}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default CategoryStatsList;
