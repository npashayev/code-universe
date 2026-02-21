import { CONTENT_TYPE, ContentType, PlanetContent } from '@/types/planet';

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
        type: 'text',
        text: '',
        variant: 'normal',
      };

    case CONTENT_TYPE.implementationTask:
      return {
        id: baseId,
        label: baseLabel,
        type: 'implementation-task',
        task: '',
      };

    case CONTENT_TYPE.code:
      return {
        id: baseId,
        label: baseLabel,
        type: 'code',
        code: {
          language: 'javascript',
          code: '',
        },
      };

    case CONTENT_TYPE.htmlElement:
      return {
        id: baseId,
        label: baseLabel,
        type: 'html-element',
        element: {
          html: '',
        },
      };

    case CONTENT_TYPE.image:
      return {
        id: baseId,
        label: baseLabel,
        type: 'image',
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
