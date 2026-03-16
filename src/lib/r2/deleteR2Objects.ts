import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { r2Client } from '@/lib/r2/r2Client';

// Attempts to delete R2 objects for the given public URLs.
// Returns an array of URLs that failed to delete (empty = all succeeded).

export const deleteR2Objects = async (urls: string[]): Promise<string[]> => {
  if (urls.length === 0) return [];

  const baseUrl = process.env.R2_PUBLIC_URL;
  const bucket = process.env.R2_BUCKET_NAME;
  if (!baseUrl || !bucket) {
    console.error(
      '[deleteR2Objects] R2 configuration is missing (R2_PUBLIC_URL or R2_BUCKET_NAME).',
    );
    return [...urls];
  }

  const urlToKey = new Map<string, string>();

  for (const url of urls) {
    if (!url) continue;
    try {
      let r2Key: string | null = null;

      if (url.startsWith(baseUrl)) {
        const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        r2Key = url.replace(prefix, '');
      } else {
        const parsed = new URL(url);
        r2Key = parsed.pathname.replace(/^\/+/, '');
      }

      if (r2Key) {
        urlToKey.set(url, r2Key);
      }
    } catch (e) {
      console.error(
        '[deleteR2Objects] Failed to parse R2 key from URL:',
        url,
        e,
      );
    }
  }

  const failedUrls: string[] = [];

  for (const [url, key] of urlToKey) {
    try {
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
    } catch (e) {
      console.error('[deleteR2Objects] Failed to delete R2 object:', key, e);
      failedUrls.push(url);
    }
  }

  return failedUrls;
};
