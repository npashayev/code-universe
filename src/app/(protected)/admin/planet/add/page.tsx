import { type Metadata } from 'next';

import { isPlanetCategory } from '@/lib/utils/isPlanetCategory';

import AddPlanetClient from './components/AddPlanetClient';

export const metadata: Metadata = {
  title: 'Add Planet',
};

interface Props {
  searchParams: Promise<{
    initialCategory?: string;
  }>;
}

export default async function AddPlanetPage({ searchParams }: Props) {
  const { initialCategory = 'html' } = await searchParams;

  if (!isPlanetCategory(initialCategory)) {
    throw new Error('Invalid category');
  }

  return <AddPlanetClient category={initialCategory} />;
}
