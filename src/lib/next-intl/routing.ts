import { defineRouting } from 'next-intl/routing';

import { SUPPORTED_LANGS } from '../constants/planet';

export const routing = defineRouting({
  locales: SUPPORTED_LANGS,
  defaultLocale: 'en',
  localeDetection: false,
});
