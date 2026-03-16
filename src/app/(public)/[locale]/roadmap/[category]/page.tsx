import { notFound } from 'next/navigation';
import { type Metadata } from 'next';

import { isPlanetCategory } from '@/lib/utils/isPlanetCategory';
import { getPublicPlanetList } from '@/lib/planet/getPlanetList';
import UpdateLink from '@/components/admin/ui/UpdateLink';
import PrivateComponent from '@/components/admin/PrivateComponent';
import { PLANET_CATEGORY } from '@/lib/constants/planet';

import MapSidebar from './components/MapSidebar';
import Planet from './components/Planet';
import styles from './page.module.scss';

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { category } = await params;

  if (!isPlanetCategory(category)) {
    notFound();
  }

  return {
    title: PLANET_CATEGORY[category]
  };
};

export default async function MapPage({ params }: Props) {
  const { category } = await params;

  if (!isPlanetCategory(category)) {
    notFound();
  }

  const planets = await getPublicPlanetList(category);

  return (
    <main className={styles.page}>
      <PrivateComponent roles={['ADMIN']}>
        <UpdateLink
          className="fixed top-9 left-30"
          href={`/admin/roadmap?category=${category}`}
        />
      </PrivateComponent>

      <div className={styles.wrapper}>
        <div className={styles.stars} />
        <div className={styles.stars2} />
        <div className={styles.stars3} />
      </div>
      <div className={styles.planetsCnr}>
        {planets.map((planet) => (
          <Planet key={planet.id} category={category} planet={planet} />
        ))}
      </div>
      <MapSidebar planets={planets} />
    </main>
  );
}
