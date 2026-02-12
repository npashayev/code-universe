import {
  CONTENT_TYPE,
  PLANET_CATEGORY,
  PROGRAMMING_LANGUAGE,
} from '@/types/planet';
import {
  CategoryOption,
  ContentTypeOption,
  LanguageOption,
  ProgrammingLanguageOption,
  StatusOption,
  TextVariantOption,
  TitleLevelOption,
} from '@/types/reactSelectOptions';

export const languageOptions: LanguageOption[] = [
  { value: 'en', label: 'English' },
  { value: 'az', label: 'Azerbaijani' },
];

export const statusOptions: StatusOption[] = [
  {
    label: 'Draft',
    value: 'draft',
  },
  {
    label: 'Published',
    value: 'published',
  },
];

export const categoryOptions: CategoryOption[] = Object.entries(
  PLANET_CATEGORY,
).map(([, value]) => ({
  label: value,
  value,
}));

export const contentTypeOptions: ContentTypeOption[] = [
  { label: 'Text', value: CONTENT_TYPE.text },
  { label: 'Implementation task', value: CONTENT_TYPE.implementationTask },
  { label: 'Code', value: CONTENT_TYPE.code },
  { label: 'HTML element', value: CONTENT_TYPE.htmlElement },
  { label: 'Image', value: CONTENT_TYPE.image },
];

export const titleLevelOptions: TitleLevelOption[] = [
  {
    label: 'Paragraph (p)',
    value: 'p',
  },
  {
    label: 'Heading 2 (h2)',
    value: 'h2',
  },
  {
    label: 'Heading 3 (h3)',
    value: 'h3',
  },
  {
    label: 'Heading 4 (h4)',
    value: 'h4',
  },
  {
    label: 'Heading 5 (h5)',
    value: 'h5',
  },
  {
    label: 'Heading 6 (h6)',
    value: 'h6',
  },
];

export const textVariantOptions: TextVariantOption[] = [
  {
    label: 'Normal',
    value: 'normal',
  },
  {
    label: 'Note',
    value: 'note',
  },
  {
    label: 'Warning',
    value: 'warning',
  },
  {
    label: 'Tip',
    value: 'tip',
  },
];

export const programmingLanguageOptions: ProgrammingLanguageOption[] =
  Object.entries(PROGRAMMING_LANGUAGE).map(([, value]) => ({
    label: value,
    value,
  }));
