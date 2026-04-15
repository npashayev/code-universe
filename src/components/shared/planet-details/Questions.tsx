import type { Question } from '@/types/planet';

import CustomMarkdown from './contents/CustomMarkdown';

interface Props {
  questions: Question[];
  labels: Record<string, string>;
}

const Questions = ({ questions, labels }: Props) => {
  return (
    <section>
      <h2 className="heading-secondary">{labels.questions}</h2>
      <ol className="list-decimal list-indented">
        {questions.map((qn, idx) => (
          <li key={qn.id} className="flex gap-3 leading-relaxed">
            <span className="shrink-0 text-slate-400 font-medium">
              {idx + 1}.
            </span>
            <CustomMarkdown text={qn.question} inline={true} />
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Questions;
