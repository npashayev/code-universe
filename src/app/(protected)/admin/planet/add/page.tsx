'use client';

import {
  CreatePlanetData,
  PLANET_CATEGORY,
  PlanetCategory,
  SupportedLanguage,
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
import { getInitialPlanetData } from '@/lib/utils/getInitialPlanetData';

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
  const [planetData, setPlanetData] = useImmer<CreatePlanetData>(getInitialPlanetData(planetCategory));
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map());
  const [pendingContentImages, setPendingContentImages] = useState<Map<
    string, { previewUrl: string; file: File }
  >>(new Map());

  const locale = currentLanguage.value;

  // Remove orphaned content images: keep only images referenced by any content in any locale
  useEffect(() => {
    const used = new Set<string>();
    (['az', 'en'] as SupportedLanguage[]).forEach(loc => {
      planetData.localized[loc].contents.forEach(c => {
        if (c.type === 'image' && c.pendingImageId) {
          used.add(c.pendingImageId);
        }
      });
    });

    queueMicrotask(() => {
      setPendingContentImages(prev => {
        let changed = false;
        const next = new Map(prev);
        for (const [key, entry] of next.entries()) {
          if (!used.has(key)) {
            URL.revokeObjectURL(entry.previewUrl);
            next.delete(key);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    });
  }, [planetData]);

  if (previewActive) {
    return (
      <PlanetClient
        planet={planetData}
        locale={currentLanguage.value}
      />
    );
  }

  return (
    <div className="page text-slate-100 font-sans selection:bg-orange-500/30 pb-40">
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

      <main className="admin-main flex items-start gap-10">
        <div className="flex-1 min-w-0 space-y-12">
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
      </main>
    </div>
  );
}