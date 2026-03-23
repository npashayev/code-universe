import { type Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import galaxy from '@/assets/galaxy.webp';

import SolarSystem from './components/SolarSystem';

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const description = `${t('firstDescription')} ${t('secondDescription')}`;
  return {
    description,
  };
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  return (
    <main className="page flex items-center justify-center gap-48 max-[1680px]:gap-36 text-white py-14 pl-64 max-[1680px]:pl-48 pr-[max(9%,80px)]">
      <SolarSystem />
      <div>
        <div className="flex items-center gap-6">
          <Image
            className="h-20 w-auto select-none"
            src={galaxy}
            alt="galaxy icon"
            width={512}
            height={512}
          />
          <h1 className="text-[clamp(40px,3vw,60px)] leading-tight">
            {t('title')}
          </h1>
        </div>
        <p className="text-2xl mt-12">{t('firstDescription')}</p>
        <p className="text-2xl mt-7">{t('secondDescription')}</p>
      </div>
      {/* <SplashCursor /> */}
    </main>
  );
}
