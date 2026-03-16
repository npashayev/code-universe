import { Question } from '@/types/planet';

interface Props {
  questions: Question[];
}

const Questions = ({ questions }: Props) => {
  return (
    <section>
      <h2 className="heading-secondary">Questions</h2>
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
