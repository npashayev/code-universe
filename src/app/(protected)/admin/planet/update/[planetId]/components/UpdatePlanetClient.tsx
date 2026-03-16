'use client';

import {
  CreatePlanetData,
} from '@/types/planet';
import { useState } from 'react';
import { useImmer } from 'use-immer';
import { LanguageOption } from '@/types/reactSelectOptions';
import { languageOptions } from '@/lib/constants/reactSelectOptions';
import { PlanetEditorLayout } from '@/components/admin/planet-editor-layout/PlanetEditorLayout';
import { useUpdatePlanet } from '@/lib/hooks/admin/useUpdatePlanet';
import PlanetDetails from '@/components/shared/planet-details/PlanetDetails';
import { useOrphanedImageCleanup } from '@/lib/hooks/admin/useOrphanedImageCleanup';
import ExitPreviewButton from '@/components/admin/ui/ExitPreviewButton';

interface PendingContentImageEntry {
  previewUrl: string;
  file: File;
}

interface Props {
  planetId: string;
  step: number;
  initialData: CreatePlanetData;
}

const UpdatePlanetClient = ({ planetId, step, initialData }: Props) => {
  const [currentLanguage, setCurrentLanguage] =
    useState<LanguageOption>(languageOptions[0]);

  const [previewActive, setPreviewActive] = useState(false);
  const [planetData, setPlanetData] = useImmer<CreatePlanetData>(initialData);
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(
    new Map(),
  );
  const [pendingContentImages, setPendingContentImages] = useState<
    Map<string, PendingContentImageEntry>
  >(new Map());

  const { handleSubmit, isSubmitting, isUploading, progress } = useUpdatePlanet(
    {
      planetId,
      step,
      planetData,
      pendingFiles,
      setPendingFiles,
      pendingContentImages,
      setPendingContentImages,
    },
  );

  // Remove orphaned content images: keep only images referenced by any content in any locale
  useOrphanedImageCleanup(planetData, setPendingContentImages);

  if (previewActive) {
    return (
      <>
        <ExitPreviewButton onClick={() => setPreviewActive(false)} />
        <PlanetDetails
          planet={{
            ...planetData,
            id: planetId,
            image: {
              ...planetData.image,
              alt: planetData.image.alt[currentLanguage.value]
            },
            localized: planetData.localized[currentLanguage.value],
            prevPlanetId: null,
            nextPlanetId: null
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
      title="Edit Planet"
      confirmTitle="Update Planet"
      confirmBody="Are you sure you want to save changes to this planet?"
      submitIdleLabel="Save changes"
      submitSubmittingLabel="Saving..."
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isUploading={isUploading}
      progress={progress}
    />
  );
};

export default UpdatePlanetClient;

