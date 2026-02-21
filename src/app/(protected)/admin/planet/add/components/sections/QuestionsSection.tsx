import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { CreatePlanetData, Question, SupportedLanguage } from '@/types/planet';
import { Updater } from 'use-immer';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { updateLocalizedArray } from '@/lib/utils/updateLocalizedArray';
import ListElement from '../shared/ListElement';
import SectionHeader from '../shared/SectionHeader';
import Input from '../shared/Input';
import AddButton from '../shared/AddButton';
import SortableList from '@/components/shared/SortableList';

interface Props {
  questions: Question[];
  setPlanetData: Updater<CreatePlanetData>;
  locale: SupportedLanguage;
}

export const QuestionsSection = ({
  questions,
  setPlanetData,
  locale,
}: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState('');

  const addQuestion = () => {
    if (!currentQuestion.trim()) return;

    setPlanetData(draft => {
      draft.localized[locale].questions.push({
        id: crypto.randomUUID(),
        question: currentQuestion,
      });
    });

    setCurrentQuestion('');
  };

  const removeQuestion = (id: string) => {
    setPlanetData(draft => {
      draft.localized[locale].questions = draft
        .localized[locale]
        .questions
        .filter(q => q.id !== id);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPlanetData(draft => {
      const sorted = arrayMove(
        draft.localized[locale].questions,
        draft.localized[locale].questions.findIndex(q => q.id === active.id),
        draft.localized[locale].questions.findIndex(q => q.id === over.id),
      );
      updateLocalizedArray(draft, locale, 'questions', sorted);
    });
  };

  return (
    <section className="admin-page-section">
      <SectionHeader>
        <HelpCircle size={14} />
        <h2>Questions</h2>
      </SectionHeader>

      <div className="flex gap-2">
        <Input
          value={currentQuestion}
          onChange={e => setCurrentQuestion(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') addQuestion();
          }}
          placeholder="Add question"
        />
        <AddButton onClick={addQuestion} disabled={!currentQuestion.trim()}>Add</AddButton>
      </div>

      <SortableList<Question>
        id='question-sortable-list'
        elements={questions}
        handleDragEnd={handleDragEnd}
        renderItem={question => (
          <ListElement onRemove={() => removeQuestion(question.id)}>
            {question.question}
          </ListElement>
        )}
      />

      {(!questions || questions.length === 0) && (
        <span className="text-slate-600 text-xs italic">
          No questions assigned yet.
        </span>
      )}
    </section>
  );
};

export default QuestionsSection;
