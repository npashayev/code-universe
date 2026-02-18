import { PlanetSummary, SupportedLanguage } from '@/types/planet';
import { Edit, MoveVertical } from 'lucide-react';
import Link from 'next/link';
import { Updater } from 'use-immer';
import { StatusUpdateSelector } from '../../planet/add/components/Selectors';
import RemoveButton from '../../planet/add/components/shared/RemoveButton';
import { cn } from '@/lib/utils/cn';

interface Props {
  locale: SupportedLanguage;
  planet: PlanetSummary;
  setOrderedPlanets: Updater<PlanetSummary[]>;
}

const Planet = ({ planet, setOrderedPlanets, locale }: Props) => {
  const localizedData = planet.localized[locale];
  const isPublished = planet.status === 'published';

  return (
    <div
      className={cn(
        'group flex items-center justify-between gap-6 p-4 rounded-2xl border transition-all duration-300 bg-white/6 border-white/20 opacity-90 hover:opacity-100 hover:border-slate-400/40 text-white',
        isPublished &&
          'bg-orange-500/15 border-orange-500/30 hover:border-orange-500/50',
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="cursor-grab active:cursor-grabbing text-slate-400 group-hover:text-slate-300 transition-colors px-2">
          <MoveVertical size={18} />
        </div>

        <div className="shrink-0">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold border bg-slate-500/15 border-slate-500/25 text-slate-400',
              isPublished &&
                'bg-orange-500/20 border-orange-500/35 text-orange-300',
            )}
          >
            {planet.step.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex-1 min-w-0 text-left cursor-pointer group/title">
            <h3 className="text-lg font-bold tracking-tight truncate transition-colors text-white">
              {localizedData.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {localizedData.tags.map(tag => (
              <span
                key={tag.id}
                className="text-[10px] uppercase font-black tracking-widest text-slate-400"
              >
                #{tag.tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6 shrink-0">
        <StatusUpdateSelector
          planet={planet}
          changePlanetStatus={setOrderedPlanets}
        />
        <div className="flex items-center gap-1">
          <Link
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/15 rounded-lg transition-all"
            href={`/admin/planet/edit/${planet.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <Edit size={18} />
          </Link>

          <RemoveButton />
        </div>
      </div>
    </div>
  );
};

export default Planet;
