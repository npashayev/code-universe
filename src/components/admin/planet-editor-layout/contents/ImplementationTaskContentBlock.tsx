import { UpdateContentFn } from '@/lib/hooks/useLocalizedContent';
import { ImplementationTaskContent } from '@/types/planet';
import Input from '../shared/Input';
import Label from '../shared/Label';
import Textarea from '../shared/Textarea';

interface Props {
  content: ImplementationTaskContent;
  onUpdate: UpdateContentFn;
}

const ImplementationTaskContentBlock = ({ content, onUpdate }: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={`implementation-task-title-${content.id}`}>
          Task Title (Optional)
        </Label>
        <Input
          id={`implementation-task-title-${content.id}`}
          value={content.title || ''}
          onChange={e => onUpdate(content.id, { title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`implementation-task-instructions-${content.id}`}>
          Task Instructions
        </Label>
        <Textarea
          id={`implementation-task-instructions-${content.id}`}
          value={content.task}
          onChange={e => onUpdate(content.id, { task: e.target.value })}
        />
      </div>
    </div>
  );
};

export default ImplementationTaskContentBlock;
