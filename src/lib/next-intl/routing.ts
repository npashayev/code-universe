import { defineRouting } from 'next-intl/routing';
import { SUPPORTED_LANGS } from '@/lib/constants/locale';

export const routing = defineRouting({
  locales: SUPPORTED_LANGS,
  defaultLocale: 'en',
  localeDetection: false,
});
