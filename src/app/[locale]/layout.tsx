import Navbar from '@/components/layout/navbar/Navbar';
import { ReactNode } from 'react';

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
