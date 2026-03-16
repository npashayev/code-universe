import { useState } from 'react';
import {
  CreatePlanetData,
  ResearchTopic,
  SupportedLanguage,
} from '@/types/planet';
import { Updater } from 'use-immer';
import { Search } from 'lucide-react';
import { useLocalizedDragReorder } from '@/lib/hooks/admin/useLocalizedDragReorder';
import ListElement from '../shared/ListElement';
import Input from '../shared/Input';
import SectionHeader from '../shared/SectionHeader';
import AddButton from '../shared/AddButton';
import SortableList from '@/components/admin/planet-editor-layout/SortableList';

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

    setPlanetData((draft) => {
      draft.localized[locale].researchTopics.push({
        id: crypto.randomUUID(),
        topic: currentTopic,
      });
    });

    setCurrentTopic('');
  };

  const removeTopic = (id: string) => {
    setPlanetData((draft) => {
      draft.localized[locale].researchTopics = draft.localized[
        locale
      ].researchTopics.filter((t) => t.id !== id);
    });
  };

  const handleDragEnd = useLocalizedDragReorder(
    setPlanetData,
    locale,
    'researchTopics',
  );

  return (
    <section className="admin-page-section">
      <SectionHeader>
        <Search size={14} />
        <h2>Research Topics</h2>
      </SectionHeader>

      <div className="flex gap-2 min-w-0">
        <div className="flex-1 min-w-0">
          <Input
            value={currentTopic}
            onChange={(e) => setCurrentTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addResearchTopic()}
            placeholder="Add research topic"
          />
        </div>
        <AddButton
          onClick={addResearchTopic}
          disabled={!currentTopic.trim()}
          className="shrink-0"
        >
          Add
        </AddButton>
      </div>

      <SortableList<ResearchTopic>
        id="research-topic-sortable-list"
        elements={researchTopics}
        handleDragEnd={handleDragEnd}
        renderItem={(topic) => (
          <ListElement onRemove={() => removeTopic(topic.id)}>
            <span className="block truncate">{topic.topic}</span>
          </ListElement>
        )}
      />

      {researchTopics.length === 0 && (
        <span className="admin-empty-state">
          No research topics assigned yet.
        </span>
      )}
    </section>
  );
};

export default ResearchTopicsSection;
