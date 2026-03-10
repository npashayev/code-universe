import 'server-only';

import { prisma } from '@/lib/prisma/prisma';
import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import type {
  PlanetCategory,
  PlanetTag,
  SupportedLanguage,
  LocalizedPlanetData,
  PlanetData,
  NormalizedImage,
  LocalizedImage,
} from '@/types/planet';
import { getLocale } from 'next-intl/server';
import { normalizeImage } from '../utils/normalizeImage';

export type LocalizedPlanetSummary = Pick<LocalizedPlanetData, 'name' | 'tags'>;

export type AdminPlanetSummary = Pick<PlanetData, 'id' | 'step' | 'status'> & {
  localized: Record<SupportedLanguage, LocalizedPlanetSummary>;
};

export interface PlanetListStats {
  total: number;
  published: number;
  drafts: number;
}

export interface AdminPlanetListResponse {
  category: PlanetCategory;
  planets: AdminPlanetSummary[];
  stats: PlanetListStats;
}

// // Shared helper to map localized array to Record
// const mapLocalizedArray = (
//   localized: LocalizedQueryResult[],
// ): Record<SupportedLanguage, LocalizedPlanetSummary> =>
//   localized.reduce(
//     (acc, { lang, name, tags }) => {
//       acc[lang] = { name, tags };
//       return acc;
//     },
//     {} as Record<SupportedLanguage, LocalizedPlanetSummary>,
//   );

// // Mapper for admin (includes status)
// const mapToPlanetSummary = (
//   planets: PlanetListQueryResult[],
// ): PlanetSummary[] =>
//   planets.map(({ id, step, status, localized }) => ({
//     id,
//     step,
//     status,
//     localized: mapLocalizedArray(localized),
//   }));

// // Admin list with stats
// export const getPlanetList = async (
//   category: PlanetCategory,
// ): Promise<PlanetListResponse> => {
//   await ensureAdmin();

//   const planets = await prisma.planet
//     .findMany({
//       where: { category },
//       orderBy: { step: 'asc' },
//       select: {
//         id: true,
//         step: true,
//         status: true,
//         localized: { select: { lang: true, name: true, tags: true } },
//       },
//     })
//     .catch((err: unknown) => {
//       console.error('[getPlanetList] Database error:', err);
//       throw new Error('Failed to fetch planets.');
//     });

//   const mapped = mapToPlanetSummary(planets);
//   const published = mapped.filter(p => p.status === 'published').length;
//   const drafts = mapped.filter(p => p.status === 'draft').length;

//   return {
//     category,
//     planets: mapped,
//     stats: {
//       total: mapped.length,
//       published,
//       drafts,
//     },
//   };
// };

export type PublicPlanetSummary = Pick<PlanetData, 'id' | 'step'> & {
  image: NormalizedImage;
  localized: LocalizedPlanetSummary;
};

// Public planet list
export const getPublicPlanetList = async (
  category: PlanetCategory,
): Promise<PublicPlanetSummary[]> => {
  const locale = (await getLocale()) as SupportedLanguage;

  const planets = await prisma.planet
    .findMany({
      where: { category, status: 'published' },
      orderBy: { step: 'asc' },
      select: {
        id: true,
        step: true,
        image: true,
        localized: {
          where: { lang: locale },
          select: { name: true, tags: true },
        },
      },
    })
    .catch((err: unknown) => {
      console.error('[getPublicPlanetList] Database error:', err);
      throw new Error('Failed to fetch planets.');
    });

  return planets.map(planet => {
    const loc = planet.localized[0];
    return {
      id: planet.id,
      step: planet.step,
      image: normalizeImage(planet.image, locale),
      localized: { name: loc.name, tags: loc.tags as PlanetTag[] },
    };
  });
};
