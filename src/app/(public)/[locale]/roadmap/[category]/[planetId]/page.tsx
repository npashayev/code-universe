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

export default async function PlanetPage({ params }: Props) {
  const { planetId, category } = await params;

  if (!isPlanetCategory(category)) notFound()

  const planet = await getPlanet(planetId, category);

  return <PlanetClient planet={planet} />;
}