import {
  ContentType,
  PlanetCategory,
  PlanetStatus,
  ProgrammingLanguage,
  SupportedLanguage,
  TextVariant,
  TitleLevel,
} from './planet';

export interface BaseOption<T, U = string> {
  value: T;
  label: U;
}

export type LanguageOption = BaseOption<SupportedLanguage>;
export type StatusOption = BaseOption<PlanetStatus, 'Draft' | 'Published'>;
export type CategoryOption = BaseOption<PlanetCategory, PlanetCategory>;
export type ContentTypeOption = BaseOption<ContentType>;
export type TitleLevelOption = BaseOption<TitleLevel>;
export type TextVariantOption = BaseOption<TextVariant>;
export type ProgrammingLanguageOption = BaseOption<ProgrammingLanguage>;
/** Option for selecting an existing pending content image by id (label = alt text). */
export type PendingImageOption = BaseOption<string, string>;
