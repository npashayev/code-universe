import {
  CreatePlanetData,
  SupportedLanguage,
  TextContent,
  TextVariant,
  TitleLevel,
} from '@/types/planet';
import { Updater } from 'use-immer';
import Select from 'react-select';
import { getAdminPageSelectStyles } from '@/lib/utils/getAdminPageSelectStyles';
import { ChevronDown } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  content: TextContent;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

interface TitleLevelOption {
  label: string;
  value: TitleLevel;
}

const titleLevelOptions: TitleLevelOption[] = [
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

interface TextVariantOption {
  label: string;
  value: TextVariant;
}

const textVariantOptions: TextVariantOption[] = [
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

const TextContentBlock = ({ content, setPlanetData, locale }: Props) => {
  const updateContent = (id: string, updates: Partial<TextContent>) => {
    setPlanetData(draft => {
      const content = draft.localized[locale].contents.find(c => c.id === id);
      if (!content) return;
      Object.assign(content, updates);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="space-y-2">
          <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Level
          </label>
          <div className="relative group w-fit">
            <Select<TitleLevelOption, false>
              isDisabled={!content.title?.text}
              instanceId="title-level-select"
              value={
                titleLevelOptions.find(
                  tl => tl.value === content.title?.level,
                ) ?? titleLevelOptions[0]
              }
              options={titleLevelOptions}
              onChange={option => {
                if (!option) return;
                updateContent(content.id, {
                  title: {
                    level: option.value,
                    text: content.title?.text || '',
                  },
                });
              }}
              styles={getAdminPageSelectStyles<TitleLevelOption>({
                controlStyles: {
                  paddingInlineStart: '12px',
                  paddingBlock: '9px',
                },
              })}
              isSearchable={false}
            />

            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>
        </div>
        <div className="md:col-span-3 space-y-2 flex-1">
          <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Title Text (Optional)
          </label>
          <input
            type="text"
            value={content.title?.text || ''}
            onChange={e => {
              const value = e.target.value;

              if (value.trim() === '') {
                setPlanetData(draft => {
                  const item = draft.localized[locale].contents.find(
                    cn => cn.id === content.id,
                  );

                  if (!item) return;

                  delete item.title;
                });

                return;
              }

              updateContent(content.id, {
                title: {
                  level: content.title?.level || 'p',
                  text: value,
                },
              });
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Content
        </label>
        <textarea
          value={content.text}
          onChange={e => updateContent(content.id, { text: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm min-h-37.5 outline-none"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex gap-3 items-center">
            <label className="text-[12px] text-slate-600 uppercase font-bold">
              Text Variant
            </label>
            <div className="relative group w-fit">
              <Select<TextVariantOption, false>
                instanceId="title-level-select"
                value={
                  textVariantOptions.find(tv => tv.value === content.variant) ??
                  textVariantOptions[0]
                }
                options={textVariantOptions}
                onChange={option => {
                  if (!option) return;
                  updateContent(content.id, {
                    variant: option.value,
                  });
                }}
                styles={getAdminPageSelectStyles<TextVariantOption>({
                  controlStyles: {
                    paddingInlineStart: '12px',
                  },
                })}
                isSearchable={false}
              />

              <ChevronDown
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextContentBlock;
