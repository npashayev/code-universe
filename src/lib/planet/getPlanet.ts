import 'server-only';

import { prisma } from '@/lib/prisma/prisma';
import { ensureAdmin } from '@/lib/auth/ensureAdmin';
import {
  CreatePlanetData,
  LocalizedPlanetData,
  PlanetCategory,
  PlanetData,
  SupportedLanguage,
} from '@/types/planet';
import { getInitialPlanetData } from '@/lib/utils/getInitialPlanetData';
import { SUPPORTED_LANGS } from '../constants/locale';

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
    .catch((err: unknown) => {
      console.error('[getPlanetForEdit] Database error:', err);
      throw new Error('Failed to fetch planet.');
    });

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
  SUPPORTED_LANGS.forEach(lang => {
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

export interface GetPlanetResponse extends Omit<PlanetData, 'localized'> {
  localized: LocalizedPlanetData;
}

export const getPlanet = async (
  id: string,
  locale: SupportedLanguage,
): Promise<GetPlanetResponse> => {
  try {
    const planet = await prisma.planet.findUnique({
      where: { id },
      include: {
        localized: {
          where: { lang: locale },
          take: 1,
        },
      },
    });

    if (!planet) {
      throw new Error('Planet not found.');
    }

    const localization = planet.localized[0];

    if (!localization) {
      throw new Error(`Localization for "${locale}" not found.`);
    }

    return {
      id: planet.id,
      category: planet.category as PlanetCategory,
      status: planet.status,
      step: planet.step,
      image: planet.image as PlanetData['image'],
      nextPlanetId: planet.nextPlanetId ?? null,
      prevPlanetId: planet.prevPlanetId ?? null,
      localized: {
        name: localization.name,
        tags: localization.tags,
        description: localization.description,
        researchTopics:
          localization.researchTopics as unknown as LocalizedPlanetData['researchTopics'],
        resources: (localization.resources ??
          []) as unknown as LocalizedPlanetData['resources'],
        questions:
          localization.questions as unknown as LocalizedPlanetData['questions'],
        contents:
          localization.contents as unknown as LocalizedPlanetData['contents'],
      },
      createdAt: planet.createdAt,
      updatedAt: planet.updatedAt,
    };
  } catch (err) {
    console.error('[getPlanet] Database error:', err);
    throw new Error('Failed to fetch planet.');
  }
};
