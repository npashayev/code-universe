import {
  RemoveContentFn,
  UpdateContentFn,
} from '@/lib/hooks/useLocalizedContent';
import { PlanetContent } from '@/types/planet';
import { Trash2 } from 'lucide-react';

interface Props {
  idx: number;
  content: PlanetContent;
  onRemove: RemoveContentFn;
  onUpdate: UpdateContentFn;
}

const ContentHeading = ({ idx, content, onRemove, onUpdate }: Props) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-slate-500">
          #{idx + 1}
        </div>
        <span className="text-xs uppercase font-black text-orange-500 tracking-[0.2em]">
          {content.type}
        </span>
        <div className="h-4 w-px bg-white/10 mx-2" />
        <div className="flex flex-col">
          <label className="text-[9px] text-slate-600 uppercase font-bold mb-1">
            Preview Label
          </label>
          <input
            type="text"
            placeholder="Label..."
            value={content.label || ''}
            onChange={e => {
              const trimmedValue = e.target.value.trimStart();
              onUpdate(content.id, { label: trimmedValue });
            }}
            className="bg-transparent border-none outline-none text-white font-bold p-0 placeholder:text-slate-700"
          />
        </div>
      </div>
      <button
        onClick={() => onRemove(content.id)}
        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default ContentHeading;
