import { CreatePlanetData, LocalizedPlanetData, PlanetCategory } from "@/types/planet";

export const getInitialPlanetData = (category: PlanetCategory): CreatePlanetData => {
    const localizedDefaults: LocalizedPlanetData = {
        name: '',
        tags: [],
        description: '',
        researchTopics: [],
        resources: [],
        questions: [],
        contents: [],
    };

    return {
        category,
        status: 'draft',
        image: {
            url: '',
            metadata: { width: 0, height: 0 },
            alt: { az: '', en: '' },
        },
        localized: {
            az: localizedDefaults,
            en: localizedDefaults,
        },
    };
};