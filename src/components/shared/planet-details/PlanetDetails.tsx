import PlanetHeader from './PlanetHeader';
import ResearchTopics from './ResearchTopics';
import Resources from './Resources';
import ContentList from './ContentList';
import Questions from './contents/Questions';
import { PublicPlanetResponse } from '@/lib/planet/getPlanet';
import PlanetNavigation from './PlanetNavigation';

interface Props {
  planet: PublicPlanetResponse;
}

const PlanetDetails = ({ planet }: Props) => {
  const { category, image, localized } = planet;
  const { researchTopics, resources, contents, questions } = localized;

  return (
    <main className="page px-30 text-lg pt-36 pb-16 space-y-8 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <PlanetHeader
        category={category}
        localizedData={localized}
        image={image}
      />

      {researchTopics && researchTopics.length > 0 && (
        <ResearchTopics researchTopics={researchTopics} />
      )}
      {resources && resources.length > 0 && <Resources resources={resources} />}
      {contents && contents.length > 0 && <ContentList contents={contents} />}
      {questions && questions.length > 0 && <Questions questions={questions} />}

      <PlanetNavigation
        category={category}
        prevId={planet.prevPlanetId}
        nextId={planet.nextPlanetId}
      />
    </main>
  );
};

export default PlanetDetails;
