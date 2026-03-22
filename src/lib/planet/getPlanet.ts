import 'server-only';

import { notFound } from 'next/navigation';
import { cacheLife, cacheTag } from 'next/cache';
import { cache } from 'react';

import { prisma } from '@/lib/prisma/prisma';
import type {
  LocalizedPlanetData,
  PlanetCategory,
  PlanetData,
  SupportedLanguage,
  LocalizedImage,
  NormalizedImage,
  PlanetStatus,
  PlanetTag,
} from '@/types/planet';

import { normalizeImage } from '../utils/normalizeImage';
import { handlePrismaError } from '../utils/handlePrismaError';

export type PublicPlanetResponse = Omit<
  PlanetData,
  'localized' | 'image' | 'step'
> & {
  localized: LocalizedPlanetData;
  image: NormalizedImage;
};

export const getPlanet = cache(
  async (
    id: string,
    category: PlanetCategory,
    locale: SupportedLanguage,
  ): Promise<PublicPlanetResponse> => {
    'use cache';
    cacheLife('max');
    cacheTag(`planet-${id}`);

    const planet = await prisma.planet
      .findUnique({
        where: { id, category, status: 'published' },
        include: {
          localized: {
            where: { lang: locale },
            take: 1,
          },
        },
      })
      .catch((err: unknown) => handlePrismaError(err, 'getPlanet'));

    if (!planet) notFound();

    const localization = planet.localized[0];
    if (!localization)
      throw new Error(`Localization for "${locale}" not found.`);

    const [prevPlanet, nextPlanet] = await Promise.all([
      prisma.planet.findFirst({
        where: {
          category: planet.category,
          step: { lt: planet.step },
          status: 'published',
        },
        orderBy: { step: 'desc' },
        select: { id: true },
      }),
      prisma.planet.findFirst({
        where: {
          category: planet.category,
          step: { gt: planet.step },
          status: 'published',
        },
        orderBy: { step: 'asc' },
        select: { id: true },
      }),
    ]).catch((err: unknown) => {
      console.error('[getPlanet] Database error fetching siblings:', err);
      throw new Error('Failed to fetch planet.');
    });

    return {
      id: planet.id,
      category: planet.category as PlanetCategory,
      status: planet.status as PlanetStatus,
      image: normalizeImage(planet.image as LocalizedImage, locale),
      prevPlanetId: prevPlanet?.id ?? null,
      nextPlanetId: nextPlanet?.id ?? null,
      localized: {
        name: localization.name,
        tags: localization.tags as PlanetTag[],
        description: localization.description,
        researchTopics:
          localization.researchTopics as unknown as LocalizedPlanetData['researchTopics'],
        resources: (localization.resources ??
          []) as unknown as LocalizedPlanetData['resources'],
        questions:
          localization.questions as unknown as LocalizedPlanetData['questions'],
        contents:
          localization.contents as unknown as LocalizedPlanetData['contents'],
      },
    };
  },
);
