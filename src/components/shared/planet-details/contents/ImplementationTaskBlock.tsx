import type { ImplementationTaskContent } from '@/types/planet';

import CustomMarkdown from './CustomMarkdown';

interface Props {
  content: ImplementationTaskContent;
}

const ImplementationTaskBlock = ({ content }: Props) => {
  const { title, task } = content;
  return (
    <div>
      {title && <h3 className="heading-sub">{title}</h3>}
      <CustomMarkdown text={task} />
    </div>
  );
};

export default ImplementationTaskBlock;
