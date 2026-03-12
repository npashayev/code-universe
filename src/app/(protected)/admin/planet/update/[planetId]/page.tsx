import UpdatePlanetClient from '../components/UpdatePlanetClient';
import { getPlanetForEdit } from '@/lib/planet/getPlanet';

interface Props {
  params: Promise<{
    planetId: string;
  }>;
}

export default async function UpdatePlanetPage({ params }: Props) {
  const { planetId } = await params;
  const planet = await getPlanetForEdit(planetId);

  return (
    <UpdatePlanetClient
      planetId={planet.id}
      step={planet.step}
      initialData={planet.data}
    />
  );
}

