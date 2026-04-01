import Image from 'next/image';

import type { ImageContent } from '@/types/planet';

import CustomMarkdown from './CustomMarkdown';

interface Props {
  content: ImageContent;
}

const ImageBlock = ({ content }: Props) => {
  const { title, description, image } = content;
  return (
    <div>
      {title && <h3 className="heading-sub">{title}</h3>}
      {description && <CustomMarkdown text={description} />}
      <div className="mt-4 flex justify-center">
        <Image
          src={image.url}
          alt={image.alt || 'Content image'}
          height={image.metadata.height}
          width={image.metadata.width}
          className="max-h-150 w-auto h-auto rounded-md"
        />
      </div>
    </div>
  );
};

export default ImageBlock;
