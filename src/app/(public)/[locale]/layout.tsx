import Navbar from '@/components/layout/navbar/Navbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar />
      {children}
    </NextIntlClientProvider>
  );
}
