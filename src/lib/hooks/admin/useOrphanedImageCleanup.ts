import { useEffect, type Dispatch, type SetStateAction } from 'react';

import type {
  CreatePlanetData,
  PendingContentImageEntry,
  PlanetData,
} from '@/types/planet';
import { SUPPORTED_LANGS } from '@/lib/constants/planet';


export const useOrphanedImageCleanup = (
  planetData: PlanetData | CreatePlanetData,
  setPendingContentImages: Dispatch<
    SetStateAction<Map<string, PendingContentImageEntry>>
  >,
) => {
  useEffect(() => {
    const used = new Set<string>();
    SUPPORTED_LANGS.forEach((loc) => {
      planetData.localized[loc].contents.forEach((c) => {
        if (c.type === 'image' && c.pendingImageId) {
          used.add(c.pendingImageId);
        }
      });
    });

    queueMicrotask(() => {
      setPendingContentImages((prev) => {
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
  }, [planetData, setPendingContentImages]);
};
