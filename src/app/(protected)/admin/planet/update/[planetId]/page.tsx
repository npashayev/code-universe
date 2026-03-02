import { use } from 'react';
import UpdatePlanetClient from '../components/UpdatePlanetClient';
import { getPlanetForEdit } from '@/lib/planet/getPlanet';

interface Props {
  params: Promise<{
    planetId: string;
  }>;
}

export default function UpdatePlanetPage({ params }: Props) {
  const { planetId } = use(params);
  const planet = use(getPlanetForEdit(planetId));

  return (
    <UpdatePlanetClient
      planetId={planet.id}
      step={planet.step}
      initialData={planet.data}
    />
  );
}

