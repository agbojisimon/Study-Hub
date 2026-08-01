import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileQuestion, Calendar, ChevronRight } from "lucide-react";
import { getCourse } from "@/services/courseService";
import { ProgressBar } from "@/components/ProgressBar";
import { useProgress } from "@/contexts/ProgressContext";

export function CoursePage() {
  const { courseCode } = useParams<{ courseCode: string }>();
  const { progress } = useProgress();
  const course = getCourse(courseCode ?? "");

  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">Course not found.</p>
          <Link to="/" className="btn-primary mt-4">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const completedWeeks = progress.completedWeeks[course.code] ?? [];
  const progressPercent = Math.round(
    (completedWeeks.length / course.weeks.length) * 100,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
        StudyHub
      </h1>

      <Link
        to="/"
        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
          {course.code}
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {course.title}
        </h2>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
          {course.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-gray-600 dark:text-gray-300">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {course.weeks.length} weeks
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileQuestion className="h-4 w-4" />
            {course.totalQuestions} questions
          </span>
        </div>

        <div className="mt-5">
          <ProgressBar
            value={completedWeeks.length}
            max={course.weeks.length}
            label="Course Progress"
          />
          <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            {completedWeeks.length}/{course.weeks.length} weeks completed (
            {progressPercent}%)
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Study Weeks
        </h3>

        <div className="mt-3 grid gap-5 md:grid-cols-2 lg:grid-cols-2">
          {course.weeks.map((week) => (
            <Link
              key={week.week}
              to={`/course/${course.code}/week/${week.week}`}
              className="group flex min-h-[5.25rem] w-full items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-gray-700 transition-colors hover:cursor-pointer hover:bg-gray-50 active:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/60 dark:active:bg-gray-800/80 sm:px-5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                  Week {week.week}
                </p>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 sm:text-[0.95rem]">
                  {week.weekTitle}
                </p>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                <span className="whitespace-nowrap">
                  {week.questionCount} Questions
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5 dark:text-gray-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link
        to={`/course/${course.code}/week/all`}
        className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        Take Full Mock Examination
      </Link>
    </div>
  );
}

export default CoursePage;
