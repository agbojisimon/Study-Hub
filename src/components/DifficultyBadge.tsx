import type { Difficulty } from '@/types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const difficultyStyles: Record<Difficulty, string> = {
  Easy: 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  Medium: 'bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
  Hard: 'bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-300',
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`badge ${difficultyStyles[difficulty]}`}>
      {difficulty}
    </span>
  );
}
