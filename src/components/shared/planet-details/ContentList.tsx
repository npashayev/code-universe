import type { PlanetContent } from '@/types/planet';

import Content from './contents/Content';

interface Props {
  contents: PlanetContent[];
  labels: Record<string, string>;
}

const ContentList = ({ contents, labels }: Props) => {
  return (
    <section className="space-y-8">
      {contents.map((content) => (
        <Content key={content.id} content={content} labels={labels} />
      ))}
    </section>
  );
};

export default ContentList;
