import { cn } from '@/lib/utils/cn';
import { TextContent, TextVariant, TitleLevel } from '@/types/planet';
import { ReactNode } from 'react';
import Markdown from 'react-markdown';

interface Props {
  content: TextContent;
}

const getVariantStyles = (variant: TextVariant) => {
  let variantStyles: string;

  if (variant === 'normal') return;
  switch (variant) {
    case 'note':
      variantStyles = 'text-blue-200';
      break;
    case 'warning':
      variantStyles = 'text-yellow-600';
      break;
    case 'tip':
      variantStyles = 'text-green-600';
      break;
  }
  return variantStyles;
};

const getContentTitle = (
  title:
    | {
        level: TitleLevel;
        text: string;
      }
    | undefined,
): ReactNode => {
  if (!title) return null;

  const { level, text } = title;

  switch (level) {
    case 'h2':
      return <h2 className={cn(baseClasses)}>{text}</h2>;
    case 'h3':
      return <h3 className={cn(baseClasses)}>{text}</h3>;
    case 'h4':
      return <h4 className={cn(baseClasses)}>{text}</h4>;
    case 'h5':
      return <h5 className={cn(baseClasses)}>{text}</h5>;
    case 'h6':
      return <h6 className={cn(baseClasses)}>{text}</h6>;
  }
};

const baseClasses = 'font-bold text-2xl mb-3';

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
