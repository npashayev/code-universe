import PlanetHeader from './PlanetHeader';
import ResearchTopics from './ResearchTopics';
import Resources from './Resources';
import ContentList from './ContentList';
import Questions from './contents/Questions';
import { GetPlanetResponse } from '@/lib/planet/getPlanet';

interface Props {
  planet: GetPlanetResponse
}

const PlanetClient = ({ planet }: Props) => {
  const { image, localized } = planet;
  const { researchTopics, resources, contents, questions } = localized;

  return (
    <div className="planet-detail-page">
      <main className="page pt-36 px-16 pb-14 text-[18px] text-slate-200 space-y-8">
        <PlanetHeader
          localizedData={localized}
          image={image}
        />

        {researchTopics && researchTopics.length > 0 && (
          <ResearchTopics researchTopics={researchTopics} />
        )}
        {resources && resources.length > 0 && (
          <Resources resources={resources} />
        )}
        {contents && contents.length > 0 && (
          <ContentList contents={contents} />
        )}
        {questions && questions.length > 0 && (
          <Questions questions={questions} />
        )}
      </main>
    </div>
  );
};

export default PlanetClient;
