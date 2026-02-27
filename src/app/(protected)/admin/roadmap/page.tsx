import { use } from 'react';
import { redirect } from 'next/navigation';
import { PLANET_CATEGORY, PlanetCategory } from '@/types/planet';
import PlanetListClient from './components/PlanetListClient';
import { getPlanetList } from '@/lib/planet/getPlanetList';

interface Props {
  searchParams: Promise<{
    category?: string;
    status?: string;
  }>;
}

export default function MapPage({ searchParams }: Props) {
  const { category = 'html' } = use(searchParams);

  function isPlanetCategory(value: string): value is PlanetCategory {
    return Object.keys(PLANET_CATEGORY).includes(value);
  }
  if (!isPlanetCategory(category)) {
    redirect('/admin/roadmap?category=html');
  }

  const data = use(getPlanetList(category));

  return <PlanetListClient key={category} data={data} />;
}
