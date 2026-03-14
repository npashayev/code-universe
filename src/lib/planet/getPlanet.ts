import 'server-only';
import {
  LocalizedImage,
  NormalizedImage,
  PlanetStatus,
  PlanetTag,
} from './../../types/planet';

import { prisma } from '@/lib/prisma/prisma';
import {
  LocalizedPlanetData,
  PlanetCategory,
  PlanetData,
  SupportedLanguage,
} from '@/types/planet';
import { getLocale } from 'next-intl/server';
import { normalizeImage } from '../utils/normalizeImage';
import { notFound } from 'next/navigation';
import { handlePrismaError } from '../utils/handlePrismaError';

export type PublicPlanetResponse = Omit<
  PlanetData,
  'localized' | 'image' | 'step'
> & {
  localized: LocalizedPlanetData;
  image: NormalizedImage;
};

export const getPlanet = async (
  id: string,
  category: PlanetCategory,
): Promise<PublicPlanetResponse> => {
  const locale = (await getLocale()) as SupportedLanguage;

  const planet = await prisma.planet
    .findUnique({
      where: { id, category },
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
  if (!localization) throw new Error(`Localization for "${locale}" not found.`);

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
};
