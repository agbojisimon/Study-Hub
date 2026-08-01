import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, FileQuestion, GraduationCap, Pencil } from 'lucide-react';
import { getCourse, getQuestionsByWeek, getAllQuestions } from '@/services/courseService';
import type { Difficulty, QuizMode } from '@/types';
import { useState, useMemo } from 'react';

export function WeekPage() {
  const { courseCode, week } = useParams<{ courseCode: string; week: string }>();
  const navigate = useNavigate();
  const course = getCourse(courseCode ?? '');
  const weekNum = week === 'all' ? 'all' : parseInt(week ?? '0', 10);

  const [difficulty, setDifficulty] = useState<Difficulty | 'Mixed'>('Mixed');
  const [questionCount, setQuestionCount] = useState<number | 'all'>(10);
  const [mode, setMode] = useState<QuizMode>('practice');

  const questions = useMemo(() => {
    if (!course) return [];
    if (weekNum === 'all') return getAllQuestions(course.code);
    return getQuestionsByWeek(course.code, weekNum);
  }, [course, weekNum]);

  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">Course not found.</p>
          <Link to="/" className="btn-primary mt-4">Return Home</Link>
        </div>
      </div>
    );
  }

  const weekMeta = weekNum === 'all'
    ? { weekTitle: 'Full Mock Examination', week: 'all' as const }
    : course.weeks.find((w) => w.week === weekNum);

  if (!weekMeta) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">Week not found.</p>
          <Link to={`/course/${course.code}`} className="btn-primary mt-4">Back to Course</Link>
        </div>
      </div>
    );
  }

  const filteredCount = difficulty === 'Mixed'
    ? questions.length
    : questions.filter((q) => q.difficulty === difficulty).length;

  const actualCount = questionCount === 'all' ? filteredCount : Math.min(questionCount, filteredCount);
  const estimatedTime = questions
    .slice(0, actualCount)
    .reduce((sum, q) => sum + q.estimatedTime, 0);
  const estimatedMins = Math.ceil(estimatedTime / 60);

  const handleStart = () => {
    const params = new URLSearchParams({
      mode,
      difficulty,
      count: questionCount.toString(),
    });
    navigate(`/quiz/${course.code}/${weekNum}?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={`/course/${course.code}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {course.code}
      </Link>

      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-2">
          {weekNum === 'all' ? (
            <span className="badge bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">
              Mock Exam
            </span>
          ) : (
            <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              Week {weekNum}
            </span>
          )}
        </div>

        <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
          {weekMeta.weekTitle}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <FileQuestion className="h-4 w-4" />
            {questions.length} available questions
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            ~{estimatedMins} min estimated
          </span>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Quiz Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('practice')}
                className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-colors ${
                  mode === 'practice'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                }`}
              >
                <Pencil className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Practice</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Learn with feedback</p>
                </div>
              </button>
              <button
                onClick={() => setMode('exam')}
                className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-colors ${
                  mode === 'exam'
                    ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                }`}
              >
                <GraduationCap className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Exam</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Simulate real CBT</p>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Difficulty
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(['Easy', 'Medium', 'Hard', 'Mixed'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                    difficulty === d
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Number of Questions
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {[5, 10, 20, 30, 'all'].map((c) => (
                <button
                  key={c}
                  onClick={() => setQuestionCount(c as number | 'all')}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-colors ${
                    questionCount === c
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                  }`}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Questions in quiz:</span>
              <span className="font-bold text-gray-900 dark:text-white">{actualCount}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Estimated duration:</span>
              <span className="font-bold text-gray-900 dark:text-white">~{estimatedMins} min</span>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={actualCount === 0}
            className="btn-primary w-full py-3 text-base"
          >
            {mode === 'practice' ? 'Start Practice' : 'Start Exam'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WeekPage;
