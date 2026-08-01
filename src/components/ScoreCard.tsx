import { CheckCircle2, XCircle, Award, Clock, TrendingUp } from 'lucide-react';
import type { QuizResult } from '@/types';
import { formatTime, getMotivationalMessage } from '@/utils/quizUtils';

interface ScoreCardProps {
  result: QuizResult;
}

export function ScoreCard({ result }: ScoreCardProps) {
  const passColor =
    result.percentage >= 50 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400';

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-gray-200 bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-8 text-center dark:border-gray-800">
        <p className="text-sm font-medium text-white/80">Your Score</p>
        <p className="mt-2 text-5xl font-bold text-white">{result.percentage}%</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5">
          <Award className="h-5 w-5 text-white" />
          <span className="text-lg font-bold text-white">Grade {result.grade}</span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-300">
          {getMotivationalMessage(result.percentage)}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <CheckCircle2 className="h-5 w-5 text-success-600 dark:text-success-400" />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{result.correctAnswers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Correct</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <XCircle className="h-5 w-5 text-error-600 dark:text-error-400" />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{result.wrongAnswers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Wrong</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{formatTime(result.timeTaken)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <TrendingUp className="h-5 w-5 text-accent-600 dark:text-accent-400" />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatTime(result.averageTimePerQuestion)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg/Q</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <Award className="h-5 w-5 text-warning-600 dark:text-warning-400" />
            <div>
              <p className={`text-lg font-bold ${passColor}`}>{result.grade}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Grade</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <CheckCircle2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{result.totalQuestions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
