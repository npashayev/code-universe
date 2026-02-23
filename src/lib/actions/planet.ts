'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma/prisma';
import { createPlanetDataSchema } from '@/lib/validation/planetDataSchema';

export type SubmitPlanetResult =
  | { success: true; planetId: string }
  | { success: false; error: string };

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }
}

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
