import { useProgress } from '@/contexts/ProgressContext';

export function useQuizStats() {
  const { progress } = useProgress();

  const accuracy =
    progress.questionsAttempted > 0
      ? Math.round((progress.questionsCorrect / progress.questionsAttempted) * 100)
      : 0;

  const completedWeeksCount = Object.values(progress.completedWeeks).reduce(
    (sum, weeks) => sum + weeks.length,
    0,
  );

  const averageScore =
    progress.completedQuizzes.length > 0
      ? Math.round(
          progress.completedQuizzes.reduce((sum, q) => sum + q.percentage, 0) /
            progress.completedQuizzes.length,
        )
      : 0;

  return {
    questionsAttempted: progress.questionsAttempted,
    questionsCorrect: progress.questionsCorrect,
    accuracy,
    studyStreak: progress.studyStreak,
    completedWeeks: completedWeeksCount,
    averageScore,
    totalQuizzes: progress.completedQuizzes.length,
  };
}
