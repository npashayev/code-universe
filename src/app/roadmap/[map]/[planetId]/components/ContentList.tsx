import { PlanetContent } from '@/types/planet';
import Content from './contents/Content';

interface Props {
  contents: PlanetContent[];
}

const ContentList = ({ contents }: Props) => {
  return (
    <section>
      {contents.map(content => (
        <Content key={content.id} content={content} />
      ))}
    </section>
  );
};

export default ContentList;
