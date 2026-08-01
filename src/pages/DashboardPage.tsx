import { Target, CheckCircle2, TrendingUp, Flame, Calendar, Award } from 'lucide-react';
import { useQuizStats } from '@/hooks/useQuizStats';
import { useProgress } from '@/contexts/ProgressContext';
import { StatisticsCard } from '@/components/StatisticsCard';
import { getAvailableCourses } from '@/services/courseService';
import { ProgressBar } from '@/components/ProgressBar';
import { formatTime } from '@/utils/quizUtils';

export function DashboardPage() {
  const stats = useQuizStats();
  const { progress } = useProgress();
  const courses = getAvailableCourses();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Dashboard</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Track your study progress and performance over time.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatisticsCard
          label="Questions Attempted"
          value={stats.questionsAttempted}
          icon={<Target className="h-5 w-5" />}
          accent="primary"
        />
        <StatisticsCard
          label="Questions Correct"
          value={stats.questionsCorrect}
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent="success"
        />
        <StatisticsCard
          label="Accuracy"
          value={`${stats.accuracy}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          accent="accent"
        />
        <StatisticsCard
          label="Study Streak"
          value={`${stats.studyStreak} day${stats.studyStreak !== 1 ? 's' : ''}`}
          icon={<Flame className="h-5 w-5" />}
          accent="warning"
        />
        <StatisticsCard
          label="Completed Weeks"
          value={stats.completedWeeks}
          icon={<Calendar className="h-5 w-5" />}
          accent="primary"
        />
        <StatisticsCard
          label="Average Score"
          value={`${stats.averageScore}%`}
          icon={<Award className="h-5 w-5" />}
          accent="success"
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Course Progress</h2>
        <div className="space-y-4">
          {courses.map((course) => {
            const completedWeeks = progress.completedWeeks[course.code] ?? [];
            return (
              <div key={course.code} className="card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {course.code} — {course.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {completedWeeks.length}/{course.weeks.length} weeks
                  </span>
                </div>
                <ProgressBar
                  value={completedWeeks.length}
                  max={course.weeks.length}
                />
              </div>
            );
          })}
        </div>
      </div>

      {progress.recentQuizzes.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          <div className="space-y-3">
            {progress.recentQuizzes.slice(0, 5).map((quiz) => (
              <div key={quiz.id} className="card flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {quiz.courseCode} — {quiz.week === 'all' ? 'Mock Exam' : `Week ${quiz.week}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {quiz.mode === 'exam' ? 'Exam' : 'Practice'} • {new Date(quiz.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    quiz.percentage >= 50
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-error-600 dark:text-error-400'
                  }`}>
                    {quiz.percentage}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(quiz.timeTaken)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
