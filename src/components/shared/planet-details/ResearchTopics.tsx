import type { ResearchTopic } from '@/types/planet';

import CustomMarkdown from './contents/CustomMarkdown';

interface Props {
  researchTopics: ResearchTopic[];
  labels: Record<string, string>;
}

const ResearchTopics = ({ researchTopics, labels }: Props) => {
  return (
    <section>
      <h2 className="heading-secondary">{labels.researchTopics}</h2>
      <ul className="list-indented list-disc">
        {researchTopics.map((topic) => (
          <li key={topic.id}>
            <CustomMarkdown text={topic.topic} inline={true} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ResearchTopics;
