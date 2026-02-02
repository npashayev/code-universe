import CodeEditor from '@/lib/components/common/CodeEditor';
import { CodeTaskContent } from '@/lib/types/planet';

interface Props {
  content: CodeTaskContent;
}

const CodeTaskBlock = ({ content }: Props) => {
  return (
    <div>
      <h3>Code task</h3>
      <p>{content.title}</p>
      <div className="flex">
        <div style={{ width: content.task.output ? '50%' : '100%' }}>
          <CodeEditor
            defaultLanguage={content.task.language}
            defaultValue={content.task.code}
          />
        </div>
        {content.task.output && (
          <div className="w-1/2">
            <CodeEditor
              defaultLanguage="plaintext"
              defaultValue={content.task.output}
              height="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeTaskBlock;
