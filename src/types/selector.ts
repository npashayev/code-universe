import { CodeContent, CreatePlanetData, PlanetCategory } from '@/types/planet';
import { Updater } from 'use-immer';
import { UpdateContentFn } from '@/lib/hooks/useLocalizedContent';
import {
  CategoryOption,
  ContentTypeOption,
  ExtendedStatusOption,
  LanguageOption,
  PendingImageOption,
  ProgrammingLanguageOption,
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
  value: CategoryOption;
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
  value: TitleLevelOption | null;
  onUpdate: UpdateContentFn;
  contentId: string;
  titleText?: string;
  isDisabled?: boolean;
}

export interface TextVariantSelectorProps {
  value: TextVariantOption | null;
  onUpdate: UpdateContentFn;
  contentId: string;
}

export interface ProgrammingLanguageSelectorProps {
  value: ProgrammingLanguageOption | null;
  onUpdate: UpdateContentFn;
  contentId: string;
  code: CodeContent['code'];
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
