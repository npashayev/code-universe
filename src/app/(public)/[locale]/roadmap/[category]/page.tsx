import { use } from 'react';
import styles from './page.module.scss';
import Planet from './components/Planet';
import MapSidebar from './components/MapSidebar';
import { isPlanetCategory } from '@/lib/utils/isPlanetCategory';
import { notFound } from 'next/navigation';
import { getPublicPlanetList } from '@/lib/planet/getPlanetList';

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export default function MapPage({ params }: Props) {
  const { category } = use(params);

  if (!isPlanetCategory(category)) {
    notFound();
  }

  const planets = use(getPublicPlanetList(category));

  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.stars}></div>
        <div className={styles.stars2}></div>
        <div className={styles.stars3}></div>
      </div>
      <div className={styles.planetsCnr}>
        {planets.map(planet => (
          <Planet key={planet.id} category={category} planet={planet} />
        ))}
      </div>
      <MapSidebar planets={planets} />
    </main>
  );
}
