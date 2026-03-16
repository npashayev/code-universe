import 'server-only';
import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import { getInitialPlanetData } from '@/lib/utils/getInitialPlanetData';
import type {
  CreatePlanetData,
  LocalizedPlanetData,
  PlanetCategory,
  SupportedLanguage,
} from '@/types/planet';

import { prisma } from '../prisma/prisma';
import { handlePrismaError } from '../utils/handlePrismaError';
import { SUPPORTED_LANGS } from '../constants/planet';
export interface PlanetForEdit {
  id: string;
  step: number;
  data: CreatePlanetData;
}

export const getPlanetForEdit = async (id: string): Promise<PlanetForEdit> => {
  await ensureAdmin();

  const planet = await prisma.planet
    .findUnique({
      where: { id },
      include: {
        localized: true,
      },
    })
    .catch((err: unknown) => handlePrismaError(err, 'getPlanetForEdit'));

  if (!planet) {
    throw new Error('Planet not found.');
  }

  const base = getInitialPlanetData(planet.category as PlanetCategory);
  base.status = planet.status;
  base.image = planet.image as CreatePlanetData['image'];

  const localizedMap: Record<SupportedLanguage, LocalizedPlanetData> = {
    az: base.localized.az,
    en: base.localized.en,
  };

  for (const loc of planet.localized) {
    const lang = loc.lang as SupportedLanguage;
    localizedMap[lang] = {
      name: loc.name,
      tags: loc.tags,
      description: loc.description,
      researchTopics:
        loc.researchTopics as unknown as LocalizedPlanetData['researchTopics'],
      resources: (loc.resources ??
        []) as unknown as LocalizedPlanetData['resources'],
      questions: loc.questions as unknown as LocalizedPlanetData['questions'],
      contents: loc.contents as unknown as LocalizedPlanetData['contents'],
    };
  }

  // Ensure all supported languages exist
  SUPPORTED_LANGS.forEach((lang) => {
    if (!localizedMap[lang]) {
      localizedMap[lang] = base.localized[lang];
    }
  });

  base.localized = localizedMap;

  return {
    id: planet.id,
    step: planet.step,
    data: base,
  };
};
