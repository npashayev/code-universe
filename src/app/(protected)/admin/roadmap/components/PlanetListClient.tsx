'use client';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import type {
  ExtendedStatusOption,
  LanguageOption,
} from '@/types/reactSelectOptions';
import {
  extendedStatusOptions,
  languageOptions,
} from '@/lib/constants/reactSelectOptions';
import SortableList from '@/components/admin/planet-editor-layout/SortableList';
import type {
  AdminPlanetListResponse,
  AdminPlanetSummary,
} from '@/lib/planet/getPlanetList';

import Planet from './Planet';
import Header from './Header';

interface Props {
  data: AdminPlanetListResponse;
}

const PlanetListClient = ({ data }: Props) => {
  const [orderedPlanets, setOrderedPlanets] = useImmer(data.planets);

  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(
    languageOptions[0] as LanguageOption,
  );

  const [status, setStatus] = useState(
    extendedStatusOptions[0] as ExtendedStatusOption,
  );

  const [searchQuery, setSearchQuery] = useState('');

  const locale = currentLanguage.value;

  useEffect(() => {
    setOrderedPlanets(data.planets);
  }, [data, setOrderedPlanets]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedPlanets.findIndex((p) => p.id === active.id);
    const newIndex = orderedPlanets.findIndex((p) => p.id === over.id);

    const sorted = arrayMove(orderedPlanets, oldIndex, newIndex);

    const minIndex = Math.min(oldIndex, newIndex);
    const maxIndex = Math.max(oldIndex, newIndex);

    const updatedWithSteps = sorted.map((planet, idx) => {
      if (idx < minIndex || idx > maxIndex) return planet;
      return { ...planet, step: idx + 1 };
    });

    setOrderedPlanets(updatedWithSteps);
  };

  const filteredPlanets = orderedPlanets.filter((planet) => {
    const matchesSearch =
      planet.localized[locale].name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      planet.localized[locale].tags.some((tag) =>
        tag.tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesStatus =
      status.value === 'all' || planet.status === status.value;

    return matchesSearch && matchesStatus;
  });
  return (
    <div className="page">
      <Header
        data={data}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        status={status}
        setStatus={setStatus}
        orderedPlanets={orderedPlanets}
      />
      <main className="admin-main">
        <SortableList<AdminPlanetSummary>
          id="planet-sortable-list"
          className="space-y-3 pb-18"
          elements={filteredPlanets}
          handleDragEnd={handleDragEnd}
          renderItem={(planet) => (
            <Planet
              planet={planet}
              setOrderedPlanets={setOrderedPlanets}
              locale={locale}
            />
          )}
        />
      </main>
    </div>
  );
};

export default PlanetListClient;
