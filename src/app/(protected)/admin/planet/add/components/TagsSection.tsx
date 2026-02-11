import { CreatePlanetData, SupportedLanguage } from '@/types/planet';
import { TagIcon, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Updater } from 'use-immer';
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
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

const TagsSection = ({ planetData, setPlanetData, locale }: Props) => {
  const [currentTag, setCurrentTag] = useState('');
  const { tags } = planetData.localized[locale];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    if (tags.length >= 4) {
      alert('You can add up to 4 tags');
      return;
    }
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPlanetData(draft => {
      const sorted = arrayMove(
        draft.localized[locale].tags,
        draft.localized[locale].tags.findIndex(t => t.id === active.id),
        draft.localized[locale].tags.findIndex(t => t.id === over.id),
      );
      updateLocalizedArray(draft, locale, 'tags', sorted);
    });
  };

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
            value={currentTag}
            onChange={e => setCurrentTag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTag(currentTag)}
            placeholder="Add tag"
            className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white"
          />
        </div>
        <button
          onClick={() => addTag(currentTag)}
          className="px-6 bg-white/10 disabled:cursor-not-allowed disabled:bg-white/5 hover:bg-white/20 rounded-xl transition-all text-white font-bold text-sm"
        >
          Add
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        {tags.length > 0 && (
          <SortableContext
            items={tags.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="overflow-hidden space-y-2">
              {tags.map(tag => (
                <SortableItem key={tag.id} id={tag.id}>
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group">
                    <span className="text-sm text-slate-300 font-medium">
                      {tag.tag}
                    </span>
                    <button
                      onClick={() => removeTag(tag.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        )}
      </DndContext>

      {tags.length === 0 && (
        <span className="text-slate-600 text-xs italic">
          No tags assigned yet.
        </span>
      )}
    </section>
  );
};

export default TagsSection;
