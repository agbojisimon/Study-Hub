import { memo, useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Question } from "@/types";

const OPTION_LETTERS = ["A", "B", "C", "D"];

function shuffleIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  isAnswered: boolean;
  isFlagged: boolean;
  onSelectAnswer: (index: number) => void;
  onToggleFlag: () => void;
}

function QuestionCardBase({
  question,
  selectedAnswer,
  isAnswered,
  onSelectAnswer,
}: QuestionCardProps) {
  const order = useMemo(() => shuffleIndices(question.options.length), [question]);

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-medium leading-snug text-gray-900 dark:text-white md:text-2xl">
        {question.question}
      </h2>

      <div className="mt-3 border-b border-gray-200 dark:border-gray-800">
        {order.map((originalIdx, i) => {
          const option = question.options[originalIdx];
          const isSelected = originalIdx === selectedAnswer;
          const isCorrect = originalIdx === question.correctAnswer;

          let rowClass = "border-t border-gray-200 dark:border-gray-800";
          let labelClass =
            "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
          let textClass = "text-gray-800 dark:text-gray-100";

          if (isAnswered) {
            if (isCorrect) {
              rowClass += " bg-success-50 dark:bg-success-900/20";
              labelClass = "bg-success-600 text-white";
              textClass = "text-success-800 dark:text-success-200";
            } else if (isSelected) {
              rowClass += " bg-error-50 dark:bg-error-900/20";
              labelClass = "bg-error-600 text-white";
              textClass = "text-error-800 dark:text-error-200";
            }
          } else if (isSelected) {
            rowClass += " bg-primary-50 dark:bg-primary-900/20";
            labelClass = "bg-primary-600 text-white";
            textClass = "text-primary-800 dark:text-primary-200";
          }

          return (
            <button
              key={originalIdx}
              onClick={() => !isAnswered && onSelectAnswer(originalIdx)}
              disabled={isAnswered}
              className={`flex w-full items-center gap-3 py-3.5 text-left ${rowClass}`}
            >
              <span
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${labelClass}`}
              >
                {OPTION_LETTERS[i]}
              </span>
              <span className={`flex-1 text-[0.95rem] leading-snug ${textClass}`}>
                {option}
              </span>
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                {isAnswered && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-success-600 dark:text-success-400" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 text-error-600 dark:text-error-400" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {isAnswered ? (
        <p className="mt-4 text-[0.95rem] leading-relaxed text-gray-700 dark:text-gray-200">
          <span
            className={
              selectedAnswer === question.correctAnswer
                ? "font-semibold text-success-700 dark:text-success-300"
                : "font-semibold text-error-700 dark:text-error-300"
            }
          >
            {selectedAnswer === question.correctAnswer
              ? "That's right!"
              : "Not quite."}
          </span>{" "}
          {question.explanation}
        </p>
      ) : (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Select an option to instantly see feedback.
        </p>
      )}
    </div>
  );
}

export const QuestionCard = memo(QuestionCardBase);
