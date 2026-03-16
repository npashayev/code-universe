import { getRequestConfig } from 'next-intl/server';
import { SupportedLanguage } from '@/types/planet';
import { routing } from '@/lib/next-intl/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const validLocale = (routing.locales as readonly string[]).includes(
    locale ?? '',
  )
    ? (locale as SupportedLanguage)
    : routing.defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default,
  };
});
