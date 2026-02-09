import {
  CreatePlanetData,
  ImplementationTaskContent,
  SupportedLanguage,
} from '@/types/planet';
import { Updater } from 'use-immer';

interface Props {
  content: ImplementationTaskContent;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

const ImplementationTaskContentBlock = ({
  content,
  setPlanetData,
  locale,
}: Props) => {
  const updateContent = (
    id: string,
    updates: Partial<ImplementationTaskContent>,
  ) => {
    setPlanetData(draft => {
      const content = draft.localized[locale].contents.find(c => c.id === id);
      if (!content) return;
      Object.assign(content, updates);
    });
  };
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Task Title (Optional)
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => updateContent(content.id, { title: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Task Instructions
        </label>
        <textarea
          value={content.task}
          onChange={e => updateContent(content.id, { task: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm min-h-30 outline-none"
        />
      </div>
    </div>
  );
};

export default ImplementationTaskContentBlock;
