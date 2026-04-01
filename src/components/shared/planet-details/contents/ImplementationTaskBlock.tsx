import type { ImplementationTaskContent } from '@/types/planet';

import CustomMarkdown from './CustomMarkdown';

interface Props {
  content: ImplementationTaskContent;
  labels: Record<string, string>;
}

const ImplementationTaskBlock = ({ content, labels }: Props) => {
  const { title, task } = content;
  return (
    <div>
      {title && (
        <h3 className="heading-sub">
          {labels.task}: {title}
        </h3>
      )}
      <CustomMarkdown text={task} />
    </div>
  );
};

export default ImplementationTaskBlock;
