'use client';
import {
  PlanetCategory,
  PlanetFullListResponse,
  PlanetSummary,
} from '@/types/planet';
import Header from './Header';
import Planet from './Planet';
import { useState } from 'react';
import { LanguageOption } from '@/types/reactSelectOptions';
import { languageOptions } from '@/lib/constants/reactSelectOptions';
import { useImmer } from 'use-immer';
import SortableList from '@/components/shared/SortableList';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

interface Props {
  category: PlanetCategory;
  data: PlanetFullListResponse;
}

const PlanetListClient = ({ category, data }: Props) => {
  const [orderedPlanets, setOrderedPlanets] = useImmer(data.planets);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(
    languageOptions[0],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const locale = currentLanguage.value;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedPlanets.findIndex(p => p.id === active.id);
    const newIndex = orderedPlanets.findIndex(p => p.id === over.id);

    const sorted = arrayMove(orderedPlanets, oldIndex, newIndex);

    const minIndex = Math.min(oldIndex, newIndex);
    const maxIndex = Math.max(oldIndex, newIndex);

    const updatedWithSteps = sorted.map((planet, idx) => {
      if (idx < minIndex || idx > maxIndex) return planet;
      return { ...planet, step: idx + 1 };
    });

    setOrderedPlanets(updatedWithSteps);
  };


  const filteredPlanets = orderedPlanets.filter(planet => {
    return planet.localized[locale].name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      planet.localized[locale].tags.some(tag => tag.tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="page">
      <Header
        category={category}
        data={data}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="admin-main space-y-3">
        <SortableList<PlanetSummary>
          id="planet-sortable-list"
          className="space-y-3"
          elements={filteredPlanets}
          handleDragEnd={handleDragEnd}
          renderItem={planet => (
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
