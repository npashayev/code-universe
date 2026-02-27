import { useLayoutEffect, useState } from 'react';

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  opacity: number;
}

export const useModalStars = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars(
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    );
  }, []);

  return stars;
};
