import { use } from 'react';
import PlanetHeader from './components/PlanetHeader';
import ResearchTopics from './components/ResearchTopics';
import ContentList from './components/ContentList';
import { PlanetData } from '@/types/planet';
import Resources from './components/Resources';
import Questions from './components/contents/Questions';

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
  const locale = 'az';
  const planet = planets.find(p => p.id === planetId) as PlanetData;
  const { image, localized } = planet;
  const localizedData = localized[locale];

  return (
    <div className="min-h-screen pt-36 px-16 pb-14 text-[18px] space-y-8">
      <PlanetHeader
        localizedData={planet.localized[locale]}
        image={{
          url: image.url,
          metadata: image.metadata,
          alt: image.alt[locale],
        }}
      />
      <ResearchTopics researchTopics={localizedData.researchTopics} />
      {localizedData.resources && localizedData.resources.length > 0 && (
        <Resources resources={localizedData.resources} />
      )}
      <ContentList contents={planet.localized[locale].contents} />
      <Questions questions={localizedData.questions} />
    </div>
  );
};

export default PlanetPage;
