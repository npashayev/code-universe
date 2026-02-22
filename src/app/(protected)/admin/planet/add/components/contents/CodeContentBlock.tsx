import { CodeContent } from '@/types/planet';
import { Eye, Terminal } from 'lucide-react';
import { UpdateContentFn } from '@/lib/hooks/useLocalizedContent';
import { programmingLanguageOptions } from '@/lib/constants/reactSelectOptions';
import { ProgrammingLanguageSelector } from '../Selectors';
import Label from '../shared/Label';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';

interface Props {
  content: CodeContent;
  onUpdate: UpdateContentFn;
}

const CodeContentBlock = ({ content, onUpdate }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="space-y-2 w-full">
          <Label htmlFor={`code-content-title-${content.id}`}>
            Title (Optional)
          </Label>
          <Input
            id={`code-content-title-${content.id}`}
            value={content.title || ''}
            onChange={e => onUpdate(content.id, { title: e.target.value })}
          />
        </div>
        <div className="space-y-2 shrink-0">
          <div className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Language
          </div>
          <ProgrammingLanguageSelector
            value={
              programmingLanguageOptions.find(
                l => l.value === content.code.language,
              ) ?? programmingLanguageOptions[0]
            }
            onUpdate={onUpdate}
            contentId={content.id}
            code={content.code}
          />
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`code-content-description-${content.id}`}>
            Description (Optional)
          </Label>
          <Textarea
            id={`code-content-description-${content.id}`}
            value={content.description}
            onChange={e =>
              onUpdate(content.id, { description: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label
            className="text-orange-500 flex gap-2 items-center"
            htmlFor={`code-content-code-${content.id}`}
          >
            <Terminal size={14} /> Code
          </Label>
          <Textarea
            id={`code-content-code-${content.id}`}
            value={content.code.code}
            onChange={e =>
              onUpdate(content.id, {
                code: { ...content.code, code: e.target.value },
              })
            }
            className="code-area"
          />
        </div>
        <div className="space-y-2">
          <Label
            className="flex gap-2 items-center"
            htmlFor={`code-content-output-${content.id}`}
          >
            <Eye size={12} /> Output (Optional)
          </Label>
          <Textarea
            id={`code-content-output-${content.id}`}
            value={content.code.output || ''}
            onChange={e =>
              onUpdate(content.id, {
                code: { ...content.code, output: e.target.value },
              })
            }
            className="code-area"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeContentBlock;
