import Link from 'next/link';
import styles from './Planet.module.scss';
import Image from 'next/image';
import { PlanetData } from '@/types/planet';

interface Props {
  map: string;
  planet: PlanetData;
}

const Planet = ({ map, planet }: Props) => {
  const locale = 'en';

  const { tags } = planet.localized[locale];
  return (
    <div className={styles.planetCnr} id={`planet-${planet.id}`}>
      <Link scroll={false} href={`${map}/${planet.id}`} className={styles.link}>
        <Image
          src={planet.image.url}
          alt={planet.image.alt[locale]}
          fill
          className={styles.planet}
          loading="lazy"
        />
      </Link>
      <div className={styles.orbit}>
        {tags[0].tag && <div className={styles.satellite}>{tags[0].tag}</div>}
        {tags[1].tag && <div className={styles.satellite}>{tags[1].tag}</div>}
        {tags[2].tag && <div className={styles.satellite}>{tags[2].tag}</div>}
        {tags[3].tag && <div className={styles.satellite}>{tags[3].tag}</div>}
      </div>
      <div className={styles.outerOrbit}></div>
    </div>
  );
};

export default Planet;
