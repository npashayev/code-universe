import { Updater } from 'use-immer';
import { CreatePlanetData, SupportedLanguage } from '@/types/planet';
import { BatchUploadItem } from '@/types/r2';
import { useR2Upload } from '@/lib/hooks/useR2Upload';
import { Dispatch, SetStateAction, useState } from 'react';

type PendingContentImageEntry = {
    previewUrl: string;
    file: File;
};

interface UseSubmitPlanetProps {
    planetData: CreatePlanetData;
    setPlanetData: Updater<CreatePlanetData>;
    pendingFiles: Map<string, File>;
    setPendingFiles: Dispatch<SetStateAction<Map<string, File>>>;
    pendingContentImages: Map<string, PendingContentImageEntry>;
    setPendingContentImages: Dispatch<SetStateAction<Map<string, PendingContentImageEntry>>>;
}

export const useSubmitPlanet = ({
    planetData,
    setPlanetData,
    pendingFiles,
    setPendingFiles,
    pendingContentImages,
    setPendingContentImages,
}: UseSubmitPlanetProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { batchUpload, isUploading, progress } = useR2Upload();

    const handleSubmit = async () => {
        const hasMainImage = pendingFiles.has('main-image');
        const hasContentImages = pendingContentImages.size > 0;

        if (!hasMainImage && !hasContentImages) {
            alert('No image selected');
            return;
        }

        try {
            const uploadItems: BatchUploadItem[] = [];

            if (hasMainImage) {
                const file = pendingFiles.get('main-image')!;
                uploadItems.push({ file, fileKey: 'main-image', type: 'planet-main' });
            }

            Array.from(pendingContentImages.entries()).forEach(([id, { file }]) =>
                uploadItems.push({ file, fileKey: id, type: 'planet-content' }),
            );

            const uploadResults = await batchUpload(uploadItems);

            if (!uploadResults) {
                alert('Upload failed. Please try again.');
                return;
            }

            setPlanetData(draft => {
                uploadResults.forEach((result, fileKey) => {
                    if (fileKey === 'main-image') {
                        draft.image.url = result.url;
                    } else {
                        (['az', 'en'] as SupportedLanguage[]).forEach(loc => {
                            draft.localized[loc].contents.forEach(c => {
                                if (c.type === 'image' && c.pendingImageId === fileKey) {
                                    c.image.url = result.url;
                                }
                            });
                        });
                    }
                });
            });

            setPendingFiles(new Map());
            setPendingContentImages(prev => {
                prev.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
                return new Map();
            });

            alert('Success');
        } catch (err) {
            console.error('Submission error:', err);
            alert('Something went wrong. Please try again.');
        }
    };

    return { handleSubmit, isSubmitting, isUploading, progress };
};