// useLocalizedContent.ts
import { useCallback } from 'react';
import { Updater } from 'use-immer';
import {
  CreatePlanetData,
  PlanetContent,
  ContentType,
  SupportedLanguage,
} from '@/types/planet';
import { createDefaultContent } from '../utils/createDefaultContent';

interface UseLocalizedContentOptions {
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

export type AddContentFn = (contentType: ContentType) => void;
export type RemoveContentFn = (id: string) => void;
export type UpdateContentFn = (
  id: string,
  updates: Partial<PlanetContent>,
) => void;

export const useLocalizedContent = ({
  setPlanetData,
  locale,
}: UseLocalizedContentOptions) => {
  const addContent = useCallback(
    (contentType: ContentType) => {
      setPlanetData(draft => {
        const contents = draft.localized[locale].contents;
        const newContent = createDefaultContent(contentType, contents.length);
        contents.push(newContent);
      });
    },
    [setPlanetData, locale],
  );

  const removeContent = useCallback(
    (id: string) => {
      setPlanetData(draft => {
        draft.localized[locale].contents = draft.localized[
          locale
        ].contents.filter(c => c.id !== id);
      });
    },
    [setPlanetData, locale],
  );

  const updateContent = useCallback(
    (id: string, updates: Partial<PlanetContent>) => {
      setPlanetData(draft => {
        const content = draft.localized[locale].contents.find(c => c.id === id);
        if (!content) return;
        Object.assign(content, updates);
      });
    },
    [setPlanetData, locale],
  );

  return {
    addContent,
    removeContent,
    updateContent,
  };
};
