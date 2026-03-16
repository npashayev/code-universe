import { ContentType, PlanetContent, ProgrammingLanguage } from '@/types/planet';
import { CONTENT_TYPE, PROGRAMMING_LANGUAGE, TEXT_VARIANTS } from '../constants/planet';

export const createDefaultContent = (
  type: ContentType,
  index: number,
): PlanetContent => {
  const baseId = crypto.randomUUID();
  const baseLabel = `Block ${index + 1}`;

  switch (type) {
    case CONTENT_TYPE.text:
      return {
        id: baseId,
        label: baseLabel,
        type: CONTENT_TYPE.text,
        text: '',
        variant: TEXT_VARIANTS[0],
      };

    case CONTENT_TYPE.implementationTask:
      return {
        id: baseId,
        label: baseLabel,
        type: CONTENT_TYPE.implementationTask,
        task: '',
      };

    case CONTENT_TYPE.code:
      return {
        id: baseId,
        label: baseLabel,
        type: CONTENT_TYPE.code,
        code: {
          language: Object.keys(PROGRAMMING_LANGUAGE)[0] as ProgrammingLanguage,
          code: '',
        },
      };

    case CONTENT_TYPE.htmlElement:
      return {
        id: baseId,
        label: baseLabel,
        type: CONTENT_TYPE.htmlElement,
        element: {
          html: '',
        },
      };

    case CONTENT_TYPE.image:
      return {
        id: baseId,
        label: baseLabel,
        type: CONTENT_TYPE.image,
        image: {
          url: '',
          alt: '',
          metadata: {
            width: 0,
            height: 0,
          },
        },
      };

    default:
      throw new Error(`Unknown content type: ${type}`);
  }
};
