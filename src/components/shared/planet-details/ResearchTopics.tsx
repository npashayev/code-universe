import { getTranslations } from 'next-intl/server';

import type { ResearchTopic } from '@/types/planet';

interface Props {
  researchTopics: ResearchTopic[];
}

const ResearchTopics = async ({ researchTopics }: Props) => {
  const t = await getTranslations('planetDetails');
  return (
    <section>
      <h2 className="heading-secondary">{t('researchTopics')}</h2>
      <ul className="list-indented list-disc">
        {researchTopics.map((topic) => (
          <li key={topic.id}>{topic.topic}</li>
        ))}
      </ul>
    </section>
  );
};

export default ResearchTopics;
