import { useLocation, Link } from 'react-router-dom';
import { Home, RotateCcw, Eye, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import type { QuizResult, Question } from '@/types';
import { ScoreCard } from '@/components/ScoreCard';
import { getMotivationalMessage, formatTime } from '@/utils/quizUtils';

export function ResultsPage() {
  const location = useLocation();
  const result = (location.state as { result: QuizResult; questions: Question[] } | null)?.result;
  const questions = (location.state as { result: QuizResult; questions: Question[] } | null)?.questions;

  if (!result || !questions) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No quiz results to display.</p>
          <Link to="/" className="btn-primary mt-4">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const difficultyEntries = Object.entries(result.performanceByDifficulty);
  const weekEntries = Object.entries(result.performanceByWeek).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Quiz Results</h1>

      <ScoreCard result={result} />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {difficultyEntries.length > 0 && (
          <div className="card p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <TrendingUp className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              Performance by Difficulty
            </h3>
            <div className="space-y-3">
              {difficultyEntries.map(([diff, stats]) => {
                const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div key={diff}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-200">{diff}</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {stats.correct}/{stats.total} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-primary-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {weekEntries.length > 0 && (
          <div className="card p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <TrendingUp className="h-4 w-4 text-accent-600 dark:text-accent-400" />
              Performance by Week
            </h3>
            <div className="space-y-3">
              {weekEntries.map(([week, stats]) => {
                const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div key={week}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-200">Week {week}</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {stats.correct}/{stats.total} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-accent-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {result.strongTopics.length > 0 && (
          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <TrendingUp className="h-4 w-4 text-success-600 dark:text-success-400" />
              Strong Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.strongTopics.map((topic) => (
                <span
                  key={topic}
                  className="badge bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-300"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.weakTopics.length > 0 && (
          <div className="card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <TrendingDown className="h-4 w-4 text-error-600 dark:text-error-400" />
              Weak Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.weakTopics.map((topic) => (
                <span
                  key={topic}
                  className="badge bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-300"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card mt-6 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
          <Lightbulb className="h-4 w-4 text-warning-600 dark:text-warning-400" />
          Study Recommendations
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          {result.percentage < 50 && (
            <li>Focus on reviewing the material for your weak topics before retaking the quiz.</li>
          )}
          {result.percentage >= 50 && result.percentage < 75 && (
            <li>You have a good foundation. Review the questions you got wrong to strengthen your understanding.</li>
          )}
          {result.percentage >= 75 && (
            <li>Excellent work! Consider taking the full mock exam to test your comprehensive knowledge.</li>
          )}
          {result.weakTopics.length > 0 && (
            <li>
              Spend extra time on: {result.weakTopics.join(', ')}.
            </li>
          )}
          {result.averageTimePerQuestion > 60 && (
            <li>Try to improve your speed — you averaged {formatTime(result.averageTimePerQuestion)} per question.</li>
          )}
          <li>Use Practice mode to learn from explanations and deepen your understanding.</li>
        </ul>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to={`/course/${result.courseCode}/week/${result.week}`}
          className="btn-primary"
        >
          <RotateCcw className="h-4 w-4" />
          Retry Quiz
        </Link>
        <Link
          to="/review"
          state={{ result, questions }}
          className="btn-secondary"
        >
          <Eye className="h-4 w-4" />
          Review Answers
        </Link>
        <Link to="/" className="btn-outline">
          <Home className="h-4 w-4" />
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default ResultsPage;
