import { use } from 'react';
import { redirect } from 'next/navigation';
import PlanetListClient from './components/PlanetListClient';
import { getPlanetList } from '@/lib/planet/getPlanetList';
import { isPlanetCategory } from '@/lib/utils/isPlanetCategory';

interface Props {
  searchParams: Promise<{
    category?: string;
    status?: string;
  }>;
}

export default async function MapPage({ searchParams }: Props) {
  const { category = 'html' } = await searchParams;

  if (!isPlanetCategory(category)) {
    redirect('/admin/roadmap?category=html');
  }

  const data = await getPlanetList(category);

  return <PlanetListClient key={category} data={data} />;
}
