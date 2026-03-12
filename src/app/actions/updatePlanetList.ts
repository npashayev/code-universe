'use server';

import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import { AdminPlanetSummary } from '@/lib/planet/getPlanetList';
import { prisma } from '@/lib/prisma/prisma';
import { categoryEnum, statusEnum } from '@/lib/validation/planetDataSchema';
import { PlanetCategory } from '@/types/planet';
import { revalidatePath } from 'next/cache';
import z from 'zod';

interface UpdatePlanetListParams {
  category: PlanetCategory;
  planetList: Pick<AdminPlanetSummary, 'id' | 'step' | 'status'>[];
}

const planetListItemSchema = z.object({
  id: z.string(),
  step: z.number().int(),
  status: statusEnum,
});

const updatePlanetListSchema = z.object({
  category: categoryEnum,
  planetList: z.array(planetListItemSchema),
});

export const updatePlanetList = async ({
  category,
  planetList,
}: UpdatePlanetListParams): Promise<void> => {
  await ensureAdmin();

  const result = updatePlanetListSchema.safeParse({ category, planetList });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error('[updatePlanetList] Validation error:', errors);
    throw new Error('Invalid category or planet list data.');
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
