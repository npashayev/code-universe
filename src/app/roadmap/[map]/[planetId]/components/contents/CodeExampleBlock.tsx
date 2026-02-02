import CodeEditor from '@/lib/components/common/CodeEditor';
import { CodeExampleContent } from '@/lib/types/planet';

interface Props {
  content: CodeExampleContent;
}

const CodeExampleBlock = ({ content }: Props) => {
  return (
    <div>
      <p>{content.title}</p>
      <div className="flex">
        <div style={{ width: content.example.output ? '50%' : '100%' }}>
          <CodeEditor
            defaultLanguage={content.example.language}
            defaultValue={content.example.code}
          />
        </div>
        {content.example.output && (
          <div className="w-1/2">
            <CodeEditor
              defaultLanguage="plaintext"
              defaultValue={content.example.output}
              height="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeExampleBlock;
