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
