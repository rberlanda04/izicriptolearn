import { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils.js';

// Reforço rápido ao final da aula — nunca bloqueia a conclusão, só ajuda a fixar o
// conceito principal com feedback imediato.
export function LessonQuiz({ quiz }) {
  const [selected, setSelected] = useState(null);

  if (!quiz) return null;
  const answered = selected !== null;
  const isCorrect = selected === quiz.correct;

  return (
    <div className="mt-10 rounded-2xl border border-border-soft bg-paper p-6">
      <div className="flex items-center gap-2 text-accent-deep font-semibold text-sm mb-4">
        <HelpCircle size={16} /> Testando o que você acabou de ler
      </div>
      <p className="font-semibold text-text-strong mb-4">{quiz.question}</p>
      <div className="flex flex-col gap-2">
        {quiz.options.map((option, i) => {
          const isSelected = selected === i;
          const isRightAnswer = answered && i === quiz.correct;
          const isWrongSelected = answered && isSelected && !isCorrect;
          return (
            <button
              key={i}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
              className={cn(
                'text-left px-4 py-2.5 rounded-xl border text-sm transition-colors flex items-center justify-between gap-2',
                !answered && 'border-border-soft hover:border-accent hover:bg-accent/5',
                isRightAnswer && 'border-good bg-good/10 text-good font-semibold',
                isWrongSelected && 'border-red-400 bg-red-500/10 text-red-500 font-semibold',
                answered && !isSelected && !isRightAnswer && 'border-border-soft opacity-60'
              )}
            >
              {option}
              {isRightAnswer && <CheckCircle2 size={16} className="shrink-0" />}
              {isWrongSelected && <XCircle size={16} className="shrink-0" />}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className="text-sm text-muted mt-4 leading-relaxed">
          <span className={cn('font-semibold', isCorrect ? 'text-good' : 'text-red-500')}>
            {isCorrect ? 'Certo. ' : 'Não é essa. '}
          </span>
          {quiz.explanation}
        </p>
      )}
    </div>
  );
}
