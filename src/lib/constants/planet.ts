export const SUPPORTED_LANGS = ['az', 'en'] as const;
export const PLANET_STATUS = ['draft', 'published'] as const;

export const PLANET_CATEGORY = {
  common: 'Common',
  html: 'HTML',
  css: 'CSS',
  javascript: 'Javascript',
} as const;

export const CONTENT_TYPE = {
  text: 'text',
  implementationTask: 'implementation-task',
  code: 'code',
  htmlElement: 'html-element',
  image: 'image',
} as const;

export const PROGRAMMING_LANGUAGE = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  shell: 'Shell',
  markdown: 'Markdown',
} as const;

export const TITLE_LEVELS = ['h2', 'h3', 'h4', 'h5', 'h6'] as const;
export const TEXT_VARIANTS = ['normal', 'note', 'warning', 'tip'] as const;
