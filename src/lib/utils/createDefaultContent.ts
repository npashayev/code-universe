import { CONTENT_TYPE, ContentType, PlanetContent } from '@/types/planet';

export const createDefaultContent = (
  type: ContentType,
  order: number,
): PlanetContent => {
  const baseId = crypto.randomUUID();
  const baseLabel = `Block ${order}`;

  switch (type) {
    case CONTENT_TYPE.text:
      return {
        id: baseId,
        order,
        label: baseLabel,
        type: 'text',
        text: '',
        variant: 'normal',
        markdown: false,
      };

    case CONTENT_TYPE.implementationTask:
      return {
        id: baseId,
        order,
        label: baseLabel,
        type: 'implementation-task',
        task: '',
      };

    case CONTENT_TYPE.code:
      return {
        id: baseId,
        order,
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
        order,
        label: baseLabel,
        type: 'html-element',
        element: {
          html: '',
        },
      };

    case CONTENT_TYPE.image:
      return {
        id: baseId,
        order,
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
