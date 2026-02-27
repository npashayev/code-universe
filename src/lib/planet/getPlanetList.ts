import 'server-only';

import { prisma } from '@/lib/prisma/prisma';
import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import type {
  PlanetCategory,
  PlanetListResponse,
  PlanetSummary,
  SupportedLanguage,
} from '@/types/planet';

export const getPlanetList = async (
  category: PlanetCategory,
): Promise<PlanetListResponse> => {
  await ensureAdmin();

  const planets = await prisma.planet
    .findMany({
      where: { category },
      orderBy: { step: 'asc' },
      select: {
        id: true,
        step: true,
        status: true,
        localized: {
          select: {
            lang: true,
            name: true,
            tags: true,
          },
        },
      },
    })
    .catch((err: unknown) => {
      console.error('[getPlanetListByCategory] Database error:', err);
      throw new Error('Failed to fetch planets.');
    });

  const mapped: PlanetSummary[] = planets.map(planet => {
    const localized = planet.localized.reduce(
      (acc, { lang, name, tags }) => {
        acc[lang as SupportedLanguage] = { name, tags };
        return acc;
      },
      {} as PlanetSummary['localized'],
    );

    return {
      id: planet.id,
      step: planet.step,
      status: planet.status,
      localized,
    };
  });

  const published = mapped.filter(p => p.status === 'published').length;
  const drafts = mapped.filter(p => p.status === 'draft').length;

  return {
    category,
    planets: mapped,
    stats: {
      total: mapped.length,
      published,
      drafts,
    },
  };
};
