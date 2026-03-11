import { use } from 'react';
import PlanetClient from './components/PlanetClient';
import { getPlanet } from '@/lib/planet/getPlanet';
import { isPlanetCategory } from '@/lib/utils/isPlanetCategory';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    category: string;
    planetId: string;
  }>;
}

export default function PlanetPage({ params }: Props) {
  const { planetId, category } = use(params);

  if (!isPlanetCategory(category)) notFound()

  const planet = use(getPlanet(planetId, category));


  return <PlanetClient planet={planet} />;
}