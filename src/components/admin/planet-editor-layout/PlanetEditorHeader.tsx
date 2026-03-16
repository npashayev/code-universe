import { CreatePlanetData, PlanetCategory } from '@/types/planet';
import { Download, Upload } from 'lucide-react';
import { Updater } from 'use-immer';
import { Dispatch, SetStateAction, useState } from 'react';
import { LanguageOption } from '@/types/reactSelectOptions';
import {
  CategorySelector,
  LanguageSelector,
  StatusSelector,
} from '@/app/(protected)/admin/planet/add/components/Selectors';
import { categoryOptions } from '@/lib/constants/reactSelectOptions';
import DashboardLink from '@/components/admin/ui/DashboardLink';
import { usePlanetJsonIO } from '@/lib/hooks/admin/usePlanetJsonIO';
import Dialog from '@/components/ui/modal/Dialog';

type PendingContentImageEntry = {
  previewUrl: string;
  file: File;
};

export interface PlanetEditorHeaderProps {
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

  title: string;
  confirmTitle: string;
  confirmBody: string;
  submitIdleLabel: string;
  submitSubmittingLabel: string;

  onSubmit: () => void | Promise<void>;
  isSubmitting: boolean;
  isUploading: boolean;
  progress: {
    current: number;
    total: number;
  } | null;
}

export const PlanetEditorHeader = ({
  planetData,
  setPlanetData,
  currentLanguage,
  setCurrentLanguage,
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
}: PlanetEditorHeaderProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    handleImportClick,
    handleExportClick,
    handleFileChange,
    fileInputRef,
  } = usePlanetJsonIO({ planetData, setPlanetData, locale: currentLanguage.value });

  const handleConfirm = () => {
    onSubmit();
  };

  const submitLabel =
    progress && progress.total > 0
      ? `Uploading images ${progress.current} / ${progress.total}`
      : isUploading
        ? 'Uploading images...'
        : isSubmitting
          ? submitSubmittingLabel
          : submitIdleLabel;

  return (
    <header className="admin-page-header py-4">
      {modalOpen && (
        <Dialog
          title={confirmTitle}
          body={confirmBody}
          onConfirm={handleConfirm}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div className="flex items-center gap-6">
        <DashboardLink />
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <div className='flex items-center gap-4'>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
            aria-hidden
          />

          <button
            type="button"
            onClick={() => handleImportClick('full')}
            className="admin-header-icon-btn"
          >
            <Upload size={14} />
            Import Full JSON
          </button>

          <button
            type="button"
            onClick={() => handleImportClick('locale')}
            className="admin-header-icon-btn"
          >
            <Upload size={14} />
            Import Locale JSON
          </button>

          <button
            type="button"
            onClick={handleExportClick}
            className="admin-header-icon-btn"
          >
            <Download size={14} />
            Export JSON
          </button>
        </div>

        <div className='flex items-center gap-4'>
          <LanguageSelector
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
          />

          <StatusSelector planetData={planetData} setPlanetData={setPlanetData} />

          <CategorySelector
            value={
              categoryOptions.find(o => o.value === planetData.category) ||
              categoryOptions[0]
            }
            onCategoryChange={(category: PlanetCategory) =>
              setPlanetData(draft => {
                draft.category = category;
              })
            }
          />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => setPreviewActive(true)}
          className="header-button bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600"
        >
          Preview
        </button>
        <button
          onClick={() => setModalOpen(true)}
          disabled={isUploading || isSubmitting}
          className="header-button bg-orange-500 hover:bg-orange-600"
        >
          {submitLabel}
        </button>
      </div>
    </header>
  );
};
