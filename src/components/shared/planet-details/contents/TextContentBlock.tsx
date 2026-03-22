import type { ReactNode } from 'react';
import Markdown from 'react-markdown';

import { cn } from '@/lib/utils/cn';
import type { TextContent, TextVariant, TitleLevel } from '@/types/planet';

interface Props {
  content: TextContent;
}

const getVariantStyles = (variant: TextVariant): string | undefined => {
  switch (variant) {
    case 'note':
      return 'text-blue-200';
    case 'warning':
      return 'text-yellow-600';
    case 'tip':
      return 'text-green-600';
    default:
      return undefined;
  }
};

const baseClasses = 'font-bold text-2xl mb-3';

const headingClassMap: Partial<Record<TitleLevel, string>> = {
  h2: 'heading-secondary',
  h3: 'heading-sub',
  h4: 'heading-minor',
};

const getContentTitle = (
  title: { level: TitleLevel; text: string } | undefined,
): ReactNode => {
  if (!title) return null;
  const Tag = title.level;
  return (
    <Tag className={cn(baseClasses, headingClassMap[title.level])}>
      {title.text}
    </Tag>
  );
};

const TextContentBlock = ({ content }: Props) => {
  const { title, text, variant } = content;

  return (
    <div>
      {getContentTitle(title)}
      <div className={cn('prose max-w-none', getVariantStyles(variant))}>
        <Markdown>{text}</Markdown>
      </div>
    </div>
  );
};

export default TextContentBlock;
