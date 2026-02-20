import { localizedPlanetDataSchema } from "@/lib/validation/planetDataSchema";
import { CreatePlanetData } from "@/types/planet";
import { LanguageOption } from "@/types/reactSelectOptions";
import { useRef } from "react";
import { Updater } from "use-immer";

interface Params {
    planetData: CreatePlanetData;
    setPlanetData: Updater<CreatePlanetData>;
    currentLanguage: LanguageOption;
}

export const usePlanetJsonIO = ({ planetData, setPlanetData, currentLanguage }: Params) => {
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


    return {
        handleImportClick,
        handleExportClick,
        handleFileChange,
        fileInputRef,
    }
}