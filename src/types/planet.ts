export type SupportedLanguage = 'az' | 'en';

export interface PlanetData {
  id: string;
  category: string;
  status: 'draft' | 'published';
  step: number;
  image: {
    url: string;
    metadata: ImageMetadata;
    alt?: LocalizedString;
  };
  nextPlanetId: string | null;
  prevPlanetId: string | null;
  localized: Record<SupportedLanguage, LocalizedPlanetData>;
}

export interface LocalizedPlanetData {
  name: string;
  tags: string[];
  description: string;
  researchTopics: string[];
  resources?: Resource[];
  questions: string[];
  contents: PlanetContent[];
}

export type LocalizedString = Record<SupportedLanguage, string>;

export interface Resource {
  title?: string;
  label: string;
  url: string;
}

export interface ImageMetadata {
  width: number;
  height: number;
}

export type PlanetContent =
  | TextContent
  | ImplementationTaskContent
  | CodeContent
  | HtmlElementContent
  | ImageContent;

interface BaseContent {
  id: string;
  order: number;
}

export interface TextContent extends BaseContent {
  type: 'text';
  title?: {
    level: TitleLevel;
    text: string;
  };
  text: string;
  variant: 'normal' | 'note' | 'warning' | 'tip';
  markdown: boolean;
}

export type TitleLevel = 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface ImplementationTaskContent extends BaseContent {
  type: 'implementation-task';
  title?: string;
  task: string;
}

export interface CodeContent extends BaseContent {
  type: 'code';
  title?: string;
  code: CodeSnippet;
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
  | 'shell'
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
