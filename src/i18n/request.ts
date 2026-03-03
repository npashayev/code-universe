import { getRequestConfig } from 'next-intl/server';
import { SUPPORTED_LANGS } from '@/lib/constants/locale';
import { SupportedLanguage } from '@/types/planet';

function isSupportedLang(locale: string): locale is SupportedLanguage {
  return (SUPPORTED_LANGS as string[]).includes(locale);
}

export default getRequestConfig(async () => {
  const locale = 'en'; // we'll make this dynamic in the routing step

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
