export type SupportedLanguage = 'az' | 'en';
export type PlanetStatus = 'draft' | 'published';

export const PLANET_CATEGORY = {
  html: 'html',
  css: 'css',
  javascript: 'javascript',
} as const;

export type PlanetCategory =
  (typeof PLANET_CATEGORY)[keyof typeof PLANET_CATEGORY];

export interface PlanetTag {
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

export interface ImageData<T> {
  url: string;
  metadata: ImageMetadata;
  alt: T;
}

export interface ImageMetadata {
  width: number;
  height: number;
}

export interface CreatePlanetData {
  category: PlanetCategory;
  status: PlanetStatus;
  image: ImageData<LocalizedString>;
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
  tags: PlanetTag[];
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
  type: ContentType;
  label?: string;
  title?: string;
  description?: string;
}

export interface TextContent extends Omit<
  BaseContent,
  'title' | 'description'
> {
  type: 'text';
  title?: {
    level: TitleLevel;
    text: string;
  };
  text: string;
  variant: TextVariant;
}

export type TitleLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TextVariant = 'normal' | 'note' | 'warning' | 'tip';

export interface ImplementationTaskContent extends Omit<
  BaseContent,
  'description'
> {
  type: 'implementation-task';
  task: string;
}

export interface CodeContent extends BaseContent {
  type: 'code';
  code: CodeSnippet;
}

export interface CodeSnippet {
  language: ProgrammingLanguage;
  code: string;
  output?: string;
}

export const PROGRAMMING_LANGUAGE = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  shell: 'Shell',
  markdown: 'Markdown',
} as const;

export type ProgrammingLanguage = keyof typeof PROGRAMMING_LANGUAGE;

export interface HtmlElementContent extends BaseContent {
  type: 'html-element';
  element: HtmlElementSnippet;
}

export interface HtmlElementSnippet {
  html: string;
  css?: string;
  js?: string;
}

export interface ImageContent extends BaseContent {
  type: 'image';
  image: ImageData<string>;
  pendingImageId?: string;
}

// types for planet lists
export type LocalizedPlanetSummary = Pick<LocalizedPlanetData, 'name' | 'tags'>;

export type PlanetSummary = Pick<PlanetData, 'id' | 'step' | 'status'> & {
  localized: Record<SupportedLanguage, LocalizedPlanetSummary>;
};

interface PlanetListBase {
  category: PlanetCategory;
  planets: PlanetSummary[];
}

export interface PlanetListStats {
  total: number;
  published: number;
  drafts: number;
}

export interface PlanetFullListResponse extends PlanetListBase {
  stats: PlanetListStats;
}

export interface PlanetListResponse extends PlanetListBase {
  stats: PlanetListStats;
}
