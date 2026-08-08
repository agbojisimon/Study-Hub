import type { Course, Difficulty, Question, WeekMeta } from '@/types';
import { COURSES, getCourseDefinition } from '@/data/courses';

import gst112Questions from '@/data/GST112/questions.json';

import cosWeek1 from '@/data/COS102/week1.json';
import cosWeek2 from '@/data/COS102/week2.json';
import cosWeek3 from '@/data/COS102/week3.json';
import cosWeek4 from '@/data/COS102/week4.json';
import cosWeek5 from '@/data/COS102/week5.json';
import cosWeek6 from '@/data/COS102/week6.json';
import cosWeek7 from '@/data/COS102/week7.json';
import cosWeek8 from '@/data/COS102/week8.json';
import cosWeek9 from '@/data/COS102/week9.json';

import gstWeek1 from '@/data/GST122/week1.json';
import gstWeek2 from '@/data/GST122/week2.json';
import gstWeek3 from '@/data/GST122/week3.json';
import gstWeek4 from '@/data/GST122/week4.json';
import gstWeek5 from '@/data/GST122/week5.json';
import gstWeek6 from '@/data/GST122/week6.json';
import gstWeek7 from '@/data/GST122/week7.json';
import gstWeek8 from '@/data/GST122/week8.json';
import gstWeek9 from '@/data/GST122/week9.json';
import gstWeek10 from '@/data/GST122/week10.json';

const DIFFICULTY_ALIASES: Record<string, Difficulty> = {
  Easy: 'Easy',
  Medium: 'Medium',
  Moderate: 'Medium',
  Hard: 'Hard',
  Difficult: 'Hard',
  'Very Difficult': 'Hard',
};

type RawGST112Question = Omit<Question, 'difficulty'> & { difficulty: string };

const gst112Bank: Question[] = (gst112Questions as RawGST112Question[]).map(
  (question) => ({
    ...question,
    difficulty: DIFFICULTY_ALIASES[question.difficulty] ?? 'Medium',
  }),
);

function groupQuestionsByWeek(questions: Question[]): Record<number, Question[]> {
  const grouped: Record<number, Question[]> = {};
  for (const question of questions) {
    const week = question.week;
    if (!grouped[week]) grouped[week] = [];
    grouped[week].push(question);
  }
  return grouped;
}

const courseQuestionBanks: Record<string, Record<number, Question[]>> = {
  COS102: {
    1: cosWeek1 as Question[],
    2: cosWeek2 as Question[],
    3: cosWeek3 as Question[],
    4: cosWeek4 as Question[],
    5: cosWeek5 as Question[],
    6: cosWeek6 as Question[],
    7: cosWeek7 as Question[],
    8: cosWeek8 as Question[],
    9: cosWeek9 as Question[],
  },
  GST122: {
    1: gstWeek1 as Question[],
    2: gstWeek2 as Question[],
    3: gstWeek3 as Question[],
    4: gstWeek4 as Question[],
    5: gstWeek5 as Question[],
    6: gstWeek6 as Question[],
    7: gstWeek7 as Question[],
    8: gstWeek8 as Question[],
    9: gstWeek9 as Question[],
    10: gstWeek10 as Question[],
  },
  GST112: groupQuestionsByWeek(gst112Bank),
};

function buildCourse(courseCode: string): Course | undefined {
  const definition = getCourseDefinition(courseCode);
  if (!definition) return undefined;

  const weekBank = courseQuestionBanks[courseCode] ?? {};
  const weeks: WeekMeta[] = definition.weekTitles.map((weekTitle, index) => {
    const week = index + 1;
    return {
      week,
      weekTitle,
      questionCount: weekBank[week]?.length ?? 0,
    };
  });

  return {
    code: definition.code,
    title: definition.title,
    description: definition.description,
    weeks,
    totalQuestions: weeks.reduce((sum, week) => sum + week.questionCount, 0),
  };
}

const AVAILABLE_COURSES: Course[] = COURSES.map((course) => buildCourse(course.code)).filter(
  (course): course is Course => Boolean(course),
);

export function getAvailableCourses(): Course[] {
  return AVAILABLE_COURSES;
}

export function getCourse(courseCode: string): Course | undefined {
  return AVAILABLE_COURSES.find((course) => course.code === courseCode);
}

export function getQuestionsByWeek(courseCode: string, week: number): Question[] {
  return courseQuestionBanks[courseCode]?.[week] ?? [];
}

export function getAllQuestions(courseCode: string): Question[] {
  return Object.values(courseQuestionBanks[courseCode] ?? {}).flat();
}

export function getQuestionsForQuiz(
  courseCode: string,
  week: number | 'all',
  difficulty: string,
  count: number | 'all',
): Question[] {
  let pool: Question[] = [];
  if (week === 'all') {
    pool = getAllQuestions(courseCode);
  } else {
    pool = getQuestionsByWeek(courseCode, week);
  }

  if (difficulty !== 'Mixed') {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  if (count === 'all' || count >= shuffled.length) {
    return shuffled;
  }

  return shuffled.slice(0, count);
}

export function searchQuestions(
  courseCode: string,
  query: string,
  filters: { difficulty?: string; week?: number } = {},
): Question[] {
  let pool = getAllQuestions(courseCode);

  if (filters.week) {
    pool = pool.filter((q) => q.week === filters.week);
  }

  if (filters.difficulty && filters.difficulty !== 'Mixed') {
    pool = pool.filter((q) => q.difficulty === filters.difficulty);
  }

  if (!query.trim()) return pool;

  const lowerQuery = query.toLowerCase();
  return pool.filter(
    (q) =>
      q.question.toLowerCase().includes(lowerQuery) ||
      q.topic.toLowerCase().includes(lowerQuery) ||
      q.subTopic.toLowerCase().includes(lowerQuery) ||
      q.keywords.some((k) => k.toLowerCase().includes(lowerQuery)),
  );
}