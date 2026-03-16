import styles from './page.module.scss';
import Planet from './components/Planet';
import MapSidebar from './components/MapSidebar';
import { isPlanetCategory } from '@/lib/utils/isPlanetCategory';
import { notFound } from 'next/navigation';
import { getPublicPlanetList } from '@/lib/planet/getPlanetList';
import UpdateLink from '@/components/admin/ui/UpdateLink';
import PrivateComponent from '@/components/admin/PrivateComponent';

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export default async function MapPage({ params }: Props) {
  const { category } = await params;

  if (!isPlanetCategory(category)) {
    notFound();
  }

  const planets = await getPublicPlanetList(category);
  console.log(planets)
  return (
    <main className={styles.page}>
      <PrivateComponent roles={['ADMIN']}>
        <UpdateLink
          className='fixed top-9 left-30'
          href={`/admin/roadmap?category=${category}`}
        />
      </PrivateComponent>

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
