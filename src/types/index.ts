export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type QuizMode = 'practice' | 'exam';

export interface Question {
  id: string;
  week: number;
  weekTitle: string;
  topic: string;
  subTopic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  correctOption: string;
  explanation: string;
  incorrectExplanations: Record<string, string>;
  keywords: string[];
  estimatedTime: number;
}

export interface WeekMeta {
  week: number;
  weekTitle: string;
  questionCount: number;
}

export interface Course {
  code: string;
  title: string;
  description: string;
  weeks: WeekMeta[];
  totalQuestions: number;
}

export interface QuizConfig {
  courseCode: string;
  week: number | 'all';
  mode: QuizMode;
  difficulty: Difficulty | 'Mixed';
  questionCount: number | 'all';
}

export interface QuizResult {
  id: string;
  courseCode: string;
  week: number | 'all';
  mode: QuizMode;
  difficulty: Difficulty | 'Mixed';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;
  averageTimePerQuestion: number;
  date: string;
  answers: QuizAnswerRecord[];
  performanceByDifficulty: Record<string, { correct: number; total: number }>;
  performanceByWeek: Record<number, { correct: number; total: number }>;
  strongTopics: string[];
  weakTopics: string[];
  grade: string;
  percentage: number;
}

export interface QuizAnswerRecord {
  questionId: string;
  selectedAnswer: number | null;
  isCorrect: boolean;
  timeSpent: number;
  flagged: boolean;
}

export interface ProgressState {
  completedQuizzes: QuizResult[];
  highestScores: Record<string, number>;
  recentQuizzes: QuizResult[];
  completedWeeks: Record<string, number[]>;
  examHistory: QuizResult[];
  questionsAttempted: number;
  questionsCorrect: number;
  studyStreak: number;
  lastStudyDate: string;
  darkMode: boolean;
}
