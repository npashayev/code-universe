/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Draft } from 'immer';

import type {
  CreatePlanetData,
  SupportedLanguage,
  LocalizedPlanetData,
} from '@/types/planet';

export const updateLocalizedArray = <
  K extends keyof LocalizedPlanetData,
  T extends LocalizedPlanetData[K],
>(
  draft: Draft<CreatePlanetData>,
  lang: SupportedLanguage,
  key: K,
  newArray: T,
) => {
  draft.localized[lang][key] = newArray as any;
};
