import { PlanetFullListResponse } from '@/types/planet';
import { ChevronDown, Filter, Globe, Plus } from 'lucide-react';

export interface Props {
  data: PlanetFullListResponse;
}

const Header = () => {
  return (
    <header className="sticky top-0 z-60 bg-[#030213]/80 backdrop-blur-xl border-b border-white/5 py-6 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-lg shadow-orange-500/10 md:ml-28">
              <Globe className="text-orange-500" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {selectedCategory} Destinations
              </h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">
                Knowledge Cosmos Registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNewPlanet}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer text-sm"
            >
              <Plus size={16} />
              New Planet
            </button>
          </div>
        </div>

        {/* Stats & Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">
                Total
              </span>
              <span className="text-xl font-mono font-bold text-white leading-none">
                {totalCount}
              </span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] text-green-500/70 uppercase font-black tracking-tighter">
                Published
              </span>
              <span className="text-xl font-mono font-bold text-green-400 leading-none">
                {publishedCount}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-orange-500/70 uppercase font-black tracking-tighter">
                Drafts
              </span>
              <span className="text-xl font-mono font-bold text-orange-400 leading-none">
                {draftCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            {/* <div className="relative group flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-orange-500 transition-colors"
                size={14}
              />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-orange-500/50 rounded-xl pl-9 pr-4 py-2 text-sm outline-none transition-all placeholder:text-slate-600"
              />
            </div> */}

            {/* Filter Dropdown */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Filter size={14} />
              </div>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value as any)}
                className="appearance-none bg-white/5 border border-white/10 hover:border-white/20 rounded-xl pl-9 pr-10 py-2 text-sm font-bold text-white cursor-pointer outline-none transition-all"
              >
                <option value="all">All Planets</option>
                <option value="published">Published Only</option>
                <option value="draft">Drafts Only</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                size={14}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
