import type { Updater } from 'use-immer';
import type { Dispatch, SetStateAction } from 'react';

import type {
  CodeContent,
  CreatePlanetData,
  PlanetCategory,
  TextContent,
} from '@/types/planet';
import type { UpdateContentFn } from '@/lib/hooks/admin/useLocalizedContent';
import type {
  ContentTypeOption,
  ExtendedStatusOption,
  LanguageOption,
  PendingImageOption,
} from '@/types/reactSelectOptions';
import type { AdminPlanetSummary } from '@/lib/planet/getPlanetList';

export interface PlanetDataProps {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
}

export interface CategorySelectorProps {
  category: PlanetCategory;
  onCategoryChange: (category: PlanetCategory) => void;
}

export interface StatusUpdateSelectorProps {
  planet: AdminPlanetSummary;
  changePlanetStatus: Updater<AdminPlanetSummary[]>;
}

export interface LanguageSelectorProps {
  currentLanguage: LanguageOption;
  setCurrentLanguage: Dispatch<React.SetStateAction<LanguageOption>>;
}

export interface ContentTypeSelectorProps {
  value: ContentTypeOption;
  onChange: (opt: ContentTypeOption) => void;
}

export interface TitleLevelSelectorProps {
  content: TextContent;
  onUpdate: UpdateContentFn;
  isDisabled?: boolean;
}

export interface TextVariantSelectorProps {
  content: TextContent;
  onUpdate: UpdateContentFn;
}

export interface ProgrammingLanguageSelectorProps {
  onUpdate: UpdateContentFn;
  content: CodeContent;
}

export interface PendingImageSelectorProps {
  options: PendingImageOption[];
  value: PendingImageOption | null;
  onChange: (option: PendingImageOption | null) => void;
  placeholder?: string;
}

export interface ExtendedStatusSelectorProps {
  status: ExtendedStatusOption;
  setStatus: Dispatch<SetStateAction<ExtendedStatusOption>>;
}
