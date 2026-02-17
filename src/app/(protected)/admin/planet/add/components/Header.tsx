import {
  CreatePlanetData,
  PlanetCategory,
  SupportedLanguage,
} from '@/types/planet';
import { Download, Globe, Upload } from 'lucide-react';
import { Updater } from 'use-immer';
import { Dispatch, SetStateAction, useRef } from 'react';
import { localizedPlanetDataSchema } from '@/lib/validation/planetDataSchema';
import { useR2Upload } from '@/lib/hooks/useR2Upload';
import { LanguageOption } from '@/types/reactSelectOptions';
import {
  CategorySelector,
  LanguageSelector,
  StatusSelector,
} from './Selectors';
import { BatchUploadItem } from '@/types/r2';
import { categoryOptions } from '@/lib/constants/reactSelectOptions';

type PendingContentImageEntry = {
  previewUrl: string;
  file: File;
};

interface Props {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  currentLanguage: LanguageOption;
  setCurrentLanguage: React.Dispatch<React.SetStateAction<LanguageOption>>;
  pendingFiles: Map<string, File>;
  setPendingFiles: React.Dispatch<React.SetStateAction<Map<string, File>>>;
  pendingContentImages: Map<string, PendingContentImageEntry>;
  setPendingContentImages: React.Dispatch<
    React.SetStateAction<Map<string, PendingContentImageEntry>>
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleExportClick = () => {
    let url: string | null = null;

    try {
      const jsonString = JSON.stringify(planetData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      url = URL.createObjectURL(blob);

      const planetName = planetData.localized[currentLanguage.value]?.name
        ? planetData.localized[currentLanguage.value].name
            .toLowerCase()
            .replace(/\s+/g, '-')
        : 'planet';

      const link = document.createElement('a');
      link.href = url;
      link.download = `${planetName}.json`;
      link.click();
    } catch (error) {
      console.error('Failed to export planet data:', error);
    } finally {
      if (url) {
        setTimeout(() => URL.revokeObjectURL(url!), 1000);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        if (typeof reader.result !== 'string') return;

        const parsed = JSON.parse(reader.result);
        const result = localizedPlanetDataSchema.safeParse(parsed);

        if (!result.success) {
          console.error(
            "JSON content doesn't satisfy LocalizedPlanetData structure",
            result.error.format(),
          );
          return;
        }

        setPlanetData(draft => {
          draft.localized[currentLanguage.value] = result.data;
        });
      } catch (err) {
        console.error('Invalid JSON file', err);
      }
    };

    reader.onerror = () => {
      console.error('Failed to read file', reader.error);
    };

    reader.readAsText(file);

    e.target.value = '';
  };

  const { batchUpload, isUploading } = useR2Upload();

  const handleSubmit = async () => {
    const hasMainImage = pendingFiles.has('main-image');
    const hasContentImages = pendingContentImages.size > 0;

    if (!hasMainImage && !hasContentImages) {
      alert('No image selected');
      return;
    }

    try {
      const uploadItems: BatchUploadItem[] = [];

      if (hasMainImage) {
        const file = pendingFiles.get('main-image')!;
        uploadItems.push({ file, fileKey: 'main-image', type: 'planet-main' });
      }

      Array.from(pendingContentImages.entries()).forEach(([id, { file }]) =>
        uploadItems.push({ file, fileKey: id, type: 'planet-content' }),
      );

      const uploadResults = await batchUpload(uploadItems);

      if (!uploadResults) {
        alert('Upload failed. Please try again.');
        return;
      }

      setPlanetData(draft => {
        uploadResults.forEach((result, fileKey) => {
          if (fileKey === 'main-image') {
            draft.image.url = result.url;
          } else {
            (['az', 'en'] as SupportedLanguage[]).forEach(loc => {
              draft.localized[loc].contents.forEach(c => {
                if (c.type === 'image' && c.pendingImageId === fileKey) {
                  c.image.url = result.url;
                }
              });
            });
          }
        });
      });

      setPendingFiles(new Map());
      setPendingContentImages(prev => {
        prev.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
        return new Map();
      });

      alert('Success');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <header className="sticky top-0 flex justify-between items-center gap-6 z-100 bg-night backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
            <Globe className="text-orange-500" size={18} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Create New Planet
          </h1>
        </div>

        <div className="h-8 w-px ml-6 bg-white/10 hidden md:block" />
      </div>

      <div className="hidden md:flex items-center gap-4">
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
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-all cursor-pointer"
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
            type="button"
            onClick={handleExportClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-all cursor-pointer"
          >
            <Download size={14} />
            Export JSON
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button
          type="button"
          onClick={() => setPreviewActive(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-base font-bold text-slate-300 transition-all cursor-pointer"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isUploading}
          className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 text-sm"
        >
          {isUploading ? 'Uploading…' : 'Add Planet'}
        </button>
      </div>
    </header>
  );
};

export default Header;
