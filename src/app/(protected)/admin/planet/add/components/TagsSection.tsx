import { CreatePlanetData, SupportedLanguage } from '@/types/planet';
import { TagIcon, X } from 'lucide-react';
import { useState } from 'react';
import { Updater } from 'use-immer';

interface Props {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

const TagsSection = ({ planetData, setPlanetData, locale }: Props) => {
  const [currentTag, setCurrentTag] = useState('');

  const addTag = () => {
    setPlanetData(draft => {
      draft.localized[locale].tags.push({
        id: crypto.randomUUID(),
        tag: currentTag,
      });
    });
    setCurrentTag('');
  };

  const removeTag = (id: string) =>
    setPlanetData(draft => {
      draft.localized[locale].tags = draft.localized[locale].tags.filter(
        t => t.id !== id,
      );
    });

  return (
    <section className="bg-white/3 border border-white/10 rounded-2xl p-6 space-y-3">
      <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-4">
        <TagIcon size={14} />
        <span>Tags</span>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={currentTag || ''}
            onChange={e => setCurrentTag(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                addTag();
              }
            }}
            placeholder="Add tag"
            className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white"
          />
        </div>
        <button
          onClick={addTag}
          className="px-6 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white font-bold text-sm"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {planetData.localized[locale].tags.map(tag => (
          <span
            key={tag.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-xs font-bold group"
          >
            {tag.tag}
            <button
              onClick={() => removeTag(tag.id)}
              className="text-orange-500/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        {planetData.localized[locale].tags.length === 0 && (
          <span className="text-slate-600 text-xs italic">
            No tags assigned yet.
          </span>
        )}
      </div>
    </section>
  );
};

export default TagsSection;
