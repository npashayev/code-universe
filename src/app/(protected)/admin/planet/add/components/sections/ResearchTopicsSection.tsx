import { useState } from 'react';
import {
  CreatePlanetData,
  ResearchTopic,
  SupportedLanguage,
} from '@/types/planet';
import { Updater } from 'use-immer';
import { Search } from 'lucide-react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { updateLocalizedArray } from '@/lib/utils/updateLocalizedArray';
import ListElement from '../shared/ListElement';
import Input from '../shared/Input';
import SectionHeader from '../shared/SectionHeader';
import AddButton from '../shared/AddButton';
import SortableList from '@/components/shared/SortableList';

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
    <section className="admin-page-section">
      <SectionHeader>
        <Search size={14} />
        <h2>Research Topics</h2>
      </SectionHeader>

      <div className="flex gap-2">
        <Input
          value={currentTopic}
          onChange={e => setCurrentTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addResearchTopic()}
          placeholder="Add research topic"
        />
        <AddButton onClick={addResearchTopic}>Add</AddButton>
      </div>

      <SortableList<ResearchTopic>
        id="research-topic-sortable-list"
        elements={researchTopics}
        handleDragEnd={handleDragEnd}
        renderItem={topic => (
          <ListElement onRemove={() => removeTopic(topic.id)}>
            {topic.topic}
          </ListElement>
        )}
      />

      {researchTopics.length === 0 && (
        <span className="text-slate-600 text-xs italic">
          No research topics assigned yet.
        </span>
      )}
    </section>
  );
};

export default ResearchTopicsSection;
