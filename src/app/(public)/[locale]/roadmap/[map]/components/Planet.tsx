import Link from 'next/link';
import styles from './Planet.module.scss';
import Image from 'next/image';
import { PublicPlanetSummary } from '@/lib/planet/getPlanetList';

interface Props {
  map: string;
  planet: PublicPlanetSummary;
}

const Planet = ({ map, planet }: Props) => {
  const { tags } = planet.localized;

  return (
    <section className={styles.planetCnr} id={`planet-${planet.id}`}>
      <Link scroll={false} href={`${map}/${planet.id}`} className={styles.link}>
        <Image
          src={planet.image.url}
          alt={planet.image.alt}
          fill
          className={styles.planet}
        />
      </Link>
      <div className={styles.orbit}>
        {tags[0].tag && <div className={styles.satellite}>{tags[0].tag}</div>}
        {tags[1].tag && <div className={styles.satellite}>{tags[1].tag}</div>}
        {tags[2].tag && <div className={styles.satellite}>{tags[2].tag}</div>}
        {tags[3].tag && <div className={styles.satellite}>{tags[3].tag}</div>}
      </div>
      <div className={styles.outerOrbit}></div>
    </section>
  );
};

export default Planet;
