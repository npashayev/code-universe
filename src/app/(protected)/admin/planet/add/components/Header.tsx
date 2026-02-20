import {
  CreatePlanetData,
  PlanetCategory,
} from '@/types/planet';
import { Download, Upload } from 'lucide-react';
import { Updater } from 'use-immer';
import { Dispatch, SetStateAction } from 'react';
import { LanguageOption } from '@/types/reactSelectOptions';
import {
  CategorySelector,
  LanguageSelector,
  StatusSelector,
} from './Selectors';
import { categoryOptions } from '@/lib/constants/reactSelectOptions';
import DashboardLink from '@/app/(protected)/components/DashboardLink';
import { usePlanetJsonIO } from '@/lib/hooks/admin/usePlanetJsonIO';
import { useSubmitPlanet } from '@/lib/hooks/admin/useSubmitPlanet';

type PendingContentImageEntry = {
  previewUrl: string;
  file: File;
};

interface Props {
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

const Header = ({
  planetData,
  setPlanetData,
  currentLanguage,
  setCurrentLanguage,
  pendingFiles,
  setPendingFiles,
  pendingContentImages,
  setPendingContentImages,
  setPreviewActive,
}: Props) => {

  const { handleImportClick, handleExportClick, handleFileChange, fileInputRef } = usePlanetJsonIO({ planetData, setPlanetData, currentLanguage });

  const { handleSubmit, isUploading, isSubmitting, progress } = useSubmitPlanet({
    planetData,
    setPlanetData,
    pendingFiles,
    setPendingFiles,
    pendingContentImages,
    setPendingContentImages,
  });


  return (
    <header className="sticky top-0 flex justify-between items-center gap-6 z-100 bg-night border-b border-white/5 py-4 px-12">
      <div className="flex items-center gap-6">
        <DashboardLink />
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Create New Planet
        </h1>
      </div>

      <div className="flex items-center gap-4">
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

        {/* JSON Upload Trigger */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-all"
          >
            <Upload size={14} />
            Import JSON
          </button>
        </div>

        {/* JSON Export Trigger */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={handleExportClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-all"
          >
            <Download size={14} />
            Export JSON
          </button>
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
          onClick={handleSubmit}
          disabled={isUploading}
          className="header-button bg-orange-500 hover:bg-orange-600"
        >
          {
            progress && progress.total > 0
              ? `Uploading images ${progress.current} / ${progress.total}`
              : isUploading
                ? 'Uploading images...'
                : isSubmitting
                  ? 'Submitting...'
                  : 'Submit'
          }
        </button>
      </div>
    </header>
  );
};

export default Header;
