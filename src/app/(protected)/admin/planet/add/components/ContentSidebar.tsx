import { createDefaultContent } from '@/lib/utils/createDefaultContent';
import { CONTENT_TYPE, ContentType, CreatePlanetData } from '@/types/planet';
import { SupportedLanguage } from '@/types/planet';
import { ChevronDown, Database, Layout, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Updater } from 'use-immer';
import Select from 'react-select';
import { getAdminPageSelectStyles } from '@/lib/utils/getAdminPageSelectStyles';

interface Props {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

interface ContentTypeOption {
  label: string;
  value: ContentType;
}

const contentTypeOptions: ContentTypeOption[] = [
  {
    label: 'Text',
    value: CONTENT_TYPE.text,
  },
  {
    label: 'Implementation task',
    value: CONTENT_TYPE.implementationTask,
  },
  {
    label: 'Code',
    value: CONTENT_TYPE.code,
  },
  {
    label: 'HTML element',
    value: CONTENT_TYPE.htmlElement,
  },
  {
    label: 'Image',
    value: CONTENT_TYPE.image,
  },
];

const ContentSidebar = ({ planetData, setPlanetData, locale }: Props) => {
  const { contents } = planetData.localized[locale];

  const [selectedContentType, setSelectedContentType] = useState(
    contentTypeOptions[0],
  );

  const addContent = () => {
    setPlanetData(draft => {
      const contents = draft.localized[locale].contents;
      const newContent = createDefaultContent(
        selectedContentType.value,
        contents.length + 1,
      );
      contents.push(newContent);
    });
  };

  const removeContent = (id: string) => {
    setPlanetData(draft => {
      draft.localized[locale].contents = draft.localized[
        locale
      ].contents.filter(c => c.id !== id);
    });
  };

  return (
    <div className="lg:col-span-4 space-y-8">
      <section className="bg-white/3 border border-white/10 rounded-2xl p-6 sticky top-28 shadow-2xl">
        <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
          <Layout size={14} />
          <span>Planet Content</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              New Content Module
            </label>
            <div className="relative group">
              <Select<ContentTypeOption, false>
                instanceId="content-type-select"
                value={selectedContentType}
                options={contentTypeOptions}
                onChange={option => {
                  if (!option) return;
                  setSelectedContentType(option);
                }}
                styles={getAdminPageSelectStyles<ContentTypeOption>({
                  controlStyles: {
                    paddingInlineStart: '12px',
                    paddingBlock: '9px',
                    width: '100%',
                  },
                })}
                isSearchable={false}
              />

              <ChevronDown
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
            </div>
          </div>

          <button
            onClick={addContent}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 rounded-xl text-white transition-all cursor-pointer font-bold text-sm"
          >
            <Plus size={18} />
            Add Module
          </button>
        </div>

        {/* Quick List of Added Contents */}
        {contents.length > 0 && (
          <div className="mt-8 space-y-3 max-h-100 overflow-y-auto pr-4 custom-scrollbar border-t border-white/5 pt-6">
            <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-4">
              Discovery Outline
            </p>
            {contents.map(content => (
              <Link
                key={content.id}
                href={`#${content.id}`}
                className="flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-white font-bold truncate group-hover:text-orange-500 transition-colors">
                    {content.label}
                  </span>
                  <span className="text-[12px] uppercase font-mono text-slate-500 tracking-tighter mt-0.5">
                    {content.type}
                  </span>
                </div>
                <button
                  onClick={e => {
                    e.preventDefault();
                    e.preventDefault();
                    removeContent(content.id);
                  }}
                  className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </Link>
            ))}
          </div>
        )}

        {contents.length === 0 && (
          <div className="mt-8 py-10 flex flex-col items-center justify-center text-slate-700 border border-dashed border-white/10 rounded-2xl">
            <Database size={24} strokeWidth={1} className="mb-2" />
            <span className="text-[10px] uppercase tracking-widest font-black text-center">
              No modules in
              <br />
              this system
            </span>
          </div>
        )}
      </section>
    </div>
  );
};

export default ContentSidebar;
