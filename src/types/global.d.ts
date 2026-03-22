import type { StaticImageData } from 'next/image';

declare module '*.css';
declare module '*.scss';
declare module '*.sass';

declare module '*.png' {
  const content: StaticImageData;
  export default content;
}

declare module '*.webp' {
  const content: StaticImageData;
  export default content;
}
