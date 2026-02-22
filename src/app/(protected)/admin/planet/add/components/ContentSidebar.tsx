import { CreatePlanetData, PlanetContent, SupportedLanguage } from '@/types/planet';
import { Database, Layout, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Updater } from 'use-immer';
import { useLocalizedContent } from '@/lib/hooks/useLocalizedContent';
import { useLocalizedDragReorder } from '@/lib/hooks/useLocalizedDragReorder';
import ListElement from './shared/ListElement';
import { ContentTypeSelector } from './Selectors';
import { contentTypeOptions } from '@/lib/constants/reactSelectOptions';
import { cn } from '@/lib/utils/cn';
import SectionHeader from './shared/SectionHeader';
import AddButton from './shared/AddButton';
import SortableList from '@/components/shared/SortableList';

interface Props {
  contents: PlanetContent[];
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

const ContentSidebar = ({ contents, setPlanetData, locale }: Props) => {
  const [selectedContentType, setSelectedContentType] = useState(
    contentTypeOptions[0],
  );
  const { addContent, removeContent: removeContentFromHook } =
    useLocalizedContent({
      setPlanetData,
      locale,
    });
  const handleDragEnd = useLocalizedDragReorder(setPlanetData, locale, 'contents');

  return (
    <aside className={cn('admin-page-section', 'sticky top-28 shadow-2xl shrink-0 w-80')}>
      <SectionHeader>
        <Layout size={14} />
        <h2>Planet Content</h2>
      </SectionHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            New Content Module
          </div>
          <ContentTypeSelector
            value={selectedContentType}
            onChange={setSelectedContentType}
          />
        </div>

        <AddButton
          onClick={() => addContent(selectedContentType.value)}
          className="w-full flex items-center justify-center gap-2 py-3 hover:bg-orange-500/30 border border-white/18 hover:border-orange-500/50"
        >
          <Plus size={18} />
          Add Module
        </AddButton>
      </div>

      {contents.length > 0 ? (
        <div className="overflow-hidden mt-8 space-y-3 max-h-100 overflow-y-auto pr-4 custom-scrollbar border-t border-white/12 pt-6">
          <h3 className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-4">
            Discovery Outline
          </h3>
          <SortableList<PlanetContent>
            id="content-sortable-list"
            elements={contents}
            handleDragEnd={handleDragEnd}
            renderItem={content => (
              <ListElement
                className="py-3"
                onRemove={() => removeContentFromHook(content.id)}
              >
                <Link href={`#${content.id}`} className="flex flex-col">
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-bold truncate group-hover:text-orange-500 transition-colors">
                      {content.label}
                    </span>
                    <span className="text-[12px] uppercase font-mono text-slate-400 tracking-tighter mt-0.5">
                      {content.type}
                    </span>
                  </div>
                </Link>
              </ListElement>
            )}
          />
        </div>
      ) : (
        <div className="mt-8 py-10 flex flex-col items-center justify-center text-slate-600 border border-dashed border-white/18 rounded-2xl">
          <Database size={24} strokeWidth={1} className="mb-2" />
          <span className="text-[10px] uppercase tracking-widest font-black text-center">
            No modules in
            <br />
            this system
          </span>
        </div>
      )}
    </aside>
  );
};

export default ContentSidebar;
