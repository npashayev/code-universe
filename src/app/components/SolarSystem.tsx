import Image from 'next/image';
import styles from './SolarSystem.module.scss';
import rocket from '@/assets/rocket.webp';

const SolarSystem = () => {
  return (
    <div className={styles.main}>
      <div className={styles.rocketOrbit}>
        <Image
          className={styles.rocket}
          src={rocket}
          alt="rocket"
          width={1024}
          height={1024}
        />
      </div>

      <div className={styles.solarSystem}>
        <div className={`${styles.sun} ${styles.circle}`}></div>
        <div className={`${styles.planet1} ${styles.circle}`}>
          <div className={`${styles.orbit1} ${styles.orbit} ${styles.circle}`}>
            <div className={`${styles.satellite1} ${styles.circle}`}></div>
          </div>
        </div>
        <div className={`${styles.planet2} ${styles.circle}`}>
          <div className={`${styles.orbit2} ${styles.orbit} ${styles.circle}`}>
            <div className={`${styles.satellite2} ${styles.circle}`}></div>
          </div>
          <div className={`${styles.orbit3} ${styles.orbit} ${styles.circle}`}>
            <div className={`${styles.satellite3} ${styles.circle}`}></div>
          </div>
          <div className={`${styles.orbit4} ${styles.orbit} ${styles.circle}`}>
            <div className={`${styles.satellite4} ${styles.circle}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarSystem;
