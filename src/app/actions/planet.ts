'use server';

import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import { prisma } from '@/lib/prisma/prisma';
import { createPlanetDataSchema } from '@/lib/validation/planetDataSchema';

export type SubmitPlanetResult =
  | { success: true; planetId: string }
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

    const planet = await prisma.planet.create({
      data: {
        category: validData.category,
        status: validData.status,
        step,
        image: validData.image as object,
        nextPlanetId: null,
        prevPlanetId: null,
        localized: validData.localized as object,
      },
    });
    planetId = planet.id;
  } catch (err) {
    console.error('[submitPlanet] Database error:', err);
    return {
      success: false,
      error: 'Failed to submit planet. Please try again.',
    };
  }

  return { success: true as const, planetId };
}
