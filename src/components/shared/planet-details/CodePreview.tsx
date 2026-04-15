'use client';
import { Highlight, themes } from 'prism-react-renderer';

interface Props {
  defaultValue: string;
  defaultLanguage: string;
  isLight?: boolean;
  height?: string;
  paddingTop?: number;
  paddingBottom?: number;
  fontSize?: number;
  color?: string;
}

const CodePreview = ({
  defaultValue = '',
  defaultLanguage = 'plaintext',
  isLight = false,
  height,
  paddingTop = 20,
  paddingBottom = 20,
  fontSize = 16,
  color,
}: Props) => {
  return (
    <Highlight
      theme={isLight ? themes.vsLight : themes.vsDark}
      code={defaultValue.trim()}
      language={defaultLanguage}
    >
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          style={{
            ...style,
            margin: 0,
            ...(color && { color }),
            paddingTop,
            paddingBottom,
            paddingLeft: 0,
            paddingRight: 0,
            fontSize,
            height: height ?? 'auto',
            maxHeight: 600,
            overflowY: 'auto',
            fontFamily: 'Menlo, Monaco, Consolas, monospace',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {tokens.map((line, i) => (
            <div
              key={i}
              {...getLineProps({ line })}
              style={{ display: 'flex' }}
            >
              {/* Line number — matches Monaco's lineNumbers: 'on' */}
              <span
                style={{
                  userSelect: 'none',
                  minWidth: '3em',
                  paddingRight: '1em',
                  paddingLeft: '1em',
                  textAlign: 'right',
                  opacity: 0.4,
                  fontSize,
                }}
              >
                {i + 1}
              </span>
              <span style={{ paddingRight: '1em' }}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodePreview;
