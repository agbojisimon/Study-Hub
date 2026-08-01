import type { Course, Question, WeekMeta } from '@/types';

import week1 from '@/data/COS102/week1.json';
import week2 from '@/data/COS102/week2.json';
import week3 from '@/data/COS102/week3.json';
import week4 from '@/data/COS102/week4.json';
import week5 from '@/data/COS102/week5.json';
import week6 from '@/data/COS102/week6.json';
import week7 from '@/data/COS102/week7.json';
import week8 from '@/data/COS102/week8.json';
import week9 from '@/data/COS102/week9.json';

const weekData: Record<number, Question[]> = {
  1: week1 as Question[],
  2: week2 as Question[],
  3: week3 as Question[],
  4: week4 as Question[],
  5: week5 as Question[],
  6: week6 as Question[],
  7: week7 as Question[],
  8: week8 as Question[],
  9: week9 as Question[],
};

const weekTitles: Record<number, string> = {
  1: 'Understanding the Problem',
  2: 'An Overview of Problem Solving Strategies',
  3: 'Divide and Conquer',
  4: 'Algorithm Concept',
  5: 'Flowchart Concepts',
  6: 'Pseudocode',
  7: 'Program Objects Concept',
  8: 'Abstraction Concepts',
  9: 'Statements and Blocks',
};

const courseMetadata: Record<string, { title: string; description: string }> = {
  COS102: {
    title: 'Introduction to Problem Solving',
    description:
      'A foundational course covering problem-solving strategies, algorithm development, flowcharting, pseudocode, object-oriented concepts, abstraction, and control flow in C programming.',
  },
};

const AVAILABLE_COURSES: Course[] = Object.keys(courseMetadata).map((code) => {
  const weeks: WeekMeta[] = Object.keys(weekData)
    .map((w) => parseInt(w, 10))
    .sort((a, b) => a - b)
    .map((w) => ({
      week: w,
      weekTitle: weekTitles[w] ?? `Week ${w}`,
      questionCount: weekData[w].length,
    }));

  return {
    code,
    title: courseMetadata[code].title,
    description: courseMetadata[code].description,
    weeks,
    totalQuestions: weeks.reduce((sum, w) => sum + w.questionCount, 0),
  };
});

export function getAvailableCourses(): Course[] {
  return AVAILABLE_COURSES;
}

export function getCourse(courseCode: string): Course | undefined {
  return AVAILABLE_COURSES.find((c) => c.code === courseCode);
}

export function getQuestionsByWeek(courseCode: string, week: number): Question[] {
  if (courseCode !== 'COS102') return [];
  return weekData[week] ?? [];
}

export function getAllQuestions(courseCode: string): Question[] {
  if (courseCode !== 'COS102') return [];
  return Object.values(weekData).flat();
}

export function getQuestionsForQuiz(
  courseCode: string,
  week: number | 'all',
  difficulty: string,
  count: number | 'all',
): Question[] {
  let pool: Question[];
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
