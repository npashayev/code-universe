import {
  categoryOptions,
  contentTypeOptions,
  languageOptions,
  programmingLanguageOptions,
  statusOptions,
  textVariantOptions,
  titleLevelOptions,
} from '@/lib/constants/reactSelectOptions';
import { CodeContent, CreatePlanetData } from '@/types/planet';
import {
  CategoryOption,
  ContentTypeOption,
  LanguageOption,
  PendingImageOption,
  ProgrammingLanguageOption,
  StatusOption,
  TextVariantOption,
  TitleLevelOption,
} from '@/types/reactSelectOptions';
import { Code, Eye, Languages } from 'lucide-react';
import { Updater } from 'use-immer';
import Selector from './shared/Selector';
import { UpdateContentFn } from '@/lib/hooks/useLocalizedContent';

interface PlanetDataProps {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
}

interface LanguageProps {
  currentLanguage: LanguageOption;
  setCurrentLanguage: React.Dispatch<React.SetStateAction<LanguageOption>>;
}

interface ContentTypeSelectorProps {
  value: ContentTypeOption;
  onChange: (opt: ContentTypeOption) => void;
}

interface TitleLevelSelectorProps {
  value: TitleLevelOption | null;
  onUpdate: UpdateContentFn;
  contentId: string;
  titleText?: string;
  isDisabled?: boolean;
}

interface TextVariantSelectorProps {
  value: TextVariantOption | null;
  onUpdate: UpdateContentFn;
  contentId: string;
}

interface ProgrammingLanguageSelectorProps {
  value: ProgrammingLanguageOption | null;
  onUpdate: UpdateContentFn;
  contentId: string;
  code: CodeContent['code'];
}

interface PendingImageSelectorProps {
  options: PendingImageOption[];
  value: PendingImageOption | null;
  onChange: (option: PendingImageOption | null) => void;
  placeholder?: string;
}

export const StatusSelector = ({
  planetData,
  setPlanetData,
}: PlanetDataProps) => (
  <Selector<StatusOption>
    instanceId="status-select"
    value={statusOptions.find(o => o.value === planetData.status) || null}
    options={statusOptions}
    onChange={option => {
      if (!option) return;
      setPlanetData(draft => {
        draft.status = option.value;
      });
    }}
  >
    <Eye size={14} />
  </Selector>
);

export const LanguageSelector = ({
  currentLanguage,
  setCurrentLanguage,
}: LanguageProps) => (
  <Selector<LanguageOption>
    instanceId="language-select"
    value={currentLanguage}
    options={languageOptions}
    onChange={option => {
      if (!option) return;
      setCurrentLanguage(option);
    }}
  >
    <Languages size={14} />
  </Selector>
);

export const CategorySelector = ({
  planetData,
  setPlanetData,
}: PlanetDataProps) => (
  <Selector<CategoryOption>
    instanceId="category-select"
    value={
      categoryOptions.find(o => o.value === planetData.category) ||
      categoryOptions[0]
    }
    options={categoryOptions}
    onChange={option => {
      if (!option) return;
      setPlanetData(draft => {
        draft.category = option.value;
      });
    }}
  >
    <Code size={16} />
  </Selector>
);

export const ContentTypeSelector = ({
  value,
  onChange,
}: ContentTypeSelectorProps) => (
  <Selector<ContentTypeOption>
    instanceId="content-type-select"
    value={value}
    options={contentTypeOptions}
    onChange={opt => opt && onChange(opt)}
    styles={{
      controlStyles: {
        paddingInlineStart: '12px',
        paddingBlock: '9px',
        width: '100%',
      },
    }}
  />
);

export const TitleLevelSelector = ({
  value,
  onUpdate,
  contentId,
  titleText,
  isDisabled,
}: TitleLevelSelectorProps) => (
  <Selector<TitleLevelOption>
    instanceId="title-level-select"
    value={value}
    options={titleLevelOptions}
    isDisabled={isDisabled}
    onChange={option => {
      if (!option) return;
      onUpdate(contentId, {
        title: { level: option.value, text: titleText || '' },
      });
    }}
    styles={{
      controlStyles: {
        paddingInlineStart: '12px',
        paddingBlock: '15px',
      },
    }}
  />
);

export const TextVariantSelector = ({
  value,
  onUpdate,
  contentId,
}: TextVariantSelectorProps) => (
  <Selector<TextVariantOption>
    instanceId="text-variant-select"
    value={value}
    options={textVariantOptions}
    onChange={option => {
      if (!option) return;
      onUpdate(contentId, { variant: option.value });
    }}
    styles={{
      controlStyles: {
        paddingInlineStart: '12px',
      },
    }}
  />
);

export const ProgrammingLanguageSelector = ({
  value,
  onUpdate,
  contentId,
  code,
}: ProgrammingLanguageSelectorProps) => (
  <Selector<ProgrammingLanguageOption>
    instanceId="programming-language-select"
    value={value}
    options={programmingLanguageOptions}
    onChange={option => {
      if (!option) return;
      onUpdate(contentId, {
        code: { ...code, language: option.value },
      });
    }}
    styles={{
      controlStyles: {
        paddingInlineStart: '12px',
        paddingBlock: '15px',
      },
    }}
  />
);

export const PendingImageSelector = ({
  options,
  value,
  onChange,
  placeholder = 'Use same as existing image…',
}: PendingImageSelectorProps) => (
  <Selector<PendingImageOption>
    instanceId="pending-image-select"
    value={value}
    options={options}
    onChange={onChange}
    isSearchable
    placeholder={placeholder}
    styles={{
      controlStyles: {
        paddingInlineStart: '12px',
        paddingBlock: '9px',
        width: '100%',
      },
    }}
  />
);
