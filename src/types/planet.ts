export interface PlanetData {
  id: string; // will be id from mongodb
  status: 'draft' | 'published';
  name: string;
  step: number; // integer
  tags: string[];
  image: {
    url: string;
    alt?: string;
    metadata: ImageMetadata;
  };
  description: string;
  researchTopics: string[];
  resources?: Resource[];
  questions: string[];
  contents: PlanetContent[];
  nextPlanetId: string | null; // should be appended when planet is fetched (if that is the better way)
  prevPlanetId: string | null; // should be appended when planet is fetched (if that is the better way)
}

export interface ImageMetadata {
  width: number;
  height: number;
}

export interface Resource {
  title?: string;
  label: string;
  url: string;
}

export type PlanetContent =
  | TextContent
  | ImplementationTaskContent
  | CodeContent
  | HtmlElementContent
  | ImageContent;

interface BaseContent {
  id: string;
  order: number; // integer - if specifically not provided defaults to - prev + 1
}

export interface TextContent extends BaseContent {
  type: 'text';
  title?: {
    level: TitleLevel;
    text: string;
  };
  text: string;
  variant: 'normal' | 'note' | 'warning' | 'tip'; // defaults to 'normal'
  markdown: boolean; // defaults to 'false'
}

export type TitleLevel = 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // defaults to 'p' if not provided
export interface ImplementationTaskContent extends BaseContent {
  type: 'implementation-task';
  title?: string;
  task: string;
}

export interface CodeContent extends BaseContent {
  type: 'code';
  title?: string;
  task: CodeSnippet;
}

export interface CodeSnippet {
  language: ProgrammingLanguage;
  code: string;
  output?: string;
}

export type ProgrammingLanguage =
  | 'javascript'
  | 'typescript'
  | 'html'
  | 'css'
  | 'json'
  | 'shell' // bash, sh
  | 'markdown';

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

export interface ImageContent extends BaseContent {
  type: 'image';
  title?: string;
  image: {
    url: string;
    alt?: string;
    metadata: ImageMetadata;
  };
}
