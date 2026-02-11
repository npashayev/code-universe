import { useState } from 'react';
import { CreatePlanetData, Resource, SupportedLanguage } from '@/types/planet';
import { Updater } from 'use-immer';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
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
  resources?: Resource[];
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

export const ExternalResourcesSection = ({
  resources,
  setPlanetData,
  locale,
}: Props) => {
  const [currentResource, setCurrentResource] = useState({
    label: '',
    title: '',
    url: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const addResource = () => {
    if (!currentResource.label || !currentResource.url) return;
    setPlanetData(draft => {
      draft.localized[locale].resources?.push({
        id: crypto.randomUUID(),
        ...currentResource,
      });
    });
    setCurrentResource({ label: '', title: '', url: '' });
  };

  const removeResource = (id: string) => {
    setPlanetData(draft => {
      draft.localized[locale].resources = draft.localized[
        locale
      ].resources?.filter(r => r.id !== id);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPlanetData(draft => {
      const sorted = arrayMove(
        draft.localized[locale].resources || [],
        draft.localized[locale].resources?.findIndex(r => r.id === active.id) ||
          0,
        draft.localized[locale].resources?.findIndex(r => r.id === over.id) ||
          0,
      );
      updateLocalizedArray(draft, locale, 'resources', sorted);
    });
  };

  const isValid = !!currentResource.label && !!currentResource.url;

  return (
    <section className="bg-white/3 border border-white/10 rounded-2xl p-6 space-y-3">
      <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-4">
        <BookOpen size={14} />
        <span>External Resources</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          value={currentResource.title}
          onChange={e =>
            setCurrentResource({ ...currentResource, title: e.target.value })
          }
          onKeyDown={e => e.key === 'Enter' && addResource()}
          placeholder="Title (Optional)"
          className="bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none text-sm"
        />
        <input
          type="text"
          value={currentResource.label}
          onChange={e =>
            setCurrentResource({ ...currentResource, label: e.target.value })
          }
          onKeyDown={e => e.key === 'Enter' && addResource()}
          placeholder="Link label"
          className="bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none text-sm"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={currentResource.url}
            onChange={e =>
              setCurrentResource({ ...currentResource, url: e.target.value })
            }
            onKeyDown={e => e.key === 'Enter' && addResource()}
            placeholder="URL"
            className="flex-1 bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none text-sm"
          />
          <button
            onClick={addResource}
            className="px-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white font-bold disabled:bg-white/5 disabled:cursor-not-allowed"
            disabled={!isValid}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        {resources && resources?.length > 0 && (
          <SortableContext
            items={resources.map(r => r.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="overflow-hidden space-y-2">
              {(resources || []).map(res => (
                <SortableItem key={res.id} id={res.id}>
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <BookOpen size={14} className="text-orange-500" />
                      </div>
                      <div>
                        {res.title && (
                          <span className="block text-[12px] text-slate-600 uppercase font-mono tracking-tighter">
                            {res.title}
                          </span>
                        )}
                        <Link
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-400 hover:underline font-medium"
                        >
                          {res.label}
                        </Link>
                      </div>
                    </div>
                    <button
                      onClick={() => removeResource(res.id)}
                      className="text-slate-600 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        )}
        {(!resources || resources.length === 0) && (
          <span className="text-slate-600 text-xs italic">
            No resources assigned yet.
          </span>
        )}
      </DndContext>
    </section>
  );
};

export default ExternalResourcesSection;
