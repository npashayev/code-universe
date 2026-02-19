import { use } from 'react';
import PlanetClient from './components/PlanetClient';
import { PlanetData } from '@/types/planet';

interface Props {
  params: Promise<{
    planetId: string;
  }>;
}

export default function PlanetPage({ params }: Props) {
  const { planetId } = use(params);
  const planets: PlanetData[] = use(
    fetch('http://localhost:5000/planets').then(res => res.json()),
  );
  const planet = planets.find(p => p.id === planetId) as PlanetData;
  const locale = 'az';
  return <PlanetClient planet={planet} locale={locale} />;
}