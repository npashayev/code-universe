import { type Metadata } from 'next';

import { getPlanetForEdit } from '@/lib/planet/getPlanetForEdit';

import UpdatePlanetClient from './components/UpdatePlanetClient';

interface Props {
  params: Promise<{
    planetId: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { planetId } = await params;
  const planet = await getPlanetForEdit(planetId);

  return {
    title: `Update: ${planet.data.localized['en'].name}`,
  };
};

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
