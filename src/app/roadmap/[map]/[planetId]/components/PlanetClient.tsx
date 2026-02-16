import { PlanetData, SupportedLanguage } from '@/types/planet';
import PlanetHeader from './PlanetHeader';
import ResearchTopics from './ResearchTopics';
import Resources from './Resources';
import ContentList from './ContentList';
import Questions from './contents/Questions';

interface Props {
  planet: PlanetData;
  locale: SupportedLanguage;
}

const PlanetClient = ({ planet, locale }: Props) => {
  const { image, localized } = planet;
  const localizedData = localized[locale];
  return (
    <main className="page pt-36 px-16 pb-14 text-[18px] space-y-8">
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
      {localizedData.contents && localizedData.contents.length > 0 && (
        <ContentList contents={localizedData.contents} />
      )}
      {localizedData.questions && localizedData.questions.length > 0 && (
        <Questions questions={localizedData.questions} />
      )}
    </main>
  );
};

export default PlanetClient;
