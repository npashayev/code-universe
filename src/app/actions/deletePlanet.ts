'use server';
import { updateTag } from 'next/cache';

import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import { prisma } from '@/lib/prisma/prisma';
import { deleteR2Objects } from '@/lib/r2/deleteR2Objects';
import type { PlanetCategory, PlanetContent } from '@/types/planet';

export interface DeletePlanetPayload {
  planetId: string;
  category: PlanetCategory;
}

export const deletePlanet = async ({
  planetId,
  category,
}: DeletePlanetPayload) => {
  await ensureAdmin();

  if (!planetId) {
    throw new Error('Invalid planet ID.');
  }

  // Fetch planet + localizations to collect all image URLs before deletion
  const planet = await prisma.planet.findUnique({
    where: { id: planetId },
    include: { localized: true },
  });

  if (!planet) {
    throw new Error('Planet not found.');
  }

  // Collect every R2 image URL (main image + content images)
  const urlsToDelete: string[] = [];

  if (planet.image.url) {
    urlsToDelete.push(planet.image.url);
  }

  planet.localized.forEach((loc) => {
    const contents = (loc.contents ?? []) as unknown as PlanetContent[];
    contents.forEach((c) => {
      if (c.type === 'image' && c.image?.url) {
        urlsToDelete.push(c.image.url);
      }
    });
  });

  // Delete images from R2 FIRST — if this fails the planet stays in DB
  // so the user can retry via the delete button.
  const failedUrls = await deleteR2Objects(urlsToDelete);
  if (failedUrls.length > 0) {
    console.error('[deletePlanet] Failed to delete R2 images:', failedUrls);
    throw new Error(
      'Failed to delete planet images from storage. Planet was not deleted.',
    );
  }

  // Delete planet from DB (cascade deletes localizations)
  try {
    await prisma.planet.delete({
      where: { id: planetId },
    });

    updateTag(`planet-${planetId}`);
    updateTag(`planet-list-${category}`);
  } catch (err) {
    console.error('[deletePlanet] Database error:', err);
    throw new Error('Failed to delete planet. Please try again.');
  }
};
