import { CreatePlanetData } from '@/types/planet';
import { BatchUploadItem } from '@/types/r2';
import { useR2Upload } from '@/lib/hooks/useR2Upload';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import {
  preSubmitCreatePlanetDataSchema,
  createPlanetDataSchema,
} from '@/lib/validation/planetDataSchema';
import { SUPPORTED_LANGS } from '@/lib/constants/planet';
import { updatePlanet, UpdatePlanetResult } from '@/app/actions/updatePlanet';

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

type PendingContentImageEntry = {
  previewUrl: string;
  file: File;
};

interface UseUpdatePlanetProps {
  planetId: string;
  step: number;
  planetData: CreatePlanetData;
  pendingFiles: Map<string, File>;
  setPendingFiles: Dispatch<SetStateAction<Map<string, File>>>;
  pendingContentImages: Map<string, PendingContentImageEntry>;
  setPendingContentImages: Dispatch<
    SetStateAction<Map<string, PendingContentImageEntry>>
  >;
}

export const useUpdatePlanet = ({
  planetId,
  step,
  planetData,
  pendingFiles,
  setPendingFiles,
  pendingContentImages,
  setPendingContentImages,
}: UseUpdatePlanetProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { batchUpload, deleteFile, isUploading, progress } = useR2Upload();

  const rollbackImages = async (r2Keys: string[]) => {
    for (const r2Key of r2Keys) {
      await deleteFile(r2Key);
    }
  };

  const handleSubmit = async () => {
    const hasPendingMainImage = pendingFiles.has('main-image');
    const hasExistingMainImage = !!planetData.image.url;

    if (!hasPendingMainImage && !hasExistingMainImage) {
      toast.error('Main image is not added!');
      return;
    }

    // Validate structure before any image upload
    const preSubmitResult =
      preSubmitCreatePlanetDataSchema.safeParse(planetData);
    if (!preSubmitResult.success) {
      const { fieldErrors, formErrors } = preSubmitResult.error.flatten();
      console.error('[handleUpdate] Pre-upload validation failed:', {
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
    if (hasPendingMainImage) {
      const file = pendingFiles.get('main-image')!;
      uploadItems.push({ file, fileKey: 'main-image', type: 'planet-main' });
    }
    Array.from(pendingContentImages.entries()).forEach(([id, { file }]) =>
      uploadItems.push({ file, fileKey: id, type: 'planet-content' }),
    );

    const uploadResults =
      uploadItems.length > 0 ? await batchUpload(uploadItems) : new Map();

    if (!uploadResults) {
      toast.error('Image upload failed. Please try again.');
      setIsSubmitting(false);
      return;
    }

    const uploadedR2Keys = Array.from(uploadResults.values()).map(r => r.r2Key);

    const mergedData: CreatePlanetData = JSON.parse(JSON.stringify(planetData));
    uploadResults.forEach((result, fileKey) => {
      if (fileKey === 'main-image') {
        mergedData.image.url = result.url;
      } else {
        SUPPORTED_LANGS.forEach(loc => {
          mergedData.localized[loc].contents.forEach(c => {
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
      if (hasPendingMainImage) {
        const file = pendingFiles.get('main-image')!;
        metadataTasks.push(
          getImageDimensions(file).then(dims => {
            mergedData.image.metadata = dims;
          }),
        );
      }
      metadataTasks.push(
        ...Array.from(pendingContentImages.entries()).map(
          async ([fileKey, { file }]) => {
            const dims = await getImageDimensions(file);
            SUPPORTED_LANGS.forEach(loc => {
              mergedData.localized[loc].contents.forEach(c => {
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
      console.error('[handleUpdate] Failed to read image dimensions:', err);
      toast.error('Failed to process image dimensions. Please try again.');
      await rollbackImages(uploadedR2Keys);
      setIsSubmitting(false);
      return;
    }

    // Validate merged data before server call
    const mergedResult = createPlanetDataSchema.safeParse(mergedData);
    if (!mergedResult.success) {
      const { fieldErrors, formErrors } = mergedResult.error.flatten();
      console.error('[handleUpdate] Post-upload validation failed:', {
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

    let submitResult: UpdatePlanetResult;
    try {
      submitResult = await updatePlanet({
        ...mergedResult.data,
        id: planetId,
        step,
      });
    } catch (err) {
      console.error('[handleUpdate] Server action error:', err);
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

    toast.success('Planet updated successfully.');

    if (submitResult.r2Cleanup.success) {
      if (submitResult.r2Cleanup.deletedCount > 0) {
        toast.success('Removed images cleaned up from R2.');
      }
    } else {
      toast.error('Failed to delete removed images from R2.');
      console.error(
        '[handleUpdate] Dead files in R2 (delete manually):',
        submitResult.r2Cleanup.failedUrls,
      );
    }
    setIsSubmitting(false);
    setPendingFiles(new Map());
    setPendingContentImages(prev => {
      prev.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
      return new Map();
    });
  };

  return { handleSubmit, isSubmitting, isUploading, progress };
};
