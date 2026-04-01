import Image from 'next/image';

import { PLANET_CATEGORY } from '@/lib/constants/planet';
import type {
  ImageData,
  LocalizedPlanetData,
  PlanetCategory,
} from '@/types/planet';

import CustomMarkdown from './contents/CustomMarkdown';

interface Props {
  category: PlanetCategory;
  localizedData: LocalizedPlanetData;
  image: ImageData<string>;
}

const PlanetHeader = ({ category, localizedData, image }: Props) => {
  const { name, description, tags } = localizedData;

  return (
    <header>
      <div className="flex items-center gap-12 mb-12">
        {image.url && (
          <div className="relative w-56 h-56 shrink-0">
            <Image
              src={image.url}
              alt={image.alt ?? 'Planet image'}
              fill
              sizes="224px"
              className="object-cover object-center"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="px-3 py-1 w-max rounded-2xl bg-orange-900/30 text-orange-300 text-sm mb-3">
            {PLANET_CATEGORY[category]}
          </div>
          <h1 className="heading-main">{name}</h1>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 4).map((t) => (
                <span
                  key={t.id}
                  className="px-2.5 py-0.5 text-sm border border-slate-600 text-slate-400 rounded"
                >
                  {t.tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <CustomMarkdown text={description} />
    </header>
  );
};

export default PlanetHeader;
