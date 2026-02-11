import { useState } from 'react';
import {
  CreatePlanetData,
  ResearchTopic,
  SupportedLanguage,
} from '@/types/planet';
import { Updater } from 'use-immer';
import { Search, Trash2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
  KeyboardSensor,
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
  researchTopics: ResearchTopic[];
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

export const ResearchTopicsSection = ({
  researchTopics,
  setPlanetData,
  locale,
}: Props) => {
  const [currentTopic, setCurrentTopic] = useState<string>('');

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // allows to click on remove button
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const addResearchTopic = () => {
    if (!currentTopic.trim()) return;
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPlanetData(draft => {
      const sorted = arrayMove(
        draft.localized[locale].researchTopics,
        draft.localized[locale].researchTopics.findIndex(
          t => t.id === active.id,
        ),
        draft.localized[locale].researchTopics.findIndex(t => t.id === over.id),
      );

      updateLocalizedArray(draft, locale, 'researchTopics', sorted);
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
          value={currentTopic}
          onChange={e => setCurrentTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addResearchTopic()}
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={researchTopics.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="overflow-hidden space-y-2">
            {researchTopics.map(topic => (
              <SortableItem key={topic.id} id={topic.id}>
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group">
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
              </SortableItem>
            ))}
          </div>
        </SortableContext>
        {researchTopics.length === 0 && (
          <span className="text-slate-600 text-xs italic">
            No research topics assigned yet.
          </span>
        )}
      </DndContext>
    </section>
  );
};

export default ResearchTopicsSection;
