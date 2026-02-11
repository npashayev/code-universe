import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { use } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = use(getServerSession(authOptions));

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return <>{children}</>;
}
