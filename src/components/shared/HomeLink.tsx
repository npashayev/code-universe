'use client';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { useTranslations } from 'next-intl';

interface Props {
  className?: string;
}

const HomeLink = ({ className }: Props) => {
  const t = useTranslations('common');
  return (
    <Link href="/" className={cn('nav-item', className)}>
      <Home size={16} />
      <span className="nav-item-text">{t('home')}</span>
    </Link>
  );
};

export default HomeLink;
