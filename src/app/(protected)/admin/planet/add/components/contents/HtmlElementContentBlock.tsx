import {
  CreatePlanetData,
  HtmlElementContent,
  SupportedLanguage,
} from '@/types/planet';
import { Updater } from 'use-immer';

interface Props {
  content: HtmlElementContent;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

const HtmlElementContentBlock = ({ content, setPlanetData, locale }: Props) => {
  const updateContent = (id: string, updates: Partial<HtmlElementContent>) => {
    setPlanetData(draft => {
      const content = draft.localized[locale].contents.find(c => c.id === id);
      if (!content) return;
      Object.assign(content, updates);
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
          Title (Optional)
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => updateContent(content.id, { title: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
        />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-[12px] text-slate-500 uppercase font-bold">
            HTML code
          </label>
          <textarea
            value={content.element.html}
            onChange={e =>
              updateContent(content.id, {
                element: { ...content.element, html: e.target.value },
              })
            }
            className="w-full bg-[#0d0d1e] border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono h-32 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[12px] text-slate-500 uppercase font-bold">
            CSS code (Optional)
          </label>
          <textarea
            value={content.element.css || ''}
            onChange={e =>
              updateContent(content.id, {
                element: { ...content.element, css: e.target.value },
              })
            }
            className="w-full bg-[#0d0d1e] border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono h-32 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-[12px] text-slate-500 uppercase font-bold">
            Javascript code (Optional)
          </label>
          <textarea
            value={content.element.js || ''}
            onChange={e =>
              updateContent(content.id, {
                element: { ...content.element, js: e.target.value },
              })
            }
            className="w-full bg-[#0d0d1e] border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono h-32 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default HtmlElementContentBlock;
