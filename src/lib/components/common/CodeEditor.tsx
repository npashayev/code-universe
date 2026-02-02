'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';

interface Props {
  defaultValue: string;
  defaultLanguage: string;
  isLight?: boolean;
  readOnly?: boolean;
  height?: string; // fixed height if provided
  onChange?: OnChange;
  paddingTop?: number; // optional padding override
  paddingBottom?: number; // optional padding override
  fontSize?: number; // optional font size override
}

const CodeEditor = ({
  defaultValue = '',
  defaultLanguage,
  isLight = false,
  readOnly = true,
  height,
  onChange,
  paddingTop = 20,
  paddingBottom = 20,
  fontSize = 18,
}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const [autoHeight, setAutoHeight] = useState('100px');

  const updateHeight = useCallback(() => {
    if (!editorRef.current) return;

    const contentHeight = editorRef.current.getContentHeight();
    const finalHeight = Math.min(
      contentHeight + paddingTop + paddingBottom,
      600,
    );
    setAutoHeight(`${finalHeight}px`);
  }, [paddingTop, paddingBottom]);

  const handleEditorDidMount: OnMount = editor => {
    editorRef.current = editor;

    if (!height) {
      editor.layout();
      requestAnimationFrame(updateHeight);
      editor.onDidChangeModelContent(updateHeight);
    }
  };

  useEffect(() => {
    if (!editorRef.current || height) return;

    const handleResize = () => {
      editorRef.current?.layout();
      updateHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height, updateHeight]);

  return (
    <Editor
      height={height ?? autoHeight}
      defaultLanguage={defaultLanguage}
      defaultValue={defaultValue}
      theme={isLight ? 'light' : 'vs-dark'}
      onMount={handleEditorDidMount}
      onChange={onChange}
      options={{
        readOnly,
        fontSize,
        wordWrap: 'on',
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        padding: { top: paddingTop, bottom: paddingBottom },
      }}
    />
  );
};

export default CodeEditor;
