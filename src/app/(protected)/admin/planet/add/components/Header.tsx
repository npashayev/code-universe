import {
  CATEGORY,
  Category,
  CreatePlanetData,
  Status,
  SupportedLanguage,
} from '@/types/planet';
import {
  ChevronDown,
  Code,
  Download,
  Eye,
  Globe,
  Languages,
  Upload,
} from 'lucide-react';
import { Updater } from 'use-immer';
import Select from 'react-select';
import { LanguageOption } from '../page';
import { useRef } from 'react';
import { getAdminPageSelectStyles } from '@/lib/utils/getAdminPageSelectStyles';
import { localizedPlanetDataSchema } from '@/lib/validation/createPlanetDataSchema';
import { useR2Upload } from '@/lib/hooks/useR2Upload';

interface Props {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  languageOptions: LanguageOption[];
  currentLanguage: LanguageOption;
  setCurrentLanguage: (language: LanguageOption) => void;
  pendingFiles: Map<string, File>;
  setPendingFiles: React.Dispatch<React.SetStateAction<Map<string, File>>>;
}

type StatusOption = {
  label: 'Draft' | 'Published';
  value: Status;
};

const statusOptions: StatusOption[] = [
  {
    label: 'Draft',
    value: 'draft',
  },
  {
    label: 'Published',
    value: 'published',
  },
];

interface CategoryOption {
  label: Category;
  value: Category;
}

const categoryOptions: CategoryOption[] = Object.entries(CATEGORY).map(
  ([, value]) => ({
    label: value,
    value,
  }),
);

const Header = ({
  planetData,
  setPlanetData,
  currentLanguage,
  languageOptions,
  setCurrentLanguage,
  pendingFiles,
  setPendingFiles,
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
    if (pendingFiles.size === 0) {
      // No files to upload, submit directly
      alert('Success');
      return;
    }

    try {
      // Prepare batch upload items
      const uploadItems = Array.from(pendingFiles.entries()).map(
        ([fileKey, file]) => {
          // Determine type based on fileKey
          const type =
            fileKey === 'main-image' ? 'planet-main' : 'planet-content';

          return {
            file,
            fileKey,
            type: type as 'planet-main' | 'planet-content',
          };
        },
      );

      // Upload all files (with automatic rollback if any fails)
      const uploadResults = await batchUpload(uploadItems);

      if (!uploadResults) {
        // Upload failed, error is already set in hook
        console.error('Upload failed:', error);
        return;
      }

      // Update planetData with real R2 URLs
      setPlanetData(draft => {
        uploadResults.forEach((result, fileKey) => {
          if (fileKey === 'main-image') {
            // Update main planet image
            draft.image.url = result.url;
          } else if (fileKey.startsWith('content-')) {
            // Parse: "content-az-abc123" -> locale: "az", contentId: "abc123"
            const parts = fileKey.split('-');
            const locale = parts[1] as SupportedLanguage;
            const contentId = parts.slice(2).join('-'); // we join with '-' because randomUUID function gives us id containing dashes

            // Find and update the content block
            const content = draft.localized[locale].contents.find(
              c => c.id === contentId,
            );
            if (content && content.type === 'image') {
              content.image.url = result.url;
            }
          }
        });
      });

      // Clear pending files
      setPendingFiles(new Map());

      // Now submit to backend
      alert('Success');
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-60 bg-night backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
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
            <div className="relative group w-fit">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-orange-500 transition-colors z-10 pointer-events-none">
                <Languages size={14} />
              </div>

              <Select<LanguageOption, false>
                instanceId="language-select"
                value={currentLanguage}
                options={languageOptions}
                onChange={option => {
                  if (!option) return;
                  setCurrentLanguage(option);
                }}
                styles={getAdminPageSelectStyles<LanguageOption>()}
                isSearchable={false}
              />

              <ChevronDown
                size={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-orange-500 transition-colors">
                <Eye size={14} />
              </div>

              <Select<StatusOption, false>
                instanceId="status-select"
                value={
                  statusOptions.find(o => o.value === planetData.status) || null
                }
                options={statusOptions}
                onChange={option => {
                  if (!option) return;
                  setPlanetData(draft => {
                    draft.status = option.value;
                  });
                }}
                styles={getAdminPageSelectStyles<StatusOption>()}
                isSearchable={false}
              />

              <ChevronDown
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                size={12}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-orange-500 transition-colors">
                <Code size={16} />
              </div>

              <Select<CategoryOption, false>
                instanceId="category-select"
                value={
                  categoryOptions.find(o => o.value === planetData.category) ||
                  categoryOptions[0]
                }
                options={categoryOptions}
                onChange={option => {
                  if (!option) return;
                  setPlanetData(draft => {
                    draft.category = option.value;
                  });
                }}
                styles={getAdminPageSelectStyles<CategoryOption>()}
                isSearchable={false}
              />
              <ChevronDown
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                size={12}
              />
            </div>

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
