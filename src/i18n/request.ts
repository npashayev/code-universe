import { getRequestConfig } from 'next-intl/server';
import { SUPPORTED_LANGS } from '@/lib/constants/locale';
import { SupportedLanguage } from '@/types/planet';

function isSupportedLang(locale: string): locale is SupportedLanguage {
  return (SUPPORTED_LANGS as string[]).includes(locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const validLocale = locale && isSupportedLang(locale) ? locale : 'en';

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default,
  };
});
