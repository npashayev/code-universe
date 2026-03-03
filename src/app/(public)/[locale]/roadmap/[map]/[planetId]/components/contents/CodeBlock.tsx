'use client';
import CodeEditor from '@/components/shared/CodeEditor';
import CodePreview from '@/components/shared/CodePreview';
import { cn } from '@/lib/utils/cn';
import { CodeContent } from '@/types/planet';
import { useState } from 'react';
import CodeEditorHeader from './CodeEditorHeader';
import Markdown from 'react-markdown';

interface Props {
  content: CodeContent;
}

const CodeBlock = ({ content }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const { title, code, description } = content;
  return (
    <div className="mt-6">
      {title && <h3 className="mb-1 font-bold text-xl">{title}</h3>}
      {description && (
        <div className="prose max-w-none">
          <Markdown>{description}</Markdown>
        </div>
      )}

      <div className="mt-4">
        <CodeEditorHeader
          editMode={editMode}
          setEditMode={setEditMode}
          lightMode={lightMode}
          setLightMode={setLightMode}
          language={code.language}
        />
        <div className="flex">
          <div className={cn('w-full', code.output && 'w-1/2')}>
            {editMode ? (
              <CodeEditor
                isLight={lightMode}
                defaultLanguage={code.language}
                defaultValue={code.code}
              />
            ) : (
              <CodePreview
                isLight={lightMode}
                defaultLanguage={code.language}
                defaultValue={code.code}
              />
            )}
          </div>
          {code.output && (
            <div className="w-1/2 border-l border-l-white/40">
              <CodePreview
                isLight={lightMode}
                defaultLanguage="plaintext"
                defaultValue={code.output}
                height="100%"
                color={lightMode ? 'black' : 'white'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
