import {
  CreatePlanetData,
  SupportedLanguage,
  TextContent,
} from '@/types/planet';
import { Updater } from 'use-immer';
import { UpdateContentFn } from '@/lib/hooks/admin/useLocalizedContent';
import { TextVariantSelector, TitleLevelSelector } from '../../Selectors';
import Input from '../shared/Input';
import Label from '../shared/Label';
import Textarea from '../shared/Textarea';

interface Props {
  content: TextContent;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
  onUpdate: UpdateContentFn;
}

const TextContentBlock = ({
  content,
  setPlanetData,
  locale,
  onUpdate,
}: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="space-y-2">
          <div className="block mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Level
          </div>
          <TitleLevelSelector
            content={content}
            onUpdate={onUpdate}
            isDisabled={!content.title?.text}
          />
        </div>
        <div className="space-y-2 flex-1">
          <Label htmlFor={`text-title-${content.id}`}>
            Title Text (Optional)
          </Label>
          <Input
            id={`text-title-${content.id}`}
            value={content.title?.text || ''}
            onChange={(e) => {
              const value = e.target.value;

              if (value.trim() === '') {
                setPlanetData((draft) => {
                  const item = draft.localized[locale].contents.find(
                    (cn) => cn.id === content.id,
                  );

                  if (!item) return;

                  delete item.title;
                });

                return;
              }

              onUpdate(content.id, {
                title: {
                  level: content.title?.level || 'h2',
                  text: value,
                },
              });
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`text-content-${content.id}`}>Content</Label>
        <Textarea
          id={`text-content-${content.id}`}
          value={content.text}
          onChange={(e) => onUpdate(content.id, { text: e.target.value })}
        />
      </div>
      <div className="p-4 bg-black/25 rounded-2xl border border-white/12">
        <div className="flex items-center gap-6">
          <div className="flex gap-3 items-center">
            <span className="text-[12px] text-slate-500 uppercase font-bold">
              Text Variant
            </span>
            <TextVariantSelector content={content} onUpdate={onUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextContentBlock;
