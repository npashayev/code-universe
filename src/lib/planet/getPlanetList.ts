import 'server-only';

import { prisma } from '@/lib/prisma/prisma';
import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import type {
  PlanetCategory,
  PlanetListResponse,
  PlanetSummary,
  PlanetSummaryWithImage,
  SupportedLanguage,
} from '@/types/planet';

// Prisma query result type for admin (includes status)
type PlanetListQueryResult = {
  id: string;
  step: number;
  status: 'draft' | 'published';
  image: {
    url: string;
    metadata: { width: number; height: number };
    alt: Record<SupportedLanguage, string>;
  };
  localized: {
    lang: SupportedLanguage;
    name: string;
    tags: { id: string; tag: string }[];
  }[];
};

// Prisma query result type for public (status not needed)
type PlanetListQueryResultPublic = Omit<PlanetListQueryResult, 'status'>;

// Mapper for admin (includes status)
const mapToPlanetSummary = (
  planets: PlanetListQueryResult[],
): PlanetSummary[] => {
  return planets.map(planet => {
    const localized = planet.localized.reduce(
      (acc, { lang, name, tags }) => {
        acc[lang] = { name, tags };
        return acc;
      },
      {} as PlanetSummary['localized'],
    );

    return {
      id: planet.id,
      step: planet.step,
      status: planet.status,
      image: planet.image,
      localized,
    };
  });
};

// Mapper for public (excludes status)
const mapToPlanetSummaryWithImage = (
  planets: PlanetListQueryResultPublic[],
): PlanetSummaryWithImage[] => {
  return planets.map(planet => {
    const localized = planet.localized.reduce(
      (acc, { lang, name, tags }) => {
        acc[lang] = { name, tags };
        return acc;
      },
      {} as PlanetSummaryWithImage['localized'],
    );

    return {
      id: planet.id,
      step: planet.step,
      image: planet.image,
      localized,
    };
  });
};

// Admin list with stats
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
        image: true,
        localized: { select: { lang: true, name: true, tags: true } },
      },
    })
    .catch((err: unknown) => {
      console.error('[getPlanetList] Database error:', err);
      throw new Error('Failed to fetch planets.');
    });

  const mapped = mapToPlanetSummary(planets);

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

// Public list (only published) with image, no status
export const getPublicPlanetList = async (
  category: PlanetCategory,
): Promise<PlanetSummaryWithImage[]> => {
  const planets = await prisma.planet
    .findMany({
      where: { category, status: 'published' },
      orderBy: { step: 'asc' },
      select: {
        id: true,
        step: true,
        image: true,
        localized: { select: { lang: true, name: true, tags: true } },
      },
    })
    .catch((err: unknown) => {
      console.error('[getPublicPlanetList] Database error:', err);
      throw new Error('Failed to fetch planets.');
    });

  return mapToPlanetSummaryWithImage(planets);
};
