import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { Updater } from 'use-immer';

import type {
  CreatePlanetData,
  Question,
  SupportedLanguage,
} from '@/types/planet';
import { useLocalizedDragReorder } from '@/lib/hooks/admin/useLocalizedDragReorder';
import SortableList from '@/components/admin/planet-editor-layout/SortableList';

import ListElement from '../shared/ListElement';
import SectionHeader from '../shared/SectionHeader';
import Input from '../shared/Input';
import AddButton from '../shared/AddButton';

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

    setPlanetData((draft) => {
      draft.localized[locale].questions.push({
        id: crypto.randomUUID(),
        question: currentQuestion,
      });
    });

    setCurrentQuestion('');
  };

  const removeQuestion = (id: string) => {
    setPlanetData((draft) => {
      draft.localized[locale].questions = draft.localized[
        locale
      ].questions.filter((q) => q.id !== id);
    });
  };

  const handleDragEnd = useLocalizedDragReorder(
    setPlanetData,
    locale,
    'questions',
  );

  return (
    <section className="admin-page-section">
      <SectionHeader>
        <HelpCircle size={14} />
        <h2>Questions</h2>
      </SectionHeader>

      <div className="flex gap-2 min-w-0">
        <div className="flex-1 min-w-0">
          <Input
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addQuestion();
            }}
            placeholder="Add question"
          />
        </div>
        <AddButton
          onClick={addQuestion}
          disabled={!currentQuestion.trim()}
          className="shrink-0"
        >
          Add
        </AddButton>
      </div>

      <SortableList<Question>
        id="question-sortable-list"
        elements={questions}
        handleDragEnd={handleDragEnd}
        renderItem={(question) => (
          <ListElement onRemove={() => removeQuestion(question.id)}>
            <span className="block truncate">{question.question}</span>
          </ListElement>
        )}
      />

      {(!questions || questions.length === 0) && (
        <span className="admin-empty-state">No questions assigned yet.</span>
      )}
    </section>
  );
};

export default QuestionsSection;
