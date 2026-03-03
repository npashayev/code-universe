import { PLANET_CATEGORY, PlanetCategory } from '@/types/planet';

export const isPlanetCategory = (value: string): value is PlanetCategory => {
  return Object.keys(PLANET_CATEGORY).includes(value);
};
