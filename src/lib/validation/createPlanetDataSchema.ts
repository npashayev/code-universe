import { z } from 'zod';

export const urlSchema = (message = 'Invalid URL') =>
  z.string().refine(
    val => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message },
  );

// Base Enums
const statusEnum = z.enum(['draft', 'published']);
const categoryEnum = z.enum(['HTML', 'CSS', 'Javascript']); // Updated to match CATEGORY values
const supportedLanguages = z.enum(['az', 'en']);
const titleLevelEnum = z.enum(['p', 'h2', 'h3', 'h4', 'h5', 'h6']);
const variantEnum = z.enum(['normal', 'note', 'warning', 'tip']);
const programmingLanguageEnum = z.enum([
  'Javascript', // Updated to match PROGRAMMING_LANGUAGE values
  'TypeScript',
  'HTML',
  'CSS',
  'JSON',
  'Shell',
  'Markdown',
]);

// Nested Types
const imageMetadataSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const localizedStringSchema = z.record(supportedLanguages, z.string());

const tagSchema = z.object({
  id: z.string(),
  tag: z.string(),
});

const researchTopicSchema = z.object({
  id: z.string(),
  topic: z.string(),
});

const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
});

const resourceSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  label: z.string(),
  url: urlSchema(),
});

const codeSnippetSchema = z.object({
  language: programmingLanguageEnum,
  code: z.string(),
  output: z.string().optional(),
});

const htmlElementSnippetSchema = z.object({
  html: z.string(),
  css: z.string().optional(),
  js: z.string().optional(),
});

// Base Content Schema (for shared fields)
const baseContentSchema = z.object({
  id: z.string(),
  order: z.number().int(),
  label: z.string().optional(), // Added label field
});

// PlanetContent Union
const textContentSchema = baseContentSchema.extend({
  type: z.literal('text'),
  title: z.object({ level: titleLevelEnum, text: z.string() }).optional(),
  text: z.string(),
  variant: variantEnum,
  // Removed markdown field (not in types)
});

const implementationTaskContentSchema = baseContentSchema.extend({
  type: z.literal('implementation-task'),
  title: z.string().optional(),
  task: z.string(),
});

const codeContentSchema = baseContentSchema.extend({
  type: z.literal('code'),
  title: z.string().optional(),
  code: codeSnippetSchema,
});

const htmlElementContentSchema = baseContentSchema.extend({
  type: z.literal('html-element'),
  title: z.string().optional(),
  element: htmlElementSnippetSchema,
});

const imageContentSchema = baseContentSchema.extend({
  type: z.literal('image'),
  title: z.string().optional(),
  image: z.object({
    url: urlSchema(),
    alt: z.string(),
    metadata: imageMetadataSchema,
  }),
});

const planetContentSchema = z.union([
  textContentSchema,
  implementationTaskContentSchema,
  codeContentSchema,
  htmlElementContentSchema,
  imageContentSchema,
]);

// Localized Planet Data
export const localizedPlanetDataSchema = z.object({
  name: z.string(),
  tags: z.array(tagSchema),
  description: z.string(),
  researchTopics: z.array(researchTopicSchema),
  resources: z.array(resourceSchema).optional(),
  questions: z.array(questionSchema),
  contents: z.array(planetContentSchema),
});

// CreatePlanetData Schema
export const createPlanetDataSchema = z.object({
  category: categoryEnum,
  status: statusEnum,
  image: z.object({
    url: urlSchema(),
    metadata: imageMetadataSchema,
    alt: localizedStringSchema,
  }),
  localized: z.record(supportedLanguages, localizedPlanetDataSchema),
});

// PlanetData Schema (extends CreatePlanetData with additional fields)
export const planetDataSchema = createPlanetDataSchema.extend({
  id: z.string(),
  step: z.number().int(),
  nextPlanetId: z.string().nullable(),
  prevPlanetId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type inference
// export type CreatePlanetDataType = z.infer<typeof createPlanetDataSchema>;
// export type PlanetDataType = z.infer<typeof planetDataSchema>;
