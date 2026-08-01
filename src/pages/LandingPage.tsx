import { useState, useMemo } from 'react';
import { Search as SearchIcon, BookOpen } from 'lucide-react';
import { getAvailableCourses } from '@/services/courseService';
import { CourseCard } from '@/components/CourseCard';

export function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const courses = useMemo(() => getAvailableCourses(), []);

  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              StudyHub
            </h1>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 sm:text-xl">
              Master your courses one quiz at a time.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500 dark:text-gray-400">
              A modern quiz platform for university students. Study course materials week-by-week
              or simulate an actual examination.
            </p>

            <div className="mx-auto mt-8 max-w-md">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available Courses</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a course to start studying week-by-week or take a full mock exam.
          </p>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No courses found matching your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.code} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default LandingPage;
