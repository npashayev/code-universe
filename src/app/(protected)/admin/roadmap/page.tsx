import { use } from 'react';
import { redirect } from 'next/navigation';
import {
  PLANET_CATEGORY,
  PlanetCategory,
  PlanetFullListResponse,
  PlanetSummary,
} from '@/types/planet';
import PlanetListClient from './components/PlanetListClient';

interface Props {
  searchParams: Promise<{
    category?: string;
    status?: string;
  }>;
}

const MOCK_PLANETS: PlanetSummary[] = [
  {
    id: '1',
    step: 1,
    status: 'published',
    localized: {
      en: {
        name: 'Mastering React Hooks',
        tags: [
          { id: 't1', tag: 'React' },
          { id: 't2', tag: 'Frontend' },
          { id: 't3', tag: 'Intermediate' },
        ],
      },
      az: {
        name: 'React Hooks-a Yiyələnmək',
        tags: [
          { id: 't1', tag: 'React' },
          { id: 't2', tag: 'Frontend' },
          { id: 't3', tag: 'Orta' },
        ],
      },
    },
  },
  {
    id: '2',
    step: 2,
    status: 'published',
    localized: {
      en: {
        name: 'CSS Grid Mastery',
        tags: [
          { id: 't1', tag: 'CSS' },
          { id: 't2', tag: 'Design' },
          { id: 't3', tag: 'Layout' },
        ],
      },
      az: {
        name: 'CSS Grid-ə Yiyələnmək',
        tags: [
          { id: 't1', tag: 'CSS' },
          { id: 't2', tag: 'Dizayn' },
          { id: 't3', tag: 'Düzüm' },
        ],
      },
    },
  },
  {
    id: '3',
    step: 3,
    status: 'draft',
    localized: {
      en: {
        name: 'Next.js App Router Guide',
        tags: [
          { id: 't1', tag: 'Next.js' },
          { id: 't2', tag: 'React' },
          { id: 't3', tag: 'Advanced' },
        ],
      },
      az: {
        name: 'Next.js App Router Bələdçisi',
        tags: [
          { id: 't1', tag: 'Next.js' },
          { id: 't2', tag: 'React' },
          { id: 't3', tag: 'İrəliləmiş' },
        ],
      },
    },
  },
  {
    id: '4',
    step: 4,
    status: 'published',
    localized: {
      en: {
        name: 'TypeScript Fundamentals',
        tags: [
          { id: 't1', tag: 'TypeScript' },
          { id: 't2', tag: 'JavaScript' },
          { id: 't3', tag: 'Basics' },
        ],
      },
      az: {
        name: 'TypeScript Əsasları',
        tags: [
          { id: 't1', tag: 'TypeScript' },
          { id: 't2', tag: 'JavaScript' },
          { id: 't3', tag: 'Əsaslar' },
        ],
      },
    },
  },
  {
    id: '5',
    step: 5,
    status: 'draft',
    localized: {
      en: {
        name: 'Tailwind V4 Deep Dive',
        tags: [
          { id: 't1', tag: 'CSS' },
          { id: 't2', tag: 'Tailwind' },
          { id: 't3', tag: 'Experimental' },
        ],
      },
      az: {
        name: 'Tailwind V4 Dərin Öyrənmə',
        tags: [
          { id: 't1', tag: 'CSS' },
          { id: 't2', tag: 'Tailwind' },
          { id: 't3', tag: 'Eksperimental' },
        ],
      },
    },
  },
  {
    id: '6',
    step: 6,
    status: 'published',
    localized: {
      en: {
        name: 'Redux State Management',
        tags: [
          { id: 't1', tag: 'State' },
          { id: 't2', tag: 'React' },
          { id: 't3', tag: 'Architecture' },
        ],
      },
      az: {
        name: 'Redux ilə State İdarəetməsi',
        tags: [
          { id: 't1', tag: 'Vəziyyət' },
          { id: 't2', tag: 'React' },
          { id: 't3', tag: 'Arxitektura' },
        ],
      },
    },
  },
];

const MapPage = ({ searchParams }: Props) => {
  const { category = 'html' } = use(searchParams);

  function isPlanetCategory(value: string): value is PlanetCategory {
    return Object.keys(PLANET_CATEGORY).includes(value);
  }

  if (!isPlanetCategory(category)) {
    redirect('/admin/roadmap?category=html');
  }

  const MOCK_RESPONSE: PlanetFullListResponse = {
    category: 'html',
    planets: MOCK_PLANETS,
    stats: {
      total: 6,
      published: 4,
      drafts: 2,
    },
  };

  return <PlanetListClient category={category} data={MOCK_RESPONSE} />;
};

export default MapPage;
