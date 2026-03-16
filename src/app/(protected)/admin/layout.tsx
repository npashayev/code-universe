import '@/styles/admin.css';
import { type Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { authOptions } from '@/lib/next-auth/authOptions';

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
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return children;
}
