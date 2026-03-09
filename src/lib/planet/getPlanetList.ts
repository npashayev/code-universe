import 'server-only';

import { prisma } from '@/lib/prisma/prisma';
import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import type {
  PlanetCategory,
  PlanetListResponse,
  PlanetSummary,
  PlanetSummaryWithImage,
  PlanetTag,
  LocalizedPlanetSummary,
  SupportedLanguage,
  ImageData,
  LocalizedString,
} from '@/types/planet';

// Shared localized query result type
type LocalizedQueryResult = {
  lang: SupportedLanguage;
  name: string;
  tags: PlanetTag[];
};

// Prisma query result type for admin (includes status)
interface PlanetListQueryResult {
  id: string;
  step: number;
  status: 'draft' | 'published';
  localized: LocalizedQueryResult[];
};

// Prisma query result type for public
interface PlanetListQueryResultPublic extends Omit<PlanetListQueryResult, 'status'> {
  image: ImageData<LocalizedString>;
};

// Shared helper to map localized array to Record
const mapLocalizedArray = (
  localized: LocalizedQueryResult[],
): Record<SupportedLanguage, LocalizedPlanetSummary> =>
  localized.reduce(
    (acc, { lang, name, tags }) => {
      acc[lang] = { name, tags };
      return acc;
    },
    {} as Record<SupportedLanguage, LocalizedPlanetSummary>,
  );

// Mapper for admin (includes status)
const mapToPlanetSummary = (
  planets: PlanetListQueryResult[],
): PlanetSummary[] =>
  planets.map(({ id, step, status, localized }) => ({
    id,
    step,
    status,
    localized: mapLocalizedArray(localized),
  }));

// Mapper for public (excludes status)
const mapToPlanetSummaryWithImage = (
  planets: PlanetListQueryResultPublic[],
): PlanetSummaryWithImage[] =>
  planets.map(({ id, step, image, localized }) => ({
    id,
    step,
    image,
    localized: mapLocalizedArray(localized),
  }));

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