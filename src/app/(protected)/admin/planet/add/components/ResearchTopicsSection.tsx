import { CreatePlanetData, SupportedLanguage } from '@/types/planet';
import { Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Updater } from 'use-immer';

interface Props {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

const ResearchTopicsSection = ({
  planetData,
  setPlanetData,
  locale,
}: Props) => {
  const [currentTopic, setCurrentTopic] = useState<string>('');

  const addResearchTopic = () => {
    setPlanetData(draft => {
      draft.localized[locale].researchTopics.push({
        id: crypto.randomUUID(),
        topic: currentTopic,
      });
    });
    setCurrentTopic('');
  };

  const removeTopic = (id: string) => {
    setPlanetData(draft => {
      draft.localized[locale].researchTopics = draft.localized[
        locale
      ].researchTopics.filter(t => t.id !== id);
    });
  };

  return (
    <section className="bg-white/3 border border-white/10 rounded-2xl p-6 space-y-3">
      <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-4">
        <Search size={14} />
        <span>Research Topics</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={currentTopic || ''}
          onChange={e => setCurrentTopic(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              addResearchTopic();
            }
          }}
          placeholder="Add research topic"
          className="flex-1 bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white"
        />
        <button
          onClick={addResearchTopic}
          className="px-6 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white font-bold text-sm"
        >
          Add Topic
        </button>
      </div>
      <div className="space-y-2">
        {planetData.localized[locale].researchTopics.map(topic => (
          <div
            key={topic.id}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group"
          >
            <span className="text-sm text-slate-300 font-medium">
              {topic.topic}
            </span>
            <button
              onClick={() => removeTopic(topic.id)}
              className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {planetData.localized[locale].researchTopics.length === 0 && (
          <span className="text-slate-600 text-xs italic">
            No research topics assigned yet.
          </span>
        )}
      </div>
    </section>
  );
};

export default ResearchTopicsSection;
