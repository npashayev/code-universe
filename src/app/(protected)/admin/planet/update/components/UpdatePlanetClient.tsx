'use client';

import {
  CreatePlanetData,
  SupportedLanguage,
} from '@/types/planet';
import { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { LanguageOption } from '@/types/reactSelectOptions';
import { languageOptions } from '@/lib/constants/reactSelectOptions';
import PlanetClient from '@/app/(public)/roadmap/[map]/[planetId]/components/PlanetClient';
import { PlanetEditorLayout } from '@/app/(protected)/admin/planet/shared/PlanetEditorLayout';
import { useUpdatePlanet } from '@/lib/hooks/admin/useUpdatePlanet';

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
  useEffect(() => {
    const used = new Set<string>();
    (['az', 'en'] as SupportedLanguage[]).forEach(loc => {
      planetData.localized[loc].contents.forEach(c => {
        if (c.type === 'image' && c.pendingImageId) {
          used.add(c.pendingImageId);
        }
      });
    });

    queueMicrotask(() => {
      setPendingContentImages(prev => {
        let changed = false;
        const next = new Map(prev);
        for (const [key, entry] of next.entries()) {
          if (!used.has(key)) {
            URL.revokeObjectURL(entry.previewUrl);
            next.delete(key);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    });
  }, [planetData]);

  if (previewActive) {
    return (
      <PlanetClient
        planet={planetData}
        locale={currentLanguage.value}
      />
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

