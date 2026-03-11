import PlanetHeader from './PlanetHeader';
import ResearchTopics from './ResearchTopics';
import Resources from './Resources';
import ContentList from './ContentList';
import Questions from './contents/Questions';
import { PublicPlanetResponse } from '@/lib/planet/getPlanet';
import PlanetNavigation from './PlanetNavigation';
import { Link } from '@/lib/next-intl/navigation';
import UpdatePlanetLink from '@/components/admin/UpdatePlanetLink';
import DeletePlanetButtonClient from './DeletePlanetButtonClient';
import PrivateComponent from '@/components/shared/PrivateComponent';

interface Props {
  planet: PublicPlanetResponse;
}

const PlanetClient = ({ planet }: Props) => {
  const { id, category, image, localized } = planet;
  const { researchTopics, resources, contents, questions } = localized;

  return (
    <main className="page px-30 text-lg pt-36 pb-16 space-y-8 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className='fixed z-1 top-6 left-0 px-30 flex justify-between w-full items-center'>
        <Link
          className='px-3 py-1 rounded bg-slate-800 border border-white/10 hover:bg-slate-900'
          href={`/roadmap/${category}`}
        >
          Go back
        </Link>

        <PrivateComponent roles={["ADMIN"]}>
          <div className='flex gap-2 items-center bg-slate-950 px-2 py-1 rounded-lg border border-white/10'>
            <DeletePlanetButtonClient planetId={id} category={category} />
            <UpdatePlanetLink planetId={id} />
          </div>
        </PrivateComponent>
      </div>

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

      <PlanetNavigation category={category} prevId={planet.prevPlanetId} nextId={planet.nextPlanetId} />
    </main>
  );
};

export default PlanetClient;
