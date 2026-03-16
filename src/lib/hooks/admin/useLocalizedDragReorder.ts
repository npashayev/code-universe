import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Updater } from 'use-immer';
import {
  CreatePlanetData,
  LocalizedPlanetData,
  SupportedLanguage,
} from '@/types/planet';
import { updateLocalizedArray } from '@/lib/utils/updateLocalizedArray';

type ReorderableKey =
  | 'tags'
  | 'researchTopics'
  | 'questions'
  | 'contents'
  | 'resources';

export const useLocalizedDragReorder =
  (
    setPlanetData: Updater<CreatePlanetData>,
    locale: SupportedLanguage,
    key: ReorderableKey,
  ) =>
  (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPlanetData(draft => {
      const arr = (draft.localized[locale][key] ?? []) as { id: string }[];
      const sorted = arrayMove(
        arr,
        arr.findIndex(item => item.id === active.id),
        arr.findIndex(item => item.id === over.id),
      );
      updateLocalizedArray(
        draft,
        locale,
        key,
        sorted as LocalizedPlanetData[ReorderableKey],
      );
    });
  };
