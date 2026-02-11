import { useState } from 'react';

interface UploadResult {
  success: boolean;
  url: string;
  fileKey: string;
  r2Key: string;
}

interface BatchUploadItem {
  file: File;
  fileKey: string;
  type: 'planet-main' | 'planet-content';
}

interface UseR2UploadReturn {
  upload: (
    file: File,
    fileKey: string,
    type?: 'planet-main' | 'planet-content',
  ) => Promise<UploadResult | null>;
  batchUpload: (
    items: BatchUploadItem[],
  ) => Promise<Map<string, UploadResult> | null>;
  deleteFile: (r2Key: string) => Promise<boolean>;
  isUploading: boolean;
  error: string | null;
  progress: { current: number; total: number } | null;
  reset: () => void;
}

const WORKER_URL = 'https://image-upload-worker.codeuniverse-app.workers.dev';

export function useR2Upload(): UseR2UploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  // Single file upload
  const upload = async (
    file: File,
    fileKey: string,
    type: 'planet-main' | 'planet-content' = 'planet-content',
  ): Promise<UploadResult | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileKey', fileKey);
      formData.append('type', type);

      const response = await fetch(WORKER_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result: UploadResult = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Batch upload with rollback on failure
  const batchUpload = async (
    items: BatchUploadItem[],
  ): Promise<Map<string, UploadResult> | null> => {
    setIsUploading(true);
    setError(null);
    setProgress({ current: 0, total: items.length });

    const uploadedFiles: UploadResult[] = [];
    const resultMap = new Map<string, UploadResult>();

    try {
      for (let i = 0; i < items.length; i++) {
        const { file, fileKey, type } = items[i];

        setProgress({ current: i + 1, total: items.length });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileKey', fileKey);
        formData.append('type', type);

        const response = await fetch(WORKER_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Upload failed for ${fileKey}`);
        }

        const result: UploadResult = await response.json();
        uploadedFiles.push(result);
        resultMap.set(fileKey, result);
      }

      setProgress(null);
      return resultMap;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Batch upload failed';
      setError(errorMessage);

      // ROLLBACK: Delete all successfully uploaded files
      console.log('Upload failed, rolling back...');
      for (const uploaded of uploadedFiles) {
        await deleteFile(uploaded.r2Key);
      }

      setProgress(null);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete file from R2
  const deleteFile = async (r2Key: string): Promise<boolean> => {
    try {
      const response = await fetch(`${WORKER_URL}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ r2Key }),
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      return true;
    } catch (err) {
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
}
