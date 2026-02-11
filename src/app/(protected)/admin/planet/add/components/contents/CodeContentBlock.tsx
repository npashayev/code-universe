import { getAdminPageSelectStyles } from '@/lib/utils/getAdminPageSelectStyles';
import {
  CodeContent,
  PROGRAMMING_LANGUAGE,
  ProgrammingLanguage,
} from '@/types/planet';
import { ChevronDown, Eye, Terminal } from 'lucide-react';
import Select from 'react-select';
import { UpdateContentFn } from '@/lib/hooks/useLocalizedContent';

interface Props {
  content: CodeContent;
  onUpdate: UpdateContentFn;
}

interface LanguageOption {
  label: ProgrammingLanguage;
  value: ProgrammingLanguage;
}

const languageOptions: LanguageOption[] = Object.entries(
  PROGRAMMING_LANGUAGE,
).map(([, value]) => ({
  label: value,
  value,
}));

const CodeContentBlock = ({ content, onUpdate }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="space-y-2 w-full">
          <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Title (Optional)
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={e => onUpdate(content.id, { title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
          />
        </div>
        <div className="space-y-2 shrink-0">
          <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Language
          </label>
          <div className="relative group w-fit">
            <Select<LanguageOption, false>
              instanceId="programming-language-select"
              value={
                languageOptions.find(l => l.value === content.code.language) ??
                languageOptions[0]
              }
              options={languageOptions}
              onChange={option => {
                if (!option) return;
                onUpdate(content.id, {
                  code: {
                    ...content.code,
                    language: option.value,
                  },
                });
              }}
              styles={getAdminPageSelectStyles<LanguageOption>({
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
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[12px] text-orange-500 uppercase font-black tracking-widest flex items-center gap-2">
            <Terminal size={14} /> Code
          </label>
          <textarea
            value={content.code.code}
            onChange={e =>
              onUpdate(content.id, {
                code: { ...content.code, code: e.target.value },
              })
            }
            className="w-full bg-[#0d0d1e] border border-white/5 rounded-2xl px-5 py-4 text-[11px] font-mono min-h-50 max-h-100 overflow-auto outline-none custom-scrollbar"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[12px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
            <Eye size={12} /> Output (Optional)
          </label>
          <textarea
            value={content.code.output || ''}
            onChange={e =>
              onUpdate(content.id, {
                code: { ...content.code, output: e.target.value },
              })
            }
            className="w-full bg-[#0d0d1e] border border-white/5 rounded-2xl px-5 py-4 text-[11px] font-mono min-h-25 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeContentBlock;
