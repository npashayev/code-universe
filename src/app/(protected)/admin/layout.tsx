import '@/styles/admin.css';
import { type Metadata } from 'next';
import type { ReactNode } from 'react';

import { ensureAdmin } from '@/lib/auth/ensureAdmin';

export const metadata: Metadata = {
  title: {
    default: 'Code Universe Admin',
    template: '%s | Code Universe Admin',
  },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await ensureAdmin();
  return children;
}
