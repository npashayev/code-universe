import type { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';

import { cn } from '@/lib/utils/cn';
import type { TextContent, TextVariant, TitleLevel } from '@/types/planet';

import CustomMarkdown from './CustomMarkdown';

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
      return 'text-lime-400';
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
      <div className="flex gap-4 items-center">
        {variant === 'tip' && (
          <FontAwesomeIcon
            icon={faLightbulb}
            className="text-lime-400 text-2xl -rotate-20"
          />
        )}
        <div className={cn('prose max-w-none', getVariantStyles(variant))}>
          <CustomMarkdown text={text} className={getVariantStyles(variant)} />
        </div>
      </div>
    </div>
  );
};

export default TextContentBlock;
