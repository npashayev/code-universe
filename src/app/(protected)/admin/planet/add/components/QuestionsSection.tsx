import { HelpCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CreatePlanetData, Question, SupportedLanguage } from '@/types/planet';
import { Updater } from 'use-immer';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { SortableItem } from '@/components/shared/SortableItem';
import { updateLocalizedArray } from '@/lib/utils/updateLocalizedArray';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

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
      draft.localized[locale].questions = draft.localized[
        locale
      ].questions.filter(q => q.id !== id);
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
    <section className="bg-white/3 border border-white/10 rounded-2xl p-6 space-y-3">
      <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-4">
        <HelpCircle size={14} />
        <span>Questions</span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <HelpCircle
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            type="text"
            value={currentQuestion}
            onChange={e => setCurrentQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addQuestion()}
            placeholder="Add question"
            className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl pl-10 pr-4 py-3 outline-none transition-all text-white"
          />
        </div>
        <button
          onClick={addQuestion}
          className="px-6 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white font-bold"
        >
          Add
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={questions.map(q => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="overflow-hidden space-y-2">
            {questions.map(question => (
              <SortableItem key={question.id} id={question.id}>
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-sm text-slate-300 font-medium">
                    {question.question}
                  </span>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-slate-600 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>

        {!questions ||
          (questions.length === 0 && (
            <span className="text-slate-600 text-xs italic">
              No questions assigned yet.
            </span>
          ))}
      </DndContext>
    </section>
  );
};

export default QuestionsSection;
