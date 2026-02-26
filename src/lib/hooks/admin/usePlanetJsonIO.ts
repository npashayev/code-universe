import {
  createPlanetDataSchema,
  localizedPlanetDataSchema,
  preSubmitPlanetDataSchema,
} from '@/lib/validation/planetDataSchema';
import { CreatePlanetData } from '@/types/planet';
import { LanguageOption } from '@/types/reactSelectOptions';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { Updater } from 'use-immer';

interface Params {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  currentLanguage: LanguageOption;
}

export const usePlanetJsonIO = ({
  planetData,
  setPlanetData,
  currentLanguage,
}: Params) => {
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
        const result = preSubmitPlanetDataSchema.safeParse(parsed);

        if (!result.success) {
          toast.error(
            "JSON content doesn't satisfy localized planet data structure",
          );
          console.error(
            'JSON validation error for localized data:',
            result.error.flatten().fieldErrors,
          );
          return;
        }

        setPlanetData(draft => {
          //   draft.localized[currentLanguage.value] = result.data;
          return result.data;
        });
      } catch (err) {
        toast.error('Invalid JSON file');
        console.error('Invalid JSON file:', err);
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
      console.error('Failed to read file', reader.error);
    };

    reader.readAsText(file);

    e.target.value = '';
  };

  return {
    handleImportClick,
    handleExportClick,
    handleFileChange,
    fileInputRef,
  };
};
