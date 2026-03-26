import type { ResearchTopic } from '@/types/planet';

interface Props {
  researchTopics: ResearchTopic[];
  labels: Record<string, string>
}

const ResearchTopics = ({ researchTopics, labels }: Props) => {
  return (
    <section>
      <h2 className="heading-secondary">{labels.researchTopics}</h2>
      <ul className="list-indented list-disc">
        {researchTopics.map((topic) => (
          <li key={topic.id}>{topic.topic}</li>
        ))}
      </ul>
    </section>
  );
};

export default ResearchTopics;
