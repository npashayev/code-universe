import { z } from 'zod';
import { SUPPORTED_LANGS } from '../constants/locale';

/** Validates URL and normalizes protocol-less URLs (e.g. "example.com" -> "https://example.com") */
export const urlSchema = (message = 'Invalid URL') =>
  z
    .string()
    .refine(
      val => {
        if (!val || !val.trim()) return false;
        try {
          const url = val.trim();
          const withProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url)
            ? url
            : `https://${url}`;
          new URL(withProtocol);
          return true;
        } catch {
          return false;
        }
      },
      { message },
    )
    .transform(val => {
      const url = val.trim();
      return /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url) ? url : `https://${url}`;
    });

export const statusEnum = z.enum(['draft', 'published']);
export const categoryEnum = z.enum(['html', 'css', 'javascript']);
const supportedLanguageEnum = z.enum(SUPPORTED_LANGS);
const titleLevelEnum = z.enum(['h2', 'h3', 'h4', 'h5', 'h6']);
const textVariantEnum = z.enum(['normal', 'note', 'warning', 'tip']);
const programmingLanguageEnum = z.enum([
  'javascript',
  'typescript',
  'html',
  'css',
  'json',
  'shell',
  'markdown',
]);

const imageMetadataSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const localizedStringSchema = z.record(supportedLanguageEnum, z.string());

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

const baseContentSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
});

const fullBaseContentSchema = baseContentSchema.extend({
  title: z.string().optional(),
  description: z.string().optional(),
});

const textContentSchema = baseContentSchema.extend({
  type: z.literal('text'),
  title: z.object({ level: titleLevelEnum, text: z.string() }).optional(),
  text: z.string(),
  variant: textVariantEnum,
});

const implementationTaskContentSchema = baseContentSchema.extend({
  type: z.literal('implementation-task'),
  title: z.string().optional(),
  task: z.string(),
});

const codeContentSchema = fullBaseContentSchema.extend({
  type: z.literal('code'),
  code: codeSnippetSchema,
});

const htmlElementContentSchema = fullBaseContentSchema.extend({
  type: z.literal('html-element'),
  element: htmlElementSnippetSchema,
});

const imageContentSchema = fullBaseContentSchema.extend({
  type: z.literal('image'),
  image: z.object({
    url: urlSchema(),
    alt: z.string(),
    metadata: imageMetadataSchema,
  }),
  pendingImageId: z.string().optional(),
});

/** Allows empty URL for pre-upload validation (when image is pending) */
const relaxedUrlSchema = z.union([urlSchema(), z.literal('')]);

/** Allows 0,0 for pending images before dimensions are read from file */
const imageMetadataSchemaPreSubmit = z.object({
  width: z.number().int().min(0),
  height: z.number().int().min(0),
});

const imageContentSchemaPreSubmit = fullBaseContentSchema.extend({
  type: z.literal('image'),
  image: z.object({
    url: relaxedUrlSchema,
    alt: z.string(),
    metadata: imageMetadataSchemaPreSubmit,
  }),
  pendingImageId: z.string().optional(),
});

const preSubmitPlanetContentSchema = z.discriminatedUnion('type', [
  textContentSchema,
  implementationTaskContentSchema,
  codeContentSchema,
  htmlElementContentSchema,
  imageContentSchemaPreSubmit,
]);

const planetContentSchema = z.discriminatedUnion('type', [
  textContentSchema,
  implementationTaskContentSchema,
  codeContentSchema,
  htmlElementContentSchema,
  imageContentSchema,
]);

export const localizedPlanetDataSchema = z.object({
  name: z.string(),
  tags: z.array(tagSchema).min(1, 'At least one tag is required.'),
  description: z.string(),
  researchTopics: z.array(researchTopicSchema),
  resources: z.array(resourceSchema).optional(),
  questions: z.array(questionSchema),
  contents: z.array(planetContentSchema),
});

export const createPlanetDataSchema = z.object({
  category: categoryEnum,
  status: statusEnum,
  image: z.object({
    url: urlSchema(),
    metadata: imageMetadataSchema,
    alt: localizedStringSchema,
  }),
  localized: z.record(supportedLanguageEnum, localizedPlanetDataSchema),
});

/** Use before image upload to validate structure; allows empty URLs for pending images */
export const preSubmitLocalizedPlanetDataSchema =
  localizedPlanetDataSchema.extend({
    contents: z.array(preSubmitPlanetContentSchema),
  });

export const preSubmitCreatePlanetDataSchema = z.object({
  category: categoryEnum,
  status: statusEnum,
  image: z.object({
    url: relaxedUrlSchema,
    metadata: imageMetadataSchemaPreSubmit,
    alt: localizedStringSchema,
  }),
  localized: z.record(
    supportedLanguageEnum,
    preSubmitLocalizedPlanetDataSchema,
  ),
});

export const updatePlanetDataSchema = createPlanetDataSchema.extend({
  id: z.string(),
  step: z.number().int(),
});
