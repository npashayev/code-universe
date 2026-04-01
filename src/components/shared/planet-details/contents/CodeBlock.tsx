'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

import CodePreview from '@/components/shared/planet-details/CodePreview';
import { cn } from '@/lib/utils/cn';
import type { CodeContent } from '@/types/planet';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

import CodeEditorHeader from './CodeEditorHeader';
import CustomMarkdown from './CustomMarkdown';

const CodeEditor = dynamic(
  () => import('@/components/shared/planet-details/CodeEditor'),
  {
    ssr: false,
  },
);

interface Props {
  content: CodeContent;
}

const CodeBlock = ({ content }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [lightMode, setLightMode] = useLocalStorage('isCodeLight', false);

  const toggleLightMode = () => setLightMode(!lightMode);

  const { title, code, description } = content;
  return (
    <div className="mt-6">
      {title && <h3 className="mb-1 font-bold text-xl">{title}</h3>}
      {description && <CustomMarkdown text={description} />}

      <div className="mt-4">
        <CodeEditorHeader
          editMode={editMode}
          setEditMode={setEditMode}
          lightMode={lightMode}
          toggleLightMode={toggleLightMode}
          language={code.language}
        />
        <div className="flex">
          <div className={cn('w-full', code.output && 'w-1/2')}>
            {editMode ? (
              <CodeEditor
                isLight={lightMode}
                defaultLanguage={code.language}
                defaultValue={code.code}
                readOnly={true}
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
