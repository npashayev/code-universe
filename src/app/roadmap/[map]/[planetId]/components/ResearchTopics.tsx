interface Props {
  researchTopics: string[];
}

const ResearchTopics = ({ researchTopics }: Props) => {
  return (
    <section>
      <h2>Research Topics</h2>
      <ul className="list-disc list-inside ml-6">
        {researchTopics.map((topic, i) => (
          <li key={i}>{topic}</li>
        ))}
      </ul>
    </section>
  );
};

export default ResearchTopics;
