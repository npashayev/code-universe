import 'server-only';

import { prisma } from '@/lib/prisma/prisma';
import { type PlanetCategory } from '@/types/planet';

import { ensureAdmin } from '../auth/ensureAdmin';
import { handlePrismaError } from '../utils/handlePrismaError';
import { PLANET_CATEGORY } from '../constants/planet';

import type { PlanetListStats } from './getPlanetList';

export interface CategoryStatsItem {
  category: PlanetCategory;
  stats: PlanetListStats;
}

export const getPlanetCategoryStats = async (): Promise<
  CategoryStatsItem[]
> => {
  await ensureAdmin();

  const grouped = await prisma.planet
    .groupBy({
      by: ['category', 'status'],
      _count: { _all: true },
    })
    .catch((err: unknown) => handlePrismaError(err, 'getPlanetCategoryStats'));

  const stats = (Object.keys(PLANET_CATEGORY) as PlanetCategory[]).map(
    (category): CategoryStatsItem => {
      const rows = grouped.filter((r) => r.category === category);
      const published =
        rows.find((r) => r.status === 'published')?._count._all ?? 0;
      const drafts = rows.find((r) => r.status === 'draft')?._count._all ?? 0;

      return {
        category,
        stats: {
          total: published + drafts,
          published,
          drafts,
        },
      };
    },
  );

  return stats;
};
