import type { PlanetListStats } from '@/lib/planet/getPlanetList';

const PlanetStats = ({ total, published, drafts }: PlanetListStats) => {
  return (
    <div className="flex items-center gap-8 shrink-0">
      <div className="flex flex-col text-right">
        <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
          Total
        </span>
        <span className="text-xl font-mono font-bold text-white leading-none">
          {total}
        </span>
      </div>
      <div className="w-px h-8 bg-white/20" />
      <div className="flex flex-col text-right">
        <span className="text-[10px] text-green-400 uppercase font-black tracking-tighter">
          Published
        </span>
        <span className="text-xl font-mono font-bold text-green-300 leading-none">
          {published}
        </span>
      </div>
      <div className="w-px h-8 bg-white/20" />
      <div className="flex flex-col text-right">
        <span className="text-[10px] text-orange-400 uppercase font-black tracking-tighter">
          Drafts
        </span>
        <span className="text-xl font-mono font-bold text-orange-300 leading-none">
          {drafts}
        </span>
      </div>
    </div>
  );
};

export default PlanetStats;
