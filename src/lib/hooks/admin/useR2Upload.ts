import { useState } from 'react';
import toast from 'react-hot-toast';

import type { BatchUploadItem, UploadResult } from '@/types/r2';
import { presignUpload, deleteUpload } from '@/app/actions/upload';

export const useR2Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const upload = async (
    file: File,
    fileKey: string,
    type: 'planet-main' | 'planet-content' = 'planet-content',
  ): Promise<UploadResult | null> => {
    const results = await batchUpload([{ file, fileKey, type }]);
    return results ? (results.get(fileKey) ?? null) : null;
  };

  const batchUpload = async (
    items: BatchUploadItem[],
  ): Promise<Map<string, UploadResult> | null> => {
    setIsUploading(true);
    setError(null);
    setProgress({ current: 0, total: items.length });

    const uploadedR2Keys: string[] = [];
    const resultMap = new Map<string, UploadResult>();

    try {
      // get all presigned URLs in one request
      const { items: presignedItems } = await presignUpload(
        items.map(({ file, fileKey, type }) => ({
          fileKey,
          fileType: file.type,
          fileSize: file.size,
          type,
        })),
      );

      await Promise.all(
        presignedItems.map(
          async ({ fileKey, r2Key, presignedUrl, publicUrl }) => {
            const file = items.find((i) => i.fileKey === fileKey)?.file;
            if (!file) return;
            const uploadRes = await fetch(presignedUrl, {
              method: 'PUT',
              body: file,
              headers: { 'Content-Type': file.type },
            });

            if (!uploadRes.ok) {
              throw new Error(`Upload to R2 failed for ${fileKey}`);
            }

            uploadedR2Keys.push(r2Key);
            resultMap.set(fileKey, {
              success: true,
              url: publicUrl,
              fileKey,
              r2Key,
            });

            setProgress((prev) =>
              prev ? { ...prev, current: prev.current + 1 } : null,
            );
          },
        ),
      );

      setProgress(null);
      return resultMap;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Batch upload failed';
      setError(errorMessage);

      // Rollback using actual R2 keys
      toast.error('Upload failed, rolling back...');
      for (const r2Key of uploadedR2Keys) {
        await deleteFile(r2Key);
      }

      setProgress(null);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (r2Key: string): Promise<boolean> => {
    try {
      await deleteUpload(r2Key);
      return true;
    } catch (err) {
      toast.error('Delete failed');
      console.error('Delete failed:', err);
      return false;
    }
  };

  const reset = () => {
    setError(null);
    setProgress(null);
  };

  return {
    upload,
    batchUpload,
    deleteFile,
    isUploading,
    error,
    progress,
    reset,
  };
};
