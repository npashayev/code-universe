'use client';
import { useImmer } from 'use-immer';
import { useState } from 'react';

import type { CreatePlanetData, PlanetCategory } from '@/types/planet';
import type { LanguageOption } from '@/types/reactSelectOptions';
import { languageOptions } from '@/lib/constants/reactSelectOptions';
import { getInitialPlanetData } from '@/lib/utils/getInitialPlanetData';
import { PlanetEditorLayout } from '@/components/admin/planet-editor-layout/PlanetEditorLayout';
import { useSubmitPlanet } from '@/lib/hooks/admin/useSubmitPlanet';
import PlanetDetails from '@/components/shared/planet-details/PlanetDetails';
import { useOrphanedImageCleanup } from '@/lib/hooks/admin/useOrphanedImageCleanup';
import ExitPreviewButton from '@/components/admin/ui/ExitPreviewButton';
import { PLANET_CATEGORY } from '@/lib/constants/planet';
interface Props {
  category: PlanetCategory;
}

const AddPlanetClient = ({ category }: Props) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(
    languageOptions[0] as LanguageOption,
  );

  function isPlanetCategory(value: string): value is PlanetCategory {
    return Object.keys(PLANET_CATEGORY).includes(value);
  }

  const planetCategory = isPlanetCategory(category) ? category : 'html';
  const [previewActive, setPreviewActive] = useState(false);
  const [planetData, setPlanetData] = useImmer<CreatePlanetData>(
    getInitialPlanetData(planetCategory),
  );
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(
    new Map(),
  );
  const [pendingContentImages, setPendingContentImages] = useState<
    Map<string, { previewUrl: string; file: File }>
  >(new Map());

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
        <PlanetDetails
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
};

export default AddPlanetClient;
