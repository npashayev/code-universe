import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { isPlanetCategory } from '@/lib/utils/isPlanetCategory';
import { getAdminPlanetList } from '@/lib/planet/getPlanetList';
import { PLANET_CATEGORY } from '@/lib/constants/planet';

import PlanetListClient from './components/PlanetListClient';


interface Props {
  searchParams: Promise<{
    category?: string;
    status?: string;
  }>;
}

export const generateMetadata = async ({ searchParams }: Props): Promise<Metadata> => {
  const { category = 'html' } = await searchParams;
  if (!isPlanetCategory(category)) {
    return {
      title: 'Invalid Category'
    };
  }

  return {
    title: `${PLANET_CATEGORY[category]} Roadmap`
  };
};

export default async function MapPage({ searchParams }: Props) {
  const { category = 'html' } = await searchParams;

  if (!isPlanetCategory(category)) {
    notFound();
  }

  const data = await getAdminPlanetList(category);

  return <PlanetListClient key={category} data={data} />;
}
