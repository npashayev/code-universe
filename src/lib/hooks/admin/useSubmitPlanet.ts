import { useState, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import type { CreatePlanetData, PendingContentImageEntry } from '@/types/planet';
import type { BatchUploadItem } from '@/types/r2';
import { useR2Upload } from '@/lib/hooks/admin/useR2Upload';
import {
  preSubmitCreatePlanetDataSchema,
  createPlanetDataSchema,
} from '@/lib/validation/planetDataSchema';
import { submitPlanet } from '@/app/actions/submitPlanet';
import { SUPPORTED_LANGS } from '@/lib/constants/planet';

function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

interface UseSubmitPlanetProps {
  planetData: CreatePlanetData;
  pendingFiles: Map<string, File>;
  setPendingFiles: Dispatch<SetStateAction<Map<string, File>>>;
  pendingContentImages: Map<string, PendingContentImageEntry>;
  setPendingContentImages: Dispatch<
    SetStateAction<Map<string, PendingContentImageEntry>>
  >;
}

export const useSubmitPlanet = ({
  planetData,
  pendingFiles,
  setPendingFiles,
  pendingContentImages,
  setPendingContentImages,
}: UseSubmitPlanetProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { batchUpload, deleteFile, isUploading, progress } = useR2Upload();

  const rollbackImages = async (r2Keys: string[]) => {
    for (const r2Key of r2Keys) {
      await deleteFile(r2Key);
    }
  };

  const handleSubmit = async () => {
    const hasMainImage = pendingFiles.has('main-image');

    if (!hasMainImage) {
      toast.error('Main image is not added!');
      return;
    }

    // Validate structure before any image upload
    const preSubmitResult =
      preSubmitCreatePlanetDataSchema.safeParse(planetData);
    if (!preSubmitResult.success) {
      const { fieldErrors, formErrors } = preSubmitResult.error.flatten();
      console.error('[handleSubmit] Pre-upload validation failed:', {
        fieldErrors,
        formErrors,
      });
      toast.error(
        'Planet data does not satisfy the required structure. Check the console for details.',
      );
      return;
    }

    setIsSubmitting(true);

    const uploadItems: BatchUploadItem[] = [];
    if (hasMainImage) {
      const file = pendingFiles.get('main-image');
      if (!file) return;
      uploadItems.push({ file, fileKey: 'main-image', type: 'planet-main' });
    }
    Array.from(pendingContentImages.entries()).forEach(([id, { file }]) =>
      uploadItems.push({ file, fileKey: id, type: 'planet-content' }),
    );

    const uploadResults = await batchUpload(uploadItems);

    if (!uploadResults) {
      toast.error('Image upload failed. Please try again.');
      setIsSubmitting(false);
      return;
    }

    const uploadedR2Keys = Array.from(uploadResults.values()).map(
      (r) => r.r2Key,
    );

    const mergedData: CreatePlanetData = JSON.parse(JSON.stringify(planetData));
    uploadResults.forEach((result, fileKey) => {
      if (fileKey === 'main-image') {
        mergedData.image.url = result.url;
      } else {
        SUPPORTED_LANGS.forEach((loc) => {
          mergedData.localized[loc].contents.forEach((c) => {
            if (c.type === 'image' && c.pendingImageId === fileKey) {
              c.image.url = result.url;
            }
          });
        });
      }
    });

    // Populate image metadata from file dimensions before validation (in parallel)
    try {
      const metadataTasks: Promise<void>[] = [];
      if (hasMainImage) {
        const file = pendingFiles.get('main-image');
        if (!file) return;
        metadataTasks.push(
          getImageDimensions(file).then((dims) => {
            mergedData.image.metadata = dims;
          }),
        );
      }
      metadataTasks.push(
        ...Array.from(pendingContentImages.entries()).map(
          async ([fileKey, { file }]) => {
            const dims = await getImageDimensions(file);
            SUPPORTED_LANGS.forEach((loc) => {
              mergedData.localized[loc].contents.forEach((c) => {
                if (c.type === 'image' && c.pendingImageId === fileKey) {
                  c.image.metadata = dims;
                }
              });
            });
          },
        ),
      );
      await Promise.all(metadataTasks);
    } catch (err) {
      console.error('[handleSubmit] Failed to read image dimensions:', err);
      toast.error('Failed to process image dimensions. Please try again.');
      await rollbackImages(uploadedR2Keys);
      setIsSubmitting(false);
      return;
    }

    // Validate merged data before server call
    const mergedResult = createPlanetDataSchema.safeParse(mergedData);
    if (!mergedResult.success) {
      const { fieldErrors, formErrors } = mergedResult.error.flatten();
      console.error('[handleSubmit] Post-upload validation failed:', {
        fieldErrors,
        formErrors,
      });
      toast.error(
        'Planet data does not satisfy the required structure. Uploaded images will be removed.',
      );
      await rollbackImages(uploadedR2Keys);
      setIsSubmitting(false);
      return;
    }

    let submitResult: Awaited<ReturnType<typeof submitPlanet>>;
    try {
      submitResult = await submitPlanet(mergedResult.data);
    } catch (err) {
      console.error('[handleSubmit] Server action error:', err);
      toast.error(
        'An unexpected error occurred. Uploaded images will be removed.',
      );
      await rollbackImages(uploadedR2Keys);
      setIsSubmitting(false);
      return;
    }

    if (!submitResult.success) {
      toast.error(submitResult.error);
      await rollbackImages(uploadedR2Keys);
      setIsSubmitting(false);
      return;
    }

    toast.success('Planet submitted successfully.');
    setIsSubmitting(false);
    setPendingFiles(new Map());
    setPendingContentImages((prev) => {
      prev.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
      return new Map();
    });
    router.push(
      `/roadmap/${mergedResult.data.category}/${submitResult.planetId}`,
    );
  };

  return { handleSubmit, isSubmitting, isUploading, progress };
};
