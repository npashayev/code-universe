import {
  LocalizedImage,
  NormalizedImage,
  SupportedLanguage,
} from '@/types/planet';

export const normalizeImage = (
  image: LocalizedImage,
  locale: SupportedLanguage,
): NormalizedImage => ({
  ...image,
  alt: image.alt[locale],
});
