import { Link } from 'react-router-dom';
import { BookOpen, Calendar, FileQuestion } from 'lucide-react';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to={`/course/${course.code}`}
      className="card group block p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
          <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <span className="badge bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
          {course.code}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
        {course.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
        {course.description}
      </p>

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {course.weeks.length} weeks
        </span>
        <span className="flex items-center gap-1.5">
          <FileQuestion className="h-4 w-4" />
          {course.totalQuestions} questions
        </span>
      </div>
    </Link>
  );
}
