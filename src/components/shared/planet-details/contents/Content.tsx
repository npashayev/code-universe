import type { PlanetContent } from '@/types/planet';

import HtmlElementBlock from './HtmlElementBlock';
import CodeBlock from './CodeBlock';
import ImplementationTaskBlock from './ImplementationTaskBlock';
import TextContentBlock from './TextContentBlock';
import ImageBlock from './ImageBlock';

interface Props {
  content: PlanetContent;
  labels: Record<string, string>;
}

const Content = ({ content, labels }: Props) => {
  switch (content.type) {
    case 'text':
      return <TextContentBlock content={content} />;

    case 'implementation-task':
      return <ImplementationTaskBlock content={content} labels={labels} />;

    case 'html-element':
      return <HtmlElementBlock content={content} />;

    case 'code':
      return <CodeBlock content={content} />;

    case 'image':
      return <ImageBlock content={content} />;

    default:
      return null;
  }
};

export default Content;
