import {
  CONTENT_TYPE,
  ContentType,
  CreatePlanetData,
  PlanetContent,
} from '@/types/planet';
import { SupportedLanguage } from '@/types/planet';
import { ChevronDown, Database, Layout, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Updater } from 'use-immer';
import Select from 'react-select';
import { getAdminPageSelectStyles } from '@/lib/utils/getAdminPageSelectStyles';
import { useLocalizedContent } from '@/lib/hooks/useLocalizedContent';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { SortableItem } from '@/components/shared/SortableItem';
import { updateLocalizedArray } from '@/lib/utils/updateLocalizedArray';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface Props {
  contents: PlanetContent[];
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

interface ContentTypeOption {
  label: string;
  value: ContentType;
}

const contentTypeOptions: ContentTypeOption[] = [
  { label: 'Text', value: CONTENT_TYPE.text },
  { label: 'Implementation task', value: CONTENT_TYPE.implementationTask },
  { label: 'Code', value: CONTENT_TYPE.code },
  { label: 'HTML element', value: CONTENT_TYPE.htmlElement },
  { label: 'Image', value: CONTENT_TYPE.image },
];

const ContentSidebar = ({ contents, setPlanetData, locale }: Props) => {
  const [selectedContentType, setSelectedContentType] = useState(
    contentTypeOptions[0],
  );
  const { addContent, removeContent: removeContentFromHook } =
    useLocalizedContent({
      setPlanetData,
      locale,
    });

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPlanetData(draft => {
      const sorted = arrayMove(
        draft.localized[locale].contents,
        draft.localized[locale].contents.findIndex(c => c.id === active.id),
        draft.localized[locale].contents.findIndex(c => c.id === over.id),
      );
      updateLocalizedArray(draft, locale, 'contents', sorted);
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
                onChange={option => option && setSelectedContentType(option)}
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
            onClick={() => addContent(selectedContentType.value)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 rounded-xl text-white transition-all cursor-pointer font-bold text-sm"
          >
            <Plus size={18} />
            Add Module
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          {contents.length > 0 ? (
            <SortableContext
              items={contents.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="overflow-hidden mt-8 space-y-3 max-h-100 overflow-y-auto pr-4 custom-scrollbar border-t border-white/5 pt-6">
                <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-4">
                  Discovery Outline
                </p>
                {contents.map(content => (
                  <SortableItem key={content.id} id={content.id}>
                    <Link
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
                          removeContentFromHook(content.id);
                        }}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Link>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          ) : (
            <div className="mt-8 py-10 flex flex-col items-center justify-center text-slate-700 border border-dashed border-white/10 rounded-2xl">
              <Database size={24} strokeWidth={1} className="mb-2" />
              <span className="text-[10px] uppercase tracking-widest font-black text-center">
                No modules in
                <br />
                this system
              </span>
            </div>
          )}
        </DndContext>
      </section>
    </div>
  );
};

export default ContentSidebar;
