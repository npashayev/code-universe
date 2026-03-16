'use server';
import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import { SUPPORTED_LANGS } from '@/lib/constants/planet';
import { prisma } from '@/lib/prisma/prisma';
import { deleteR2Objects } from '@/lib/r2/deleteR2Objects';
import { updatePlanetDataSchema } from '@/lib/validation/planetDataSchema';
import type {
  LocalizedImage,
  PlanetCategory,
  PlanetContent,
  PlanetStatus,
  SupportedLanguage,
} from '@/types/planet';

export type UpdatePlanetResult =
  | {
      success: true;
      planetId: string;
      r2Cleanup:
        | { success: true; deletedCount: number }
        | { success: false; failedUrls: string[] };
    }
  | { success: false; error: string };

export async function updatePlanet(data: unknown): Promise<UpdatePlanetResult> {
  await ensureAdmin();

  const parsed = updatePlanetDataSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const formErrors = parsed.error.flatten().formErrors;
    console.error('[updatePlanet] Validation failed:', {
      fieldErrors,
      formErrors,
    });
    return {
      success: false,
      error: 'Planet data does not satisfy the required structure.',
    };
  }

  const { id, step, ...rest } = parsed.data;

  let urlsToDelete: string[] = [];

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.planet.findUnique({
        where: { id },
        include: { localized: true },
      });

      if (!existing) {
        throw new Error('Planet not found.');
      }

      const oldMainUrl = existing.image.url;
      const newMainUrl = rest.image.url;

      const oldContentUrls = new Set<string>();
      const newContentUrls = new Set<string>();

      existing.localized.forEach((loc) => {
        const contents = (loc.contents ?? []) as unknown as PlanetContent[];
        contents.forEach((c) => {
          if (c.type === 'image' && c.image?.url) {
            oldContentUrls.add(c.image.url);
          }
        });
      });

      SUPPORTED_LANGS.forEach((lang) => {
        const locData = rest.localized[lang];
        locData.contents.forEach((c) => {
          if (c.type === 'image' && c.image.url) {
            newContentUrls.add(c.image.url);
          }
        });
      });

      const urlSet = new Set<string>();

      if (oldMainUrl && oldMainUrl !== newMainUrl) {
        urlSet.add(oldMainUrl);
      }

      oldContentUrls.forEach((url) => {
        if (!newContentUrls.has(url)) {
          urlSet.add(url);
        }
      });

      urlsToDelete = Array.from(urlSet);

      await tx.planet.update({
        where: { id },
        data: {
          category: rest.category as PlanetCategory,
          status: rest.status as PlanetStatus,
          step,
          image: rest.image as LocalizedImage,
        },
      });

      await tx.planetLocalization.deleteMany({
        where: { planetId: id },
      });

      await tx.planetLocalization.createMany({
        data: Object.entries(rest.localized).map(([lang, locData]) => ({
          lang: lang as SupportedLanguage,
          planetId: id,
          name: locData.name,
          tags: locData.tags,
          description: locData.description,
          researchTopics: locData.researchTopics,
          resources: locData.resources ?? null,
          questions: locData.questions,
          contents: locData.contents,
        })),
      });
    });
  } catch (err) {
    console.error('[updatePlanet] Database error:', err);
    return {
      success: false,
      error: 'Failed to update planet. Please try again.',
    };
  }

  // Delete orphaned / replaced images from R2 after DB update
  const failedUrls = await deleteR2Objects(urlsToDelete);

  const r2Cleanup:
    | { success: true; deletedCount: number }
    | { success: false; failedUrls: string[] } =
    failedUrls.length === 0
      ? { success: true, deletedCount: urlsToDelete.length }
      : { success: false, failedUrls };

  return { success: true as const, planetId: parsed.data.id, r2Cleanup };
}
