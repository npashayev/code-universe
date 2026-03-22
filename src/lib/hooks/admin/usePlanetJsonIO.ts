import { useRef } from 'react';
import toast from 'react-hot-toast';
import type { Updater } from 'use-immer';

import type { CreatePlanetData, SupportedLanguage } from '@/types/planet';
import {
  preSubmitCreatePlanetDataSchema,
  preSubmitLocalizedPlanetDataSchema,
} from '@/lib/validation/planetDataSchema';

interface Params {
  planetData: CreatePlanetData;
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

type JsonType = 'full' | 'locale';

export const usePlanetJsonIO = ({
  planetData,
  setPlanetData,
  locale,
}: Params) => {
  const jsonTypeRef = useRef<JsonType>('full');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportClick = (type: JsonType) => {
    jsonTypeRef.current = type;
    fileInputRef.current?.click();
  };

  const handleExportClick = () => {
    let url: string | null = null;

    try {
      const jsonString = JSON.stringify(planetData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      url = URL.createObjectURL(blob);

      const planetName = planetData.localized[locale]?.name
        ? planetData.localized[locale].name.toLowerCase().replace(/\s+/g, '-')
        : 'planet';

      const link = document.createElement('a');
      link.href = url;
      link.download = `${planetName}.json`;
      link.click();
    } catch (error) {
      console.error('Failed to export planet data:', error);
    } finally {
      const urlToRevoke = url;
      if (urlToRevoke) {
        setTimeout(() => URL.revokeObjectURL(urlToRevoke), 1000);
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

        if (jsonTypeRef.current === 'full') {
          const result = preSubmitCreatePlanetDataSchema.safeParse(parsed);

          if (!result.success) {
            toast.error(
              "JSON content doesn't satisfy full planet data structure",
            );
            console.error(
              'JSON validation error for full planet data:',
              result.error.flatten().fieldErrors,
            );
            return;
          }

          setPlanetData(() => {
            return result.data;
          });
        } else if (jsonTypeRef.current === 'locale') {
          const result = preSubmitLocalizedPlanetDataSchema.safeParse(parsed);
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

          setPlanetData((draft) => {
            draft.localized[locale] =
              result.data as (typeof draft.localized)[typeof locale];
          });
        }
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
