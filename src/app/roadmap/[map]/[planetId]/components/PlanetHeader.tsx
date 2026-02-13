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
      <h1 className="text-4xl font-bold mb-4">{name}</h1>
      <div className="flex gap-2 mb-4">
        <h3 className="font-bold">Tags:</h3>
        {tags.map(t => t.tag).join(', ')}
      </div>
      <div className="flex justify-between gap-10 items-center">
        <p>{description}</p>
        <div className="relative size-50 shrink-0">
          <Image src={image.url} alt={image.alt} fill />
        </div>
      </div>
    </header>
  );
};

export default PlanetHeader;
