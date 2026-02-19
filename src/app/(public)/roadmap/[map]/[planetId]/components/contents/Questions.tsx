import { Question } from '@/types/planet';

interface Props {
  questions: Question[];
}

const Questions = ({ questions }: Props) => {
  return (
    <section>
      <h2 className="heading-secondary">Questions</h2>
      <ol className="list-decimal list-indented">
        {questions.map(qn => (
          <li key={qn.id}>{qn.question}</li>
        ))}
      </ol>
    </section>
  );
};

export default Questions;
