import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import Navbar from '@/components/layout/navbar/Navbar';
import { routing } from '@/lib/next-intl/routing';

export const generateStaticParams = () =>
  routing.locales.map((lang) => ({
    locale: lang,
  }));

export default async function PublicLayout({
  params,
  children,
}: {
  params: Promise<{
    locale: string;
  }>;
  children: ReactNode;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar />
      {children}
    </NextIntlClientProvider>
  );
}
