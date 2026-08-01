import { useLocation, Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import type { QuizResult, Question } from '@/types';
import { ReviewCard } from '@/components/ReviewCard';

export function ReviewPage() {
  const location = useLocation();
  const result = (location.state as { result: QuizResult; questions: Question[] } | null)?.result;
  const questions = (location.state as { result: QuizResult; questions: Question[] } | null)?.questions;

  if (!result || !questions) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No answers to review.</p>
          <Link to="/" className="btn-primary mt-4">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const answerMap = new Map(result.answers.map((a) => [a.questionId, a.selectedAnswer]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/results"
          state={{ result, questions }}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </Link>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Answer Review</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Review every question with explanations to learn from your mistakes.
      </p>

      <div className="space-y-4">
        {questions.map((question, idx) => {
          const selected = answerMap.get(question.id) ?? null;
          return (
            <div key={question.id}>
              <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Question {idx + 1} of {questions.length}
              </p>
              <ReviewCard
                question={question}
                selectedAnswer={selected}
                weekTitle={`Week ${question.week}: ${question.weekTitle}`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/" className="btn-primary">
          <Home className="h-4 w-4" />
          Return Home
        </Link>
        <Link
          to={`/course/${result.courseCode}/week/${result.week}`}
          className="btn-secondary"
        >
          Retry Quiz
        </Link>
      </div>
    </div>
  );
}

export default ReviewPage;
