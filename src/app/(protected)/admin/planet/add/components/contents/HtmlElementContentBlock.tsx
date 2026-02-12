import { UpdateContentFn } from '@/lib/hooks/useLocalizedContent';
import { HtmlElementContent } from '@/types/planet';
import Label from '../shared/Label';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';

interface Props {
  content: HtmlElementContent;
  onUpdate: UpdateContentFn;
}

const HtmlElementContentBlock = ({ content, onUpdate }: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={`html-element-content-title-${content.id}`}>
          Title (Optional)
        </Label>
        <Input
          id={`html-element-content-title-${content.id}`}
          value={content.title || ''}
          onChange={e => onUpdate(content.id, { title: e.target.value })}
        />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`html-element-html-code-${content.id}`}>
            HTML code
          </Label>
          <Textarea
            id={`html-element-html-code-${content.id}`}
            value={content.element.html}
            onChange={e =>
              onUpdate(content.id, {
                element: { ...content.element, html: e.target.value },
              })
            }
            className="code-area"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`html-element-css-code-${content.id}`}>
            CSS code (Optional)
          </Label>
          <Textarea
            id={`html-element-css-code-${content.id}`}
            value={content.element.css || ''}
            onChange={e =>
              onUpdate(content.id, {
                element: { ...content.element, css: e.target.value },
              })
            }
            className="code-area"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`html-element-js-code-${content.id}`}>
            Javascript code (Optional)
          </Label>
          <Textarea
            id={`html-element-js-code-${content.id}`}
            value={content.element.js || ''}
            onChange={e =>
              onUpdate(content.id, {
                element: { ...content.element, js: e.target.value },
              })
            }
            className="code-area"
          />
        </div>
      </div>
    </div>
  );
};

export default HtmlElementContentBlock;
