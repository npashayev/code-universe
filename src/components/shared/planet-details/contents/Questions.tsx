import { getTranslations } from 'next-intl/server';

import type { Question } from '@/types/planet';

interface Props {
  questions: Question[];
}

const Questions = async ({ questions }: Props) => {
  const t = await getTranslations('planetDetails');

  return (
    <section>
      <h2 className="heading-secondary">{t('questions')}</h2>
      <ol className="list-decimal list-indented">
        {questions.map((qn, idx) => (
          <li key={qn.id} className="flex gap-3 leading-relaxed">
            <span className="shrink-0 text-slate-400 font-medium">
              {idx + 1}.
            </span>
            <span>{qn.question}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Questions;
