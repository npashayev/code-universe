import { ChevronDown, Eye, Globe, Languages, Upload } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-60 bg-[#030213]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <Globe className="text-orange-500" size={18} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Create New Planet
            </h1>
          </div>

          <div className="h-8 w-px bg-white/10 hidden md:block" />

          <div className="hidden md:flex items-center gap-4">
            {/* Language Selection */}
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-orange-500 transition-colors">
                <Languages size={14} />
              </div>
              <select
                value="test"
                onChange={() => console.log('changed')}
                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg pl-9 pr-8 py-1.5 text-xs font-bold text-white appearance-none cursor-pointer transition-all outline-none"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                size={12}
              />
            </div>

            {/* JSON Upload Trigger */}
            <button
              onClick={() => console.log('worked')}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-all cursor-pointer"
            >
              <Upload size={14} />
              Import JSON
            </button>

            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-orange-500 transition-colors">
                <Eye size={14} />
              </div>
              <select
                value="test"
                onChange={() => console.log('changed')}
                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg pl-9 pr-8 py-1.5 text-xs font-bold text-white appearance-none cursor-pointer transition-all outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                size={12}
              />
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer text-sm">
          Add Planet
        </button>
      </div>
    </header>
  );
};

export default Header;
