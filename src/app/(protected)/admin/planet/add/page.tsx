'use client';

import {
  CreatePlanetData,
  PLANET_CATEGORY,
  PlanetCategory,
} from '@/types/planet';
import { use, useState } from 'react';
import { useImmer } from 'use-immer';
import { LanguageOption } from '@/types/reactSelectOptions';
import { languageOptions } from '@/lib/constants/reactSelectOptions';
import { getInitialPlanetData } from '@/lib/utils/getInitialPlanetData';
import { PlanetEditorLayout } from '@/app/(protected)/admin/planet/shared/PlanetEditorLayout';
import { useSubmitPlanet } from '@/lib/hooks/admin/useSubmitPlanet';
import PlanetClient from '@/app/(public)/[locale]/roadmap/[category]/[planetId]/components/PlanetClient';
import { useOrphanedImageCleanup } from '@/lib/hooks/admin/useOrphanedImageCleanup';
import ExitPreviewButton from '@/components/shared/ExitPreviewButton';

interface Props {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default function AddPlanetPage({ searchParams }: Props) {
  const { category = 'html' } = use(searchParams);

  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(
    languageOptions[0],
  );

  function isPlanetCategory(value: string): value is PlanetCategory {
    return Object.keys(PLANET_CATEGORY).includes(value);
  }

  const planetCategory = isPlanetCategory(category) ? category : 'html';
  const [previewActive, setPreviewActive] = useState(false);
  const [planetData, setPlanetData] = useImmer<CreatePlanetData>(getInitialPlanetData(planetCategory));
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map());
  const [pendingContentImages, setPendingContentImages] = useState<Map<
    string,
    { previewUrl: string; file: File }
  >>(new Map());

  const { handleSubmit, isUploading, isSubmitting, progress } = useSubmitPlanet(
    {
      planetData,
      pendingFiles,
      setPendingFiles,
      pendingContentImages,
      setPendingContentImages,
    },
  );

  useOrphanedImageCleanup(planetData, setPendingContentImages);

  if (previewActive) {
    return (
      <>
        <ExitPreviewButton onClick={() => setPreviewActive(false)} />
        <PlanetClient
          planet={{
            ...planetData,
            id: '',
            image: {
              ...planetData.image,
              alt: planetData.image.alt[currentLanguage.value],
            },
            localized: planetData.localized[currentLanguage.value],
            prevPlanetId: null,
            nextPlanetId: null,
          }}
        />
      </>
    );
  }

  return (
    <PlanetEditorLayout
      planetData={planetData}
      setPlanetData={setPlanetData}
      currentLanguage={currentLanguage}
      setCurrentLanguage={setCurrentLanguage}
      pendingFiles={pendingFiles}
      setPendingFiles={setPendingFiles}
      pendingContentImages={pendingContentImages}
      setPendingContentImages={setPendingContentImages}
      setPreviewActive={setPreviewActive}
      title="Create New Planet"
      confirmTitle="Submit Planet"
      confirmBody="Are you sure you want to submit the planet?"
      submitIdleLabel="Submit"
      submitSubmittingLabel="Submitting..."
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isUploading={isUploading}
      progress={progress}
    />
  );
}