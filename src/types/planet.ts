interface BaseContent {
  id: string;
  type: ContentType;
}

export interface PlanetData {
  id: string;
  name: string;
  tags: string[];
  description: string;
  imageUrl: string;
  researchTopics: string[];
  questions: string[];
  contents: PlanetContent[];
}

export type PlanetContent =
  | TextContent
  | ImplementationTaskContent
  | HtmlElementContent
  | CodeTaskContent
  | ImageContent;

export type TextType = 'text' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type ContentType =
  | TextType
  | 'implementation-task'
  | 'html-element'
  | 'code-task'
  | 'image';

export interface TextContent {
  id: string;
  type: TextType;
  text: string;
}

export interface ImplementationTaskContent extends BaseContent {
  type: 'implementation-task';
  task: string;
}

export interface CodeSnippet {
  language: ProgrammingLanguage;
  code: string;
  output?: string;
}

export interface HtmlElementContent extends BaseContent {
  type: 'html-element';
  title?: string;
  element: HtmlElementSnippet;
}

export interface HtmlElementSnippet {
  html: string;
  css?: string;
  js?: string;
}

export interface CodeTaskContent extends BaseContent {
  type: 'code-task';
  title?: string;
  task: CodeSnippet;
}

export interface ImageContent extends BaseContent {
  type: 'image';
  name: string;
  title?: string;
  url: string;
}

export type ProgrammingLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'go'
  | 'ruby'
  | 'php'
  | 'html'
  | 'css'
  | 'json'
  | 'swift'
  | 'kotlin'
  | 'rust'
  | 'sql'
  | 'shell' // bash, sh
  | 'markdown';
