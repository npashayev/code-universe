import { PlanetData } from '@/lib/types/planet';
import { use } from 'react';
import PlanetHeader from './components/PlanetHeader';
import ResearchTopics from './components/ResearchTopics';
import ContentList from './components/ContentList';

interface Props {
  params: Promise<{
    planetId: string;
  }>;
}

const PlanetPage = ({ params }: Props) => {
  const { planetId } = use(params);

  const planets: PlanetData[] = use(
    fetch('http://localhost:5000/planets').then(res => res.json()),
  );

  const planet = planets.find(p => p.id === planetId) as PlanetData;

  return (
    <div className="min-h-screen pt-36 px-16 pb-14 text-[18px]">
      <PlanetHeader planet={planet} />
      <ResearchTopics researchTopics={planet.researchTopics} />
      <ContentList contents={planet.contents} />
    </div>
  );
};

export default PlanetPage;
