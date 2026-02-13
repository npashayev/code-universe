import { Question } from '@/types/planet';

interface Props {
  questions: Question[];
}

const Questions = ({ questions }: Props) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-3">Questions</h2>
      <ol className="list-decimal list-inside ml-8">
        {questions.map(qn => (
          <li key={qn.id}>{qn.question}</li>
        ))}
      </ol>
    </section>
  );
};

export default Questions;
