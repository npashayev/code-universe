import { ResearchTopic } from '@/types/planet';

interface Props {
  researchTopics: ResearchTopic[];
}

const ResearchTopics = ({ researchTopics }: Props) => {
  return (
    <section>
      <h2 className="heading-secondary">Research Topics</h2>
      <ul className="list-indented list-disc">
        {researchTopics.map(topic => (
          <li key={topic.id}>{topic.topic}</li>
        ))}
      </ul>
    </section>
  );
};

export default ResearchTopics;
