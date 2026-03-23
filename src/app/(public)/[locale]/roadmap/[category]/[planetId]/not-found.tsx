import { getTranslations } from 'next-intl/server';

import NotFoundContent from '@/components/shared/NotFoundContent';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <NotFoundContent text={t('planetNotFound')} />
  );
}
