'use client';

import {
  categoryOptions,
  contentTypeOptions,
  extendedStatusOptions,
  languageOptions,
  programmingLanguageOptions,
  statusOptions,
  textVariantOptions,
  titleLevelOptions,
} from '@/lib/constants/reactSelectOptions';
import {
  CategoryOption,
  ContentTypeOption,
  ExtendedStatusOption,
  LanguageOption,
  PendingImageOption,
  ProgrammingLanguageOption,
  StatusOption,
  TextVariantOption,
  TitleLevelOption,
} from '@/types/reactSelectOptions';
import { CheckCircle2, Clock, Code, Eye, Languages } from 'lucide-react';
import {
  CategorySelectorProps,
  ContentTypeSelectorProps,
  ExtendedStatusSelectorProps,
  LanguageSelectorProps,
  PendingImageSelectorProps,
  PlanetDataProps,
  ProgrammingLanguageSelectorProps,
  StatusUpdateSelectorProps,
  TextVariantSelectorProps,
  TitleLevelSelectorProps,
} from '@/types/reactSelectProps';
import Selector from './shared/Selector';

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

export const StatusUpdateSelector = ({
  planet,
  changePlanetStatus,
}: StatusUpdateSelectorProps) => (
  <Selector<StatusOption>
    instanceId={`status-update-select-${planet.id}`}
    value={statusOptions.find(o => o.value === planet.status) || null}
    options={statusOptions}
    onChange={option => {
      if (!option) return;
      changePlanetStatus(draft => {
        const planetToUpdate = draft.find(p => p.id === planet.id);
        if (!planetToUpdate) return;
        planetToUpdate.status = option.value;
      });
    }}
  >
    {planet.status === 'published' ? (
      <CheckCircle2 size={12} className="text-green-500" />
    ) : (
      <Clock size={12} className="text-orange-500" />
    )}
  </Selector>
);

export const ExtendedStatusSelector = ({
  status,
  setStatus,
}: ExtendedStatusSelectorProps) => {
  return (
    <Selector<ExtendedStatusOption>
      instanceId="extended-status-select"
      value={status}
      options={extendedStatusOptions}
      onChange={option => {
        if (!option) return;
        setStatus(option);
      }}
    >
      <Eye size={14} />
    </Selector>
  );
};

export const LanguageSelector = ({
  currentLanguage,
  setCurrentLanguage,
}: LanguageSelectorProps) => (
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
  category,
  onCategoryChange,
}: CategorySelectorProps) => (
  <Selector<CategoryOption>
    instanceId="category-select"
    value={
      categoryOptions.find(o => o.value === category) ||
      categoryOptions[0]
    }
    options={categoryOptions}
    onChange={option => {
      if (!option) return;
      onCategoryChange(option.value);
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
  content,
  onUpdate,
  isDisabled,
}: TitleLevelSelectorProps) => (
  <Selector<TitleLevelOption>
    instanceId="title-level-select"
    value={
      titleLevelOptions.find(tl => tl.value === content.title?.level) ??
      titleLevelOptions[0]
    }
    options={titleLevelOptions}
    isDisabled={isDisabled}
    onChange={option => {
      if (!option) return;
      onUpdate(content.id, {
        title: { level: option.value, text: content.title?.text || '' },
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
  content,
  onUpdate,
}: TextVariantSelectorProps) => (
  <Selector<TextVariantOption>
    instanceId="text-variant-select"
    value={
      textVariantOptions.find(tv => tv.value === content.variant) ??
      null
    }
    options={textVariantOptions}
    onChange={option => {
      if (!option) return;
      onUpdate(content.id, { variant: option.value });
    }}
    styles={{
      controlStyles: {
        paddingInlineStart: '12px',
      },
    }}
  />
);

export const ProgrammingLanguageSelector = ({
  onUpdate,
  content
}: ProgrammingLanguageSelectorProps) => (
  <Selector<ProgrammingLanguageOption>
    instanceId="programming-language-select"
    value={
      programmingLanguageOptions.find(
        l => l.value === content.code.language,
      ) ?? null
    }
    options={programmingLanguageOptions}
    onChange={option => {
      if (!option) return;
      onUpdate(content.id, {
        code: { ...content.code, language: option.value },
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
