import type { PlanetCategory } from '@/types/planet';

import { PLANET_CATEGORY } from '../constants/planet';

export const isPlanetCategory = (value: string): value is PlanetCategory => {
  return Object.keys(PLANET_CATEGORY).includes(value);
};
