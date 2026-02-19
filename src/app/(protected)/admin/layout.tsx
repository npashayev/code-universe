import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { ReactNode, use } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const session = use(getServerSession(authOptions));

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return <>{children}</>;
}
