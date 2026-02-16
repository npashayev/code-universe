import { ImageContent } from '@/types/planet';
import Image from 'next/image';
import Markdown from 'react-markdown';

interface Props {
  content: ImageContent;
}

const ImageBlock = ({ content }: Props) => {
  const { title, description, image } = content;
  return (
    <div>
      {title && <h3 className="heading-sub">{title}</h3>}
      {description && (
        <div className="prose max-w-none">
          <Markdown>{description}</Markdown>
        </div>
      )}
      <div className="mt-4">
        <Image
          src={image.url}
          alt={image.alt || 'Content image'}
          height={image.metadata.height}
          width={image.metadata.width}
          className="max-w-full max-h-150 w-auto h-auto rounded-md"
        />
      </div>
    </div>
  );
};

export default ImageBlock;
