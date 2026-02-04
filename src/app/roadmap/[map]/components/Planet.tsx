import Link from 'next/link';
import styles from './Planet.module.scss';
import Image from 'next/image';
import { PlanetData } from '@/types/planet';

interface Props {
  map: string;
  planet: PlanetData;
}

const Planet = ({ map, planet }: Props) => {
  return (
    <div className={styles.planetCnr} id={`planet-${planet.id}`}>
      <Link scroll={false} href={`${map}/${planet.id}`} className={styles.link}>
        <Image
          src={planet.imageUrl}
          alt={planet.name}
          width={1024}
          height={1024}
          className={styles.planet}
          loading="lazy"
        />
      </Link>
      <div className={styles.orbit}>
        {planet.tags[0] && (
          <div className={styles.satellite}>{planet.tags[0]}</div>
        )}
        {planet.tags[1] && (
          <div className={styles.satellite}>{planet.tags[1]}</div>
        )}
        {planet.tags[2] && (
          <div className={styles.satellite}>{planet.tags[2]}</div>
        )}
        {planet.tags[3] && (
          <div className={styles.satellite}>{planet.tags[3]}</div>
        )}
      </div>
      <div className={styles.outerOrbit}></div>
    </div>
  );
};

export default Planet;
