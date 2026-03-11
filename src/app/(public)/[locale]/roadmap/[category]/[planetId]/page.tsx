import { use } from 'react';
import PlanetClient from './components/PlanetClient';
import { getPlanet } from '@/lib/planet/getPlanet';

interface Props {
  params: Promise<{
    planetId: string;
  }>;
}

export default function PlanetPage({ params }: Props) {
  const { planetId } = use(params);
  const planet = use(getPlanet(planetId));

  return <PlanetClient planet={planet} />;
}