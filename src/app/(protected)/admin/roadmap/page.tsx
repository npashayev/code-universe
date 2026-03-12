import { notFound } from 'next/navigation';
import PlanetListClient from './components/PlanetListClient';
import { isPlanetCategory } from '@/lib/utils/isPlanetCategory';
import { getAdminPlanetList } from '@/lib/planet/getPlanetList';

interface Props {
  searchParams: Promise<{
    category?: string;
    status?: string;
  }>;
}

export default async function MapPage({ searchParams }: Props) {
  const { category = 'html' } = await searchParams;

  if (!isPlanetCategory(category)) {
    notFound();
  }

  const data = await getAdminPlanetList(category);

  return <PlanetListClient key={category} data={data} />;
}
