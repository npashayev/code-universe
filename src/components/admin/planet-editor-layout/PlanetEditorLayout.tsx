'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { Updater } from 'use-immer';

import type { CreatePlanetData, PendingContentImageEntry, SupportedLanguage } from '@/types/planet';
import type { LanguageOption } from '@/types/reactSelectOptions';

import {
  type PlanetEditorHeaderProps, PlanetEditorHeader
} from './PlanetEditorHeader';
import BasicConfigurationSection from './sections/BasicConfigurationSection';
import TagsSection from './sections/TagsSection';
import ResearchTopicsSection from './sections/ResearchTopicsSection';
import ExternalResourcesSection from './sections/ExternalResourcesSection';
import QuestionsSection from './sections/QuestionsSection';
import ContentsSection from './sections/ContentsSection';
import ContentSidebar from './ContentSidebar';
interface PlanetEditorLayoutProps extends PlanetEditorHeaderProps {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  currentLanguage: LanguageOption;
  setCurrentLanguage: Dispatch<SetStateAction<LanguageOption>>;
  pendingFiles: Map<string, File>;
  setPendingFiles: Dispatch<SetStateAction<Map<string, File>>>;
  pendingContentImages: Map<string, PendingContentImageEntry>;
  setPendingContentImages: Dispatch<
    SetStateAction<Map<string, PendingContentImageEntry>>
  >;
  setPreviewActive: Dispatch<SetStateAction<boolean>>;
}

export const PlanetEditorLayout = ({
  planetData,
  setPlanetData,
  currentLanguage,
  setCurrentLanguage,
  pendingFiles,
  setPendingFiles,
  pendingContentImages,
  setPendingContentImages,
  setPreviewActive,
  title,
  confirmTitle,
  confirmBody,
  submitIdleLabel,
  submitSubmittingLabel,
  onSubmit,
  isSubmitting,
  isUploading,
  progress,
}: PlanetEditorLayoutProps) => {
  const locale = currentLanguage.value as SupportedLanguage;

  return (
    <div className="page text-slate-100 font-sans selection:bg-orange-500/30 pb-40">
      <PlanetEditorHeader
        planetData={planetData}
        setPlanetData={setPlanetData}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        pendingFiles={pendingFiles}
        setPendingFiles={setPendingFiles}
        pendingContentImages={pendingContentImages}
        setPendingContentImages={setPendingContentImages}
        setPreviewActive={setPreviewActive}
        title={title}
        confirmTitle={confirmTitle}
        confirmBody={confirmBody}
        submitIdleLabel={submitIdleLabel}
        submitSubmittingLabel={submitSubmittingLabel}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        isUploading={isUploading}
        progress={progress}
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
};
