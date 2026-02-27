'use server';
import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import { prisma } from '@/lib/prisma/prisma';
import { createPlanetDataSchema } from '@/lib/validation/planetDataSchema';
import { SupportedLanguage } from '@/types/planet';

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

    const result = await prisma.$transaction(async tx => {
      const planet = await tx.planet.create({
        data: {
          category: validData.category,
          status: validData.status,
          step,
          image: validData.image,
          nextPlanetId: null,
          prevPlanetId: null,
        },
      });

      await tx.planetLocalization.createMany({
        data: Object.entries(validData.localized).map(([lang, locData]) => ({
          lang: lang as SupportedLanguage,
          planetId: planet.id,
          name: locData.name,
          tags: locData.tags,
          description: locData.description,
          researchTopics: locData.researchTopics,
          resources: locData.resources ?? null,
          questions: locData.questions,
          contents: locData.contents,
        })),
      });

      return planet;
    });

    planetId = result.id;
  } catch (err) {
    console.error('[submitPlanet] Database error:', err);
    return {
      success: false,
      error: 'Failed to submit planet. Please try again.',
    };
  }

  return { success: true as const, planetId };
}

export type DeletePlanetResult =
  | { success: true }
  | { success: false; error: string };

export const deletePlanet = async (planetId: string): Promise<void> => {
  await ensureAdmin();

  if (!planetId) {
    throw new Error('Missing planet ID.');
  }

  try {
    await prisma.planet.delete({
      where: { id: planetId },
    });
  } catch (err) {
    console.error('[deletePlanet] Database error:', err);
    throw new Error('Failed to delete planet. Please try again.');
  }
};
