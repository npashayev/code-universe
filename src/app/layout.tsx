import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';

import NextAuthProvider from '@/components/providers/NextAuthProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import { toastOptions } from '@/lib/constants/toastOptions';

config.autoAddCss = false;
const nunito = Nunito({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'Code Universe',
    template: '%s | Code Universe',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        <NextAuthProvider>
          <QueryProvider>
            {children}
            <Analytics />
          </QueryProvider>
        </NextAuthProvider>
        <Toaster position="top-center" toastOptions={toastOptions} />
      </body>
    </html>
  );
}
