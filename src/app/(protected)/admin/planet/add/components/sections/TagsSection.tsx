import { CreatePlanetData, PlanetTag, SupportedLanguage } from '@/types/planet';
import { TagIcon } from 'lucide-react';
import { useState } from 'react';
import { Updater } from 'use-immer';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { updateLocalizedArray } from '@/lib/utils/updateLocalizedArray';
import SectionHeader from '../shared/SectionHeader';
import Input from '../shared/Input';
import ListElement from '../shared/ListElement';
import AddButton from '../shared/AddButton';
import SortableList from '@/components/shared/SortableList';
import { cn } from '@/lib/utils/cn';

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
    <section className="admin-page-section">
      <SectionHeader>
        <TagIcon size={15} />
        <h2>Tags</h2>
      </SectionHeader>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Add tag"
            value={currentTag}
            onChange={e => setCurrentTag(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') addTag();
            }}
          />
        </div>
        <AddButton onClick={addTag} disabled={currentTag.trim() === ''}>Add</AddButton>
      </div>

      <SortableList<PlanetTag>
        id="tag-sortable-list"
        elements={tags}
        handleDragEnd={handleDragEnd}
        renderItem={(tag, idx) => (
          <ListElement onRemove={() => removeTag(tag.id)} className={cn(idx <= 3 && 'border border-amber-400/30')}>
            {tag.tag}
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
