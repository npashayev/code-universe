'use client';

import { CATEGORY, CreatePlanetData, SupportedLanguage } from '@/types/planet';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import Header from './components/Header';
import BasicConfigurationSection from './components/BasicConfigurationSection';
import TagsSection from './components/TagsSection';
import ResearchTopicsSection from './components/ResearchTopicsSection';
import ExternalResourcesSection from './components/ExternalResourcesSection';
import QuestionsSection from './components/QuestionsSection';
import ContentsSection from './components/ContentsSection';
import ContentSidebar from './components/ContentSidebar';

export interface LanguageOption {
  value: SupportedLanguage;
  label: string;
}

const languageOptions: LanguageOption[] = [
  { value: 'en', label: 'English' },
  { value: 'az', label: 'Azerbaijani' },
];

const AddPlanetPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(
    languageOptions[0],
  );

  const [planetData, setPlanetData] = useImmer<CreatePlanetData>({
    category: CATEGORY.html,
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

  const locale = currentLanguage.value;

  // useEffect(() => console.log(planetData), [planetData]);

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-orange-500/30 pb-24">
      <Header
        planetData={planetData}
        setPlanetData={setPlanetData}
        languageOptions={languageOptions}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
      />

      <div className="px-6 md:px-[16%] pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <BasicConfigurationSection
            planetData={planetData}
            setPlanetData={setPlanetData}
            locale={locale}
          />

          <TagsSection
            planetData={planetData}
            setPlanetData={setPlanetData}
            locale={locale}
          />

          <ResearchTopicsSection
            planetData={planetData}
            setPlanetData={setPlanetData}
            locale={locale}
          />

          <ExternalResourcesSection
            planetData={planetData}
            setPlanetData={setPlanetData}
            locale={locale}
          />

          <QuestionsSection
            planetData={planetData}
            setPlanetData={setPlanetData}
            locale={locale}
          />

          {planetData.localized[locale].contents.length > 0 && (
            <ContentsSection
              planetData={planetData}
              setPlanetData={setPlanetData}
              locale={locale}
            />
          )}
        </div>

        <ContentSidebar
          planetData={planetData}
          setPlanetData={setPlanetData}
          locale={locale}
        />
      </div>
    </div>
  );
};
export default AddPlanetPage;
