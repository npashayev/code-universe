export type SupportedLanguage = 'az' | 'en';
export type Status = 'draft' | 'published';

export const CATEGORY = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'Javascript',
} as const;

export type Category = (typeof CATEGORY)[keyof typeof CATEGORY];

export interface Tag {
  id: string;
  tag: string;
}

export interface ResearchTopic {
  id: string;
  topic: string;
}

export interface Question {
  id: string;
  question: string;
}

export interface CreatePlanetData {
  category: Category;
  status: Status;
  image: {
    url: string;
    metadata: ImageMetadata;
    alt: LocalizedString;
  };
  localized: Record<SupportedLanguage, LocalizedPlanetData>;
}

export interface PlanetData extends CreatePlanetData {
  id: string;
  step: number;
  nextPlanetId: string | null;
  prevPlanetId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalizedPlanetData {
  name: string;
  tags: Tag[];
  description: string;
  researchTopics: ResearchTopic[];
  resources?: Resource[];
  questions: Question[];
  contents: PlanetContent[];
}

export type LocalizedString = Record<SupportedLanguage, string>;

export interface Resource {
  id: string;
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

export const CONTENT_TYPE = {
  text: 'text',
  implementationTask: 'implementation-task',
  code: 'code',
  htmlElement: 'html-element',
  image: 'image',
} as const;

export type ContentType = (typeof CONTENT_TYPE)[keyof typeof CONTENT_TYPE];

export interface BaseContent {
  id: string;
  order: number;
  label?: string;
  type: ContentType;
}

export type TextVariant = 'normal' | 'note' | 'warning' | 'tip';

export interface TextContent extends BaseContent {
  type: 'text';
  title?: {
    level: TitleLevel;
    text: string;
  };
  text: string;
  variant: TextVariant;
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

export const PROGRAMMING_LANGUAGE = {
  javascript: 'Javascript',
  typescript: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  shell: 'Shell',
  markdown: 'Markdown',
} as const;

export type ProgrammingLanguage =
  (typeof PROGRAMMING_LANGUAGE)[keyof typeof PROGRAMMING_LANGUAGE];

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
    alt: string;
    metadata: ImageMetadata;
  };
}
