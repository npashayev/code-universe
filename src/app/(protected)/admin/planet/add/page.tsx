'use client';

import {
  CreatePlanetData,
  PLANET_CATEGORY,
  PlanetCategory,
  PlanetData,
} from '@/types/planet';
import { use, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import Header from './components/Header';
import BasicConfigurationSection from './components/sections/BasicConfigurationSection';
import TagsSection from './components/sections/TagsSection';
import ResearchTopicsSection from './components/sections/ResearchTopicsSection';
import ExternalResourcesSection from './components/sections/ExternalResourcesSection';
import QuestionsSection from './components/sections/QuestionsSection';
import ContentsSection from './components/sections/ContentsSection';
import ContentSidebar from './components/ContentSidebar';
import { LanguageOption } from '@/types/reactSelectOptions';
import { languageOptions } from '@/lib/constants/reactSelectOptions';
import PlanetClient from '@/app/(public)/roadmap/[map]/[planetId]/components/PlanetClient';

interface Props {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default function AddPlanetPage({ searchParams }: Props) {
  const { category = 'html' } = use(searchParams);

  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(
    languageOptions[0],
  );

  function isPlanetCategory(value: string): value is PlanetCategory {
    return Object.keys(PLANET_CATEGORY).includes(value);
  }

  const planetCategory = isPlanetCategory(category) ? category : 'html';

  const [previewActive, setPreviewActive] = useState(false);

  const [planetData, setPlanetData] = useImmer<CreatePlanetData>({
    category: planetCategory,
    status: 'draft',
    image: {
      url: '',
      metadata: { width: 0, height: 0 },
      alt: {
        az: '',
        en: '',
      },
    },
    localized: {
      az: {
        name: '',
        tags: [],
        description: '',
        researchTopics: [],
        resources: [],
        questions: [],
        contents: [],
      },
      en: {
        name: '',
        tags: [],
        description: '',
        researchTopics: [],
        resources: [],
        questions: [],
        contents: [],
      },
    },
  });

  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(
    new Map(),
  );

const [pendingContentImages, setPendingContentImages] = useState<Map<string, { previewUrl: string; file: File }>>(new Map());

  const locale = currentLanguage.value;

  // useEffect(() => console.log(planetData), [planetData]);

  if (previewActive) {
    return (
      <div className="fixed w-screen h-screen bg-[radial-gradient(ellipse_at_bottom,#050914_0%,#000000_100%)] text-white">
        <PlanetClient
          planet={planetData as PlanetData}
          locale={currentLanguage.value}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-orange-500/30 pb-42">
      <Header
        planetData={planetData}
        setPlanetData={setPlanetData}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        pendingFiles={pendingFiles}
        setPendingFiles={setPendingFiles}
        pendingContentImages={pendingContentImages}
        setPendingContentImages={setPendingContentImages}
        setPreviewActive={setPreviewActive}
      />

      <div className="px-6 md:px-[16%] pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <BasicConfigurationSection
            planetData={planetData}
            setPlanetData={setPlanetData}
            locale={locale}
            setPendingFiles={setPendingFiles}
          />

          <TagsSection
            planetData={planetData}
            setPlanetData={setPlanetData}
            locale={locale}
          />

          <ResearchTopicsSection
            researchTopics={planetData.localized[locale].researchTopics}
            setPlanetData={setPlanetData}
            locale={locale}
          />

          <ExternalResourcesSection
            resources={planetData.localized[locale].resources}
            setPlanetData={setPlanetData}
            locale={locale}
          />

          <QuestionsSection
            questions={planetData.localized[locale].questions}
            setPlanetData={setPlanetData}
            locale={locale}
          />

          {planetData.localized[locale].contents.length > 0 && (
            <ContentsSection
              contents={planetData.localized[locale].contents}
              setPlanetData={setPlanetData}
              pendingContentImages={pendingContentImages}
              setPendingContentImages={setPendingContentImages}
              locale={locale}
            />
          )}
        </div>

        <ContentSidebar
          contents={planetData.localized[locale].contents}
          setPlanetData={setPlanetData}
          locale={locale}
        />
      </div>
    </div>
  );
}