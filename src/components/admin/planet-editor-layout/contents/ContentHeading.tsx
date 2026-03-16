import type {
  RemoveContentFn,
  UpdateContentFn,
} from '@/lib/hooks/admin/useLocalizedContent';
import type { PlanetContent } from '@/types/planet';
import RemoveButton from '@/components/admin/ui/RemoveButton';

import Label from '../shared/Label';

interface Props {
  idx: number;
  content: PlanetContent;
  onRemove: RemoveContentFn;
  onUpdate: UpdateContentFn;
}

const ContentHeading = ({ idx, content, onRemove, onUpdate }: Props) => {
  return (
    <div
      id={content.id}
      className="flex items-center justify-between gap-4 border-b border-white/12 pb-6"
    >
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-white/8 rounded-lg text-[10px] font-mono text-slate-400">
          #{idx + 1}
        </div>
        <span className="text-xs uppercase font-black text-orange-500 tracking-[0.2em]">
          {content.type}
        </span>
        <div className="h-4 w-px bg-white/15 mx-2" />
        <div className="flex flex-col">
          <Label className="text-[9px] mb-1" htmlFor="preview-name">
            Preview Label
          </Label>
          <input
            type="text"
            id="preview-name"
            placeholder="Label..."
            value={content.label || ''}
            onChange={(e) => {
              const trimmedValue = e.target.value.trimStart();
              onUpdate(content.id, { label: trimmedValue });
            }}
            className="bg-transparent border-none outline-none text-white font-bold p-0 placeholder:text-slate-600"
          />
        </div>
      </div>
      <RemoveButton onClick={() => onRemove(content.id)} />
    </div>
  );
};

export default ContentHeading;
