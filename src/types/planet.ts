import type {
  CONTENT_TYPE,
  PLANET_CATEGORY,
  PLANET_STATUS,
  PROGRAMMING_LANGUAGE,
  SUPPORTED_LANGS,
  TEXT_VARIANTS,
  TITLE_LEVELS,
} from '@/lib/constants/planet';

export type SupportedLanguage = (typeof SUPPORTED_LANGS)[number];
export type PlanetStatus = (typeof PLANET_STATUS)[number];
export type PlanetCategory = keyof typeof PLANET_CATEGORY;

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

export type NormalizedImage = ImageData<string>;
export type LocalizedImage = ImageData<LocalizedString>;

export interface ImageMetadata {
  width: number;
  height: number;
}

export interface CreatePlanetData {
  category: PlanetCategory;
  status: PlanetStatus;
  image: LocalizedImage;
  localized: Record<SupportedLanguage, LocalizedPlanetData>;
}

export interface PlanetData extends CreatePlanetData {
  id: string;
  step: number;
  nextPlanetId: string | null;
  prevPlanetId: string | null;
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

export type TitleLevel = (typeof TITLE_LEVELS)[number];
export type TextVariant = (typeof TEXT_VARIANTS)[number];

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
  image: NormalizedImage;
  pendingImageId?: string;
}

export interface PendingContentImageEntry {
  previewUrl: string;
  file: File;
}
