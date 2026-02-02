import { PlanetContent } from '@/lib/types/planet';
import HtmlElementBlock from './HtmlElementBlock';
import CodeTaskBlock from './CodeTaskBlock';
import ImplementationTaskBlock from './ImplementationTaskBlock';
import TextContentBlock from './TextContentBlock';


interface Props {
  content: PlanetContent;
}

const Content = ({ content }: Props) => {
  switch (content.type) {
    case 'text':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return <TextContentBlock content={content} />;

    case 'implementation-task':
      return <ImplementationTaskBlock content={content} />;

    case 'html-element':
      return <HtmlElementBlock content={content} />;

    case 'code-task':
      return <CodeTaskBlock content={content} />;

    // case 'image':
    //   return <ImageBlock content={content} />;

    default:
      return null;
  }
};

export default Content;
