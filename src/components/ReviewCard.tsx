import { CheckCircle2, XCircle, Flag, Info } from 'lucide-react';
import type { Question } from '@/types';
import { DifficultyBadge } from './DifficultyBadge';

interface ReviewCardProps {
  question: Question;
  selectedAnswer: number | null;
  weekTitle?: string;
}

export function ReviewCard({ question, selectedAnswer, weekTitle }: ReviewCardProps) {
  const isCorrect = selectedAnswer === question.correctAnswer;
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={question.difficulty} />
            <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {question.topic}
            </span>
            {weekTitle && (
              <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {weekTitle}
              </span>
            )}
          </div>
          <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">
            {question.question}
          </h3>
        </div>
        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isCorrect
            ? 'bg-success-100 dark:bg-success-900/30'
            : 'bg-error-100 dark:bg-error-900/30'
        }`}>
          {isCorrect ? (
            <CheckCircle2 className="h-5 w-5 text-success-600 dark:text-success-400" />
          ) : (
            <XCircle className="h-5 w-5 text-error-600 dark:text-error-400" />
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {question.options.map((option, idx) => {
          const isCorrectOption = idx === question.correctAnswer;
          const isSelectedOption = idx === selectedAnswer;

          let optionClass = 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900';
          if (isCorrectOption) {
            optionClass = 'border-success-300 bg-success-50 dark:border-success-700 dark:bg-success-900/20';
          } else if (isSelectedOption && !isCorrectOption) {
            optionClass = 'border-error-300 bg-error-50 dark:border-error-700 dark:bg-error-900/20';
          }

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${optionClass}`}
            >
              <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                isCorrectOption
                  ? 'bg-success-600 text-white'
                  : isSelectedOption
                    ? 'bg-error-600 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {optionLetters[idx]}
              </span>
              <span className="flex-1 text-gray-700 dark:text-gray-200">{option}</span>
              {isCorrectOption && (
                <CheckCircle2 className="h-4 w-4 text-success-600 dark:text-success-400" />
              )}
              {isSelectedOption && !isCorrectOption && (
                <XCircle className="h-4 w-4 text-error-600 dark:text-error-400" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg bg-primary-50 p-4 dark:bg-primary-900/20">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600 dark:text-primary-400" />
            <div>
              <p className="text-sm font-medium text-primary-900 dark:text-primary-200">Explanation</p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{question.explanation}</p>
            </div>
          </div>
        </div>

        {Object.entries(question.incorrectExplanations)
          .filter(([key]) => key !== question.correctOption)
          .length > 0 && (
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Why other options are wrong:</p>
            <ul className="mt-2 space-y-1.5">
              {Object.entries(question.incorrectExplanations)
                .filter(([key]) => key !== question.correctOption)
                .map(([key, explanation]) => (
                  <li key={key} className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{key}:</span> {explanation}
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Flag className="h-4 w-4 text-gray-400" />
          {question.keywords.map((keyword) => (
            <span
              key={keyword}
              className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
