import { ResearchTopic } from '@/types/planet';

interface Props {
  researchTopics: ResearchTopic[];
}

const ResearchTopics = ({ researchTopics }: Props) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-3">Research Topics</h2>
      <ul className="list-disc list-inside ml-8">
        {researchTopics.map(topic => (
          <li key={topic.id}>{topic.topic}</li>
        ))}
      </ul>
    </section>
  );
};

export default ResearchTopics;
