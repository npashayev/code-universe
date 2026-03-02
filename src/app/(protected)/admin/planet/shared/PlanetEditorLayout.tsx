'use client';

import {
  CreatePlanetData,
  SupportedLanguage,
} from '@/types/planet';
import {
  Dispatch,
  SetStateAction,
} from 'react';
import { Updater } from 'use-immer';
import { LanguageOption } from '@/types/reactSelectOptions';
import BasicConfigurationSection from '@/app/(protected)/admin/planet/add/components/sections/BasicConfigurationSection';
import TagsSection from '@/app/(protected)/admin/planet/add/components/sections/TagsSection';
import ResearchTopicsSection from '@/app/(protected)/admin/planet/add/components/sections/ResearchTopicsSection';
import ExternalResourcesSection from '@/app/(protected)/admin/planet/add/components/sections/ExternalResourcesSection';
import QuestionsSection from '@/app/(protected)/admin/planet/add/components/sections/QuestionsSection';
import ContentsSection from '@/app/(protected)/admin/planet/add/components/sections/ContentsSection';
import ContentSidebar from '@/app/(protected)/admin/planet/add/components/ContentSidebar';
import {
  PlanetEditorHeader,
  PlanetEditorHeaderProps,
} from './PlanetEditorHeader';

type PendingContentImageEntry = {
  previewUrl: string;
  file: File;
};

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

