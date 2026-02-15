import { CreatePlanetData, SupportedLanguage } from '@/types/planet';
import { Download, Globe, Upload } from 'lucide-react';
import { Updater } from 'use-immer';
import { useRef } from 'react';
import { localizedPlanetDataSchema } from '@/lib/validation/createPlanetDataSchema';
import { useR2Upload } from '@/lib/hooks/useR2Upload';
import { LanguageOption } from '@/types/reactSelectOptions';
import {
  CategorySelector,
  LanguageSelector,
  StatusSelector,
} from './Selectors';

type PendingContentImageEntry = {
  previewUrl: string;
  file: File;
  alt: string;
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
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleExportClick = () => {
    const jsonString = JSON.stringify(planetData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Generate filename from planet name or use default
    const planetName = planetData.localized[currentLanguage.value]?.name
      ? planetData.localized[currentLanguage.value].name
          .toLowerCase()
          .replace(/\s+/g, '-')
      : 'planet';

    // const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const link = document.createElement('a');
    link.href = url;
    link.download = `${planetName}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const result = localizedPlanetDataSchema.safeParse(parsed);

        if (!result.success) {
          console.error(
            "JSON content doesn't satisfy LocalizedPlanetData structure",
            result.error.format(), // Show detailed validation errors
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

    reader.readAsText(file);

    // allow re-uploading same file
    e.target.value = '';
  };

  const { batchUpload, deleteFile, isUploading, error, progress } =
    useR2Upload();

  const handleSubmit = async () => {
    const hasMainImage = pendingFiles.has('main-image');
    const hasContentImages = pendingContentImages.size > 0;

    if (!hasMainImage && !hasContentImages) {
      alert('Success');
      return;
    }

    try {
      const uploadItems: Array<{
        file: File;
        fileKey: string;
        type: 'planet-main' | 'planet-content';
      }> = [];

      if (hasMainImage) {
        const file = pendingFiles.get('main-image')!;
        uploadItems.push({ file, fileKey: 'main-image', type: 'planet-main' });
      }

      Array.from(pendingContentImages.entries()).forEach(
        ([id, { file }]) =>
          uploadItems.push({
            file,
            fileKey: id,
            type: 'planet-content',
          }),
      );

      const uploadResults = await batchUpload(uploadItems);

      if (!uploadResults) {
        console.error('Upload failed:', error);
        return;
      }

      setPlanetData(draft => {
        uploadResults.forEach((result, fileKey) => {
          if (fileKey === 'main-image') {
            draft.image.url = result.url;
          } else {
            const pendingId = fileKey;
            (['az', 'en'] as SupportedLanguage[]).forEach(loc => {
              draft.localized[loc].contents.forEach(c => {
                if (c.type === 'image' && c.pendingImageId === pendingId) {
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
    }
  };

  return (
    <header className="sticky top-0 z-100 bg-night backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <Globe className="text-orange-500" size={18} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Create New Planet
            </h1>
          </div>

          <div className="h-8 w-px bg-white/10 hidden md:block" />

          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector
              currentLanguage={currentLanguage}
              setCurrentLanguage={setCurrentLanguage}
            />

            <StatusSelector
              planetData={planetData}
              setPlanetData={setPlanetData}
            />

            <CategorySelector
              planetData={planetData}
              setPlanetData={setPlanetData}
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
        </div>

        <button className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer text-sm">
          Add Planet
        </button>
      </div>
    </header>
  );
};

export default Header;
