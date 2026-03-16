import { SupportedLanguage } from '@/types/planet';
import { MoveVertical } from 'lucide-react';
import { Updater } from 'use-immer';
import { cn } from '@/lib/utils/cn';
import DeletePlanetButton from '@/components/admin/ui/DeletePlanetButton';
import UpdateLink from '@/components/admin/ui/UpdateLink';
import { AdminPlanetSummary } from '@/lib/planet/getPlanetList';
import { StatusUpdateSelector } from '@/components/admin/Selectors';

interface Props {
  locale: SupportedLanguage;
  planet: AdminPlanetSummary;
  setOrderedPlanets: Updater<AdminPlanetSummary[]>;
}

const Planet = ({ planet, setOrderedPlanets, locale }: Props) => {
  const { name, tags } = planet.localized[locale];
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
              {name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {tags.map(tag => (
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
          <UpdateLink href={`/admin/planet/update/${planet.id}`} />
          <DeletePlanetButton planetId={planet.id} />
        </div>
      </div>
    </div>
  );
};

export default Planet;
