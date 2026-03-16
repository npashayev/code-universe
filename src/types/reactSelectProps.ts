import { CodeContent, CreatePlanetData, PlanetCategory, PlanetContent, ProgrammingLanguage, TextContent } from '@/types/planet';
import { Updater } from 'use-immer';
import { UpdateContentFn } from '@/lib/hooks/useLocalizedContent';
import {
  CategoryOption,
  ContentTypeOption,
  ExtendedStatusOption,
  LanguageOption,
  PendingImageOption,
  TextVariantOption,
  TitleLevelOption,
} from '@/types/reactSelectOptions';
import { Dispatch, SetStateAction } from 'react';
import { AdminPlanetSummary } from '@/lib/planet/getPlanetList';

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
