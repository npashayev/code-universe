import clsx from 'clsx';

interface TextContent {
    type: 'text' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    text: string;
}

interface Props {
    content: TextContent;
}

const TextContentBlock = ({ content }: Props) => {
    const { type, text } = content;

    const baseClasses = 'whitespace-pre-wrap break-words';

    switch (type) {
        case 'h2':
            return <h2 className={clsx(baseClasses, 'text-3xl font-bold mb-4')}>{text}</h2>;
        case 'h3':
            return <h3 className={clsx(baseClasses, 'text-2xl font-bold mb-3')}>{text}</h3>;
        case 'h4':
            return <h4 className={clsx(baseClasses, 'text-xl font-semibold mb-3')}>{text}</h4>;
        case 'h5':
            return <h5 className={clsx(baseClasses, 'text-lg font-semibold mb-2')}>{text}</h5>;
        case 'h6':
            return <h6 className={clsx(baseClasses, 'text-base font-semibold mb-2')}>{text}</h6>;
        case 'text':
        default:
            return <p className={clsx(baseClasses, 'mb-4')}>{text}</p>;
    }
};

export default TextContentBlock;