import { UpdateContentFn } from '@/lib/hooks/useLocalizedContent';
import { ImplementationTaskContent } from '@/types/planet';

interface Props {
  content: ImplementationTaskContent;
  onUpdate: UpdateContentFn;
}

const ImplementationTaskContentBlock = ({ content, onUpdate }: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Task Title (Optional)
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={e => onUpdate(content.id, { title: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Task Instructions
        </label>
        <textarea
          value={content.task}
          onChange={e => onUpdate(content.id, { task: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm min-h-30 outline-none"
        />
      </div>
    </div>
  );
};

export default ImplementationTaskContentBlock;
