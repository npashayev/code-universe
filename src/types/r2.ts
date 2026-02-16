export interface UploadResult {
  success: boolean;
  url: string;
  fileKey: string;
  r2Key: string; // actual key in R2, needed for deletion
}

export interface BatchUploadItem {
  file: File;
  fileKey: string;
  type: 'planet-main' | 'planet-content';
}

export interface PresignedItem {
  fileKey: string;
  r2Key: string;
  presignedUrl: string;
  publicUrl: string;
}

export interface UseR2UploadReturn {
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
