import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils/cn';
interface Props {
  text: string;
  className?: string;
  inline?: boolean;
}
const CustomMarkdown = ({ text, className, inline }: Props) => {
  const Wrapper = inline ? 'span' : 'div';
  return (
    <Wrapper
      className={cn(
        `prose max-w-none 
        text-lg text-white
        prose-strong:text-white prose-strong:font-bold
        prose-code:before:content-none prose-code:after:content-none 
        prose-code:text-amber-400 prose-code:bg-[#292524]
        prose-code:rounded prose-code:px-1.5 prose-code:font-normal
        prose-p:my-1
        prose-ul:list-disc prose-ul:list-inside prose-li:my-0 prose-ul:my-0
        prose-ol:list-inside prose-ol:my-0`,
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={inline ? { p: ({ children }) => children } : undefined}
      >
        {text}
      </Markdown>
    </Wrapper>
  );
};
export default CustomMarkdown;
