import { type Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import galaxy from '@/assets/galaxy.webp';

import SolarSystem from './components/SolarSystem';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('home');
  const description = `${t('firstDescription')} ${t('secondDescription')}`;
  return {
    description
  };
};

export default async function HomePage() {
  const t = await getTranslations('home');
  return (
    <main className="page flex items-center justify-center gap-48 text-white px-40 py-28 pl-64">
      <SolarSystem />
      <div>
        <div className="flex items-center justify-center gap-8">
          <Image
            className="h-32 w-auto select-none"
            src={galaxy}
            alt="galaxy icon"
            width={512}
            height={512}
          />
          <h1 className="text-6xl leading-tight">{t('title')}</h1>
        </div>
        <p className="text-3xl mt-12">{t('firstDescription')}</p>
        <p className="text-3xl mt-7">{t('secondDescription')}</p>
      </div>
      {/* <SplashCursor /> */}
    </main>
  );
}
