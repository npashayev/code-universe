import { ImageData, LocalizedPlanetData } from '@/types/planet';
import Image from 'next/image';

interface Props {
  localizedData: LocalizedPlanetData;
  image: ImageData<string>;
}

const PlanetHeader = ({ localizedData, image }: Props) => {
  const { name, description, tags } = localizedData;

  return (
    <header>
      <h1 className="heading-main text-slate-100">{name}</h1>
      {tags && tags.length > 0 && (
        <div className="flex gap-2 mb-4 text-slate-300">
          <h3>Tags:</h3>
          {tags
            .slice(0, 4)
            .map(t => t.tag)
            .join(', ')}
        </div>
      )}
      <div className="flex justify-between gap-10 items-center">
        <p className="text-slate-200">{description}</p>
        {image.url && (
          <div className="relative size-50 shrink-0">
            <Image src={image.url} alt={image.alt ?? 'Planet image'} fill />
          </div>
        )}
      </div>
    </header>
  );
};

export default PlanetHeader;
