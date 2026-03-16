'use client';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Props {
  className?: string;
}

const LogoutButton = ({ className }: Props) => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={cn('nav-item', className)}
    >
      <LogOut size={14} />
    </button>
  );
};

export default LogoutButton;
