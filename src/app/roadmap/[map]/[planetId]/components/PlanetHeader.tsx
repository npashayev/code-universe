import { PlanetData } from '@/lib/types/planet';
import Image from 'next/image';

interface Props {
  planet: PlanetData;
}

const PlanetHeader = ({ planet }: Props) => {
  return (
    <header>
      <h1>{planet.name}</h1>
      <p>
        <span className="font-bold">Tags:</span> {planet.tags.join(', ')}
      </p>
      <div className="flex justify-between gap-10 items-center">
        <p>{planet.description.repeat(12)}</p>
        <div className="relative size-50 shrink-0">
          <Image src={planet.imageUrl} alt={planet.name} fill />
        </div>
      </div>
    </header>
  );
};

export default PlanetHeader;
