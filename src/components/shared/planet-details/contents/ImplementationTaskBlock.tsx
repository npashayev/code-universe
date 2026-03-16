import Markdown from 'react-markdown';

import type { ImplementationTaskContent } from '@/types/planet';

interface Props {
  content: ImplementationTaskContent;
}

const ImplementationTaskBlock = ({ content }: Props) => {
  const { title, task } = content;
  return (
    <div>
      {title && <h3 className="heading-sub">{title}</h3>}
      <div className="prose max-w-none">
        <Markdown>{task}</Markdown>
      </div>
    </div>
  );
};

export default ImplementationTaskBlock;
