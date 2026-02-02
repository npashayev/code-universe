import { use } from 'react';
import styles from './page.module.scss';
import { PlanetData } from '@/lib/types/planet';
import Planet from './components/Planet';

interface Props {
  params: Promise<{
    map: string;
  }>;
}

const MapPage = ({ params }: Props) => {
  const { map } = use(params);

  const planets: PlanetData[] = use(
    fetch('http://localhost:5000/planets').then(res => res.json()),
  );

  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.stars}></div>
        <div className={styles.stars2}></div>
        <div className={styles.stars3}></div>
      </div>

      <div className={styles.planetsCnr}>
        {planets.map(planet => (
          <Planet key={planet.id} map={map} planet={planet} />
        ))}
      </div>
    </main>
  );
};

export default MapPage;
