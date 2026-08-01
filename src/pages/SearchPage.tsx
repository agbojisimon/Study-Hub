import { useState, useMemo } from 'react';
import { Search as SearchIcon, FileQuestion } from 'lucide-react';
import { searchQuestions } from '@/services/courseService';
import { getAvailableCourses } from '@/services/courseService';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import type { Difficulty } from '@/types';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<string>('Mixed');
  const [week, setWeek] = useState<number | 'all'>('all');

  const courses = useMemo(() => getAvailableCourses(), []);
  const [courseCode, setCourseCode] = useState<string>(courses[0]?.code ?? '');

  const allWeeks = courses.find((course) => course.code === courseCode)?.weeks ?? [];

  const results = useMemo(() => {
    return searchQuestions(courseCode, query, {
      difficulty: difficulty !== 'Mixed' ? difficulty : undefined,
      week: week !== 'all' ? week : undefined,
    });
  }, [courseCode, query, difficulty, week]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Search Questions</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Search by keyword, topic, or filter by difficulty and week.
      </p>

      <div className="card p-5">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by keyword, topic, or subtopic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Course
            </label>
            <select
              value={courseCode}
              onChange={(e) => {
                setCourseCode(e.target.value);
                setWeek('all');
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code} — {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="Mixed">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Week
            </label>
            <select
              value={week}
              onChange={(e) => setWeek(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="all">All Weeks</option>
              {allWeeks.map((w) => (
                <option key={w.week} value={w.week}>
                  Week {w.week}: {w.weekTitle}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <FileQuestion className="h-4 w-4" />
        {results.length} question{results.length !== 1 ? 's' : ''} found
      </div>

      <div className="mt-4 space-y-3">
        {results.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No questions found. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          results.slice(0, 50).map((q) => (
            <div key={q.id} className="card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <DifficultyBadge difficulty={q.difficulty as Difficulty} />
                <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  Week {q.week}
                </span>
                <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {q.topic}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                {q.question}
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {q.keywords.map((k) => (
                  <span
                    key={k}
                    className="badge bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SearchPage;
