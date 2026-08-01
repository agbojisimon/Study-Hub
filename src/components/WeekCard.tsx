import { Link } from 'react-router-dom';
import { ArrowRight, FileQuestion } from 'lucide-react';
import type { WeekMeta } from '@/types';
import { useProgress } from '@/contexts/ProgressContext';

interface WeekCardProps {
  courseCode: string;
  week: WeekMeta;
}

export function WeekCard({ courseCode, week }: WeekCardProps) {
  const { progress } = useProgress();
  const completedWeeks = progress.completedWeeks[courseCode] ?? [];
  const isCompleted = completedWeeks.includes(week.week);
  const highScoreKey = `${courseCode}-${week.week}`;
  const highScore = progress.highestScores[highScoreKey];

  return (
    <Link
      to={`/course/${courseCode}/week/${week.week}`}
      className="card group block p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          Week {week.week}
        </span>
        {isCompleted && (
          <span className="badge bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-300">
            Completed
          </span>
        )}
      </div>

      <h3 className="mt-3 text-base font-bold text-gray-900 dark:text-white">
        {week.weekTitle}
      </h3>

      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <FileQuestion className="h-4 w-4" />
          {week.questionCount} questions
        </span>
        {highScore !== undefined && (
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            Best: {highScore}%
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-primary-400">
        Start studying
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
