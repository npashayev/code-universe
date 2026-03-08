import Navbar from '@/components/layout/navbar/Navbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode, use } from 'react';

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const messages = use(getMessages());
  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar />
      {children}
    </NextIntlClientProvider>
  );
}
