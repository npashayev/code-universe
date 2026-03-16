import { z } from 'zod';
import {
  PLANET_CATEGORY,
  PLANET_STATUS,
  PROGRAMMING_LANGUAGE,
  SUPPORTED_LANGS,
  TEXT_VARIANTS,
  TITLE_LEVELS,
} from '../constants/planet';

// ---------- URL ----------

export const urlSchema = (message = 'Invalid URL') =>
  z
    .string()
    .refine(
      (val) => {
        if (!val?.trim()) return false;
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
    .transform((val) => {
      const url = val.trim();
      return /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url) ? url : `https://${url}`;
    });

const relaxedUrlSchema = z.union([urlSchema(), z.literal('')]);

// ---------- Enums ----------

export const statusEnum = z.enum(PLANET_STATUS);
export const categoryEnum = z.enum(Object.keys(PLANET_CATEGORY));
const supportedLanguageEnum = z.enum(SUPPORTED_LANGS);
const titleLevelEnum = z.enum(TITLE_LEVELS);
const textVariantEnum = z.enum(TEXT_VARIANTS);
const programmingLanguageEnum = z.enum(Object.keys(PROGRAMMING_LANGUAGE));

// ---------- Primitives ----------

const localizedStringSchema = z.record(supportedLanguageEnum, z.string());
const tagSchema = z.object({ id: z.string(), tag: z.string() });
const researchTopicSchema = z.object({ id: z.string(), topic: z.string() });
const questionSchema = z.object({ id: z.string(), question: z.string() });

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

// ---------- Image metadata ----------

const imageMetadataSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const imageMetadataSchemaRelaxed = z.object({
  width: z.number().int().min(0),
  height: z.number().int().min(0),
});

// ---------- Content schemas ----------

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

const createImageContentSchema = (relaxed: boolean) =>
  fullBaseContentSchema.extend({
    type: z.literal('image'),
    image: z.object({
      url: relaxed ? relaxedUrlSchema : urlSchema(),
      alt: z.string(),
      metadata: relaxed ? imageMetadataSchemaRelaxed : imageMetadataSchema,
    }),
    pendingImageId: z.string().optional(),
  });

const imageContentSchema = createImageContentSchema(false);
const imageContentSchemaRelaxed = createImageContentSchema(true);

const sharedContentSchemas = [
  textContentSchema,
  implementationTaskContentSchema,
  codeContentSchema,
  htmlElementContentSchema,
] as const;

const planetContentSchema = z.discriminatedUnion('type', [
  ...sharedContentSchemas,
  imageContentSchema,
]);

const preSubmitPlanetContentSchema = z.discriminatedUnion('type', [
  ...sharedContentSchemas,
  imageContentSchemaRelaxed,
]);

// ---------- Localized planet data ----------

export const localizedPlanetDataSchema = z.object({
  name: z.string(),
  tags: z.array(tagSchema).min(1, 'At least one tag is required.'),
  description: z.string(),
  researchTopics: z.array(researchTopicSchema),
  resources: z.array(resourceSchema).optional(),
  questions: z.array(questionSchema),
  contents: z.array(planetContentSchema),
});

const preSubmitLocalizedPlanetDataSchema = localizedPlanetDataSchema.extend({
  contents: z.array(preSubmitPlanetContentSchema),
});

// ---------- Planet data ----------

const createImageSchema = (relaxed: boolean) =>
  z.object({
    url: relaxed ? relaxedUrlSchema : urlSchema(),
    metadata: relaxed ? imageMetadataSchemaRelaxed : imageMetadataSchema,
    alt: localizedStringSchema,
  });

const createPlanetBaseSchema = (relaxed: boolean) =>
  z.object({
    category: categoryEnum,
    status: statusEnum,
    image: createImageSchema(relaxed),
    localized: z.record(
      supportedLanguageEnum,
      relaxed ? preSubmitLocalizedPlanetDataSchema : localizedPlanetDataSchema,
    ),
  });

export const createPlanetDataSchema = createPlanetBaseSchema(false);
export const preSubmitCreatePlanetDataSchema = createPlanetBaseSchema(true);

export const updatePlanetDataSchema = createPlanetDataSchema.extend({
  id: z.string(),
  step: z.number().int(),
});
