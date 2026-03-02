'use server';
import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import { prisma } from '@/lib/prisma/prisma';
import {
  createPlanetDataSchema,
  updatePlanetDataSchema,
} from '@/lib/validation/planetDataSchema';
import {
  PlanetCategory,
  PlanetSummary,
  PlanetContent,
  SupportedLanguage,
} from '@/types/planet';
import { revalidatePath } from 'next/cache';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from '@/lib/r2/r2Client';

/**
 * Attempts to delete R2 objects for the given public URLs.
 * Returns an array of URLs that failed to delete (empty = all succeeded).
 */
async function deleteR2Objects(urls: string[]): Promise<string[]> {
  if (urls.length === 0) return [];

  const baseUrl = process.env.R2_PUBLIC_URL;
  const bucket = process.env.R2_BUCKET_NAME;
  if (!baseUrl || !bucket) {
    console.error('[deleteR2Objects] R2 configuration is missing (R2_PUBLIC_URL or R2_BUCKET_NAME).');
    return [...urls];
  }

  const urlToKey = new Map<string, string>();

  for (const url of urls) {
    if (!url) continue;
    try {
      let r2Key: string | null = null;

      if (url.startsWith(baseUrl)) {
        const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        r2Key = url.replace(prefix, '');
      } else {
        const parsed = new URL(url);
        r2Key = parsed.pathname.replace(/^\/+/, '');
      }

      if (r2Key) {
        urlToKey.set(url, r2Key);
      }
    } catch (e) {
      console.error('[deleteR2Objects] Failed to parse R2 key from URL:', url, e);
    }
  }

  const failedUrls: string[] = [];

  for (const [url, key] of urlToKey) {
    try {
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
    } catch (e) {
      console.error('[deleteR2Objects] Failed to delete R2 object:', key, e);
      failedUrls.push(url);
    }
  }

  return failedUrls;
}

export type SubmitPlanetResult =
  | { success: true; planetId: string }
  | { success: false; error: string };

export type UpdatePlanetResult =
  | {
      success: true;
      planetId: string;
      r2Cleanup:
        | { success: true; deletedCount: number }
        | { success: false; failedUrls: string[] };
    }
  | { success: false; error: string };

export async function submitPlanet(data: unknown): Promise<SubmitPlanetResult> {
  await ensureAdmin();

  const parsed = createPlanetDataSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const formErrors = parsed.error.flatten().formErrors;
    console.error('[submitPlanet] Validation failed:', {
      fieldErrors,
      formErrors,
    });
    return {
      success: false,
      error: 'Planet data does not satisfy the required structure.',
    };
  }

  const validData = parsed.data;
  let planetId: string;

  try {
    const maxStepPlanet = await prisma.planet.findFirst({
      where: { category: validData.category },
      orderBy: { step: 'desc' },
      select: { step: true },
    });

    const step = maxStepPlanet ? maxStepPlanet.step + 1 : 1;

    const result = await prisma.$transaction(async tx => {
      const planet = await tx.planet.create({
        data: {
          category: validData.category,
          status: validData.status,
          step,
          image: validData.image,
          nextPlanetId: null,
          prevPlanetId: null,
        },
      });

      await tx.planetLocalization.createMany({
        data: Object.entries(validData.localized).map(([lang, locData]) => ({
          lang: lang as SupportedLanguage,
          planetId: planet.id,
          name: locData.name,
          tags: locData.tags,
          description: locData.description,
          researchTopics: locData.researchTopics,
          resources: locData.resources ?? null,
          questions: locData.questions,
          contents: locData.contents,
        })),
      });

      return planet;
    });

    planetId = result.id;
  } catch (err) {
    console.error('[submitPlanet] Database error:', err);
    return {
      success: false,
      error: 'Failed to submit planet. Please try again.',
    };
  }

  return { success: true as const, planetId };
}

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
    await prisma.$transaction(async tx => {
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

      existing.localized.forEach(loc => {
        const contents = (loc.contents ?? []) as unknown as PlanetContent[];
        contents.forEach(c => {
          if (c.type === 'image' && c.image?.url) {
            oldContentUrls.add(c.image.url);
          }
        });
      });

      (['az', 'en'] as SupportedLanguage[]).forEach(lang => {
        const locData = rest.localized[lang];
        locData.contents.forEach(c => {
          if (c.type === 'image' && c.image.url) {
            newContentUrls.add(c.image.url);
          }
        });
      });

      const urlSet = new Set<string>();

      if (oldMainUrl && oldMainUrl !== newMainUrl) {
        urlSet.add(oldMainUrl);
      }

      oldContentUrls.forEach(url => {
        if (!newContentUrls.has(url)) {
          urlSet.add(url);
        }
      });

      urlsToDelete = Array.from(urlSet);

      await tx.planet.update({
        where: { id },
        data: {
          category: rest.category,
          status: rest.status,
          step,
          image: rest.image,
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

  const r2Cleanup: { success: true; deletedCount: number } | { success: false; failedUrls: string[] } =
    failedUrls.length === 0
      ? { success: true, deletedCount: urlsToDelete.length }
      : { success: false, failedUrls };

  revalidatePath(`/admin/roadmap?category=${parsed.data.category}`);

  return { success: true as const, planetId: parsed.data.id, r2Cleanup };
}

export type DeletePlanetResult =
  | { success: true }
  | { success: false; error: string };

export const deletePlanet = async (planetId: string): Promise<void> => {
  await ensureAdmin();

  if (!planetId) {
    throw new Error('Missing planet ID.');
  }

  // 1. Fetch planet + localizations to collect all image URLs before deletion
  const planet = await prisma.planet.findUnique({
    where: { id: planetId },
    include: { localized: true },
  });

  if (!planet) {
    throw new Error('Planet not found.');
  }

  // 2. Collect every R2 image URL (main image + content images)
  const urlsToDelete: string[] = [];

  if (planet.image.url) {
    urlsToDelete.push(planet.image.url);
  }

  planet.localized.forEach(loc => {
    const contents = (loc.contents ?? []) as unknown as PlanetContent[];
    contents.forEach(c => {
      if (c.type === 'image' && c.image?.url) {
        urlsToDelete.push(c.image.url);
      }
    });
  });

  // 3. Delete images from R2 FIRST — if this fails the planet stays in DB
  //    so the user can retry via the delete button.
  const failedUrls = await deleteR2Objects(urlsToDelete);
  if (failedUrls.length > 0) {
    console.error('[deletePlanet] Failed to delete R2 images:', failedUrls);
    throw new Error('Failed to delete planet images from storage. Planet was not deleted.');
  }

  // 4. Delete planet from DB (cascade deletes localizations)
  try {
    await prisma.planet.delete({
      where: { id: planetId },
    });
  } catch (err) {
    console.error('[deletePlanet] Database error:', err);
    throw new Error('Failed to delete planet. Please try again.');
  }
};

interface UpdatePlanetListParams {
  category: PlanetCategory;
  planetList: Pick<PlanetSummary, 'id' | 'step' | 'status'>[];
}

export const updatePlanetList = async ({
  category,
  planetList,
}: UpdatePlanetListParams): Promise<void> => {
  await ensureAdmin();

  if (!category || !planetList) {
    throw new Error('Missing category or planet list.');
  }

  try {
    await prisma.$transaction(
      planetList.map(({ id, step, status }) =>
        prisma.planet.update({
          where: { id, category },
          data: { step, status },
        }),
      ),
    );

    revalidatePath(`/admin/roadmap?category=${category}`);
  } catch (err) {
    console.error('[updatePlanetList] Database error:', err);
    throw new Error('Failed to update planet list. Please try again.');
  }
};
