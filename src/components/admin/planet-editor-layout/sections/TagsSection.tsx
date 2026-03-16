import { TagIcon } from 'lucide-react';
import { useState } from 'react';
import type { Updater } from 'use-immer';

import type { CreatePlanetData, PlanetTag, SupportedLanguage } from '@/types/planet';
import { useLocalizedDragReorder } from '@/lib/hooks/admin/useLocalizedDragReorder';
import SortableList from '@/components/admin/planet-editor-layout/SortableList';
import { cn } from '@/lib/utils/cn';

import SectionHeader from '../shared/SectionHeader';
import Input from '../shared/Input';
import ListElement from '../shared/ListElement';
import AddButton from '../shared/AddButton';

interface Props {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

const TagsSection = ({ planetData, setPlanetData, locale }: Props) => {
  const [currentTag, setCurrentTag] = useState('');
  const { tags } = planetData.localized[locale];

  const addTag = () => {
    if (!currentTag.trim()) return;

    setPlanetData((draft) => {
      draft.localized[locale].tags.push({
        id: crypto.randomUUID(),
        tag: currentTag,
      });
    });

    setCurrentTag('');
  };

  const removeTag = (id: string) =>
    setPlanetData((draft) => {
      draft.localized[locale].tags = draft.localized[locale].tags.filter(
        (t) => t.id !== id,
      );
    });

  const handleDragEnd = useLocalizedDragReorder(setPlanetData, locale, 'tags');

  return (
    <section className="admin-page-section">
      <SectionHeader>
        <TagIcon size={15} />
        <h2>Tags</h2>
      </SectionHeader>

      <div className="flex gap-2 min-w-0">
        <div className="relative flex-1 min-w-0">
          <Input
            placeholder="Add tag"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTag();
            }}
          />
        </div>
        <AddButton
          onClick={addTag}
          disabled={currentTag.trim() === ''}
          className="shrink-0"
        >
          Add
        </AddButton>
      </div>

      <SortableList<PlanetTag>
        id="tag-sortable-list"
        elements={tags}
        handleDragEnd={handleDragEnd}
        renderItem={(tag, idx) => (
          <ListElement
            onRemove={() => removeTag(tag.id)}
            className={cn(idx <= 3 && 'border border-amber-400/30')}
          >
            <span className="block truncate">{tag.tag}</span>
          </ListElement>
        )}
      />

      {tags.length === 0 && (
        <span className="admin-empty-state">No tags assigned yet.</span>
      )}
    </section>
  );
};

export default TagsSection;
