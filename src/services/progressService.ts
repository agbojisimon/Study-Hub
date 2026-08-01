import type { ProgressState, QuizResult } from '@/types';

const STORAGE_KEY = 'studyhub_progress';

const defaultState: ProgressState = {
  completedQuizzes: [],
  highestScores: {},
  recentQuizzes: [],
  completedWeeks: {},
  examHistory: [],
  questionsAttempted: 0,
  questionsCorrect: 0,
  studyStreak: 0,
  lastStudyDate: '',
  darkMode: false,
};

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function recordQuizResult(state: ProgressState, result: QuizResult): ProgressState {
  const newState = { ...state };

  newState.completedQuizzes = [...state.completedQuizzes, result];
  newState.recentQuizzes = [result, ...state.recentQuizzes].slice(0, 10);

  if (result.mode === 'exam') {
    newState.examHistory = [...state.examHistory, result];
  }

  const scoreKey = `${result.courseCode}-${result.week}`;
  const currentHigh = state.highestScores[scoreKey] ?? 0;
  if (result.percentage > currentHigh) {
    newState.highestScores = { ...state.highestScores, [scoreKey]: result.percentage };
  }

  if (result.week !== 'all') {
    const weeks = state.completedWeeks[result.courseCode] ?? [];
    if (!weeks.includes(result.week)) {
      newState.completedWeeks = {
        ...state.completedWeeks,
        [result.courseCode]: [...weeks, result.week],
      };
    }
  }

  newState.questionsAttempted = state.questionsAttempted + result.totalQuestions;
  newState.questionsCorrect = state.questionsCorrect + result.correctAnswers;

  const today = new Date().toISOString().split('T')[0];
  if (state.lastStudyDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (state.lastStudyDate === yesterdayStr) {
      newState.studyStreak = state.studyStreak + 1;
    } else {
      newState.studyStreak = 1;
    }
    newState.lastStudyDate = today;
  }

  return newState;
}

export function resetProgress(): ProgressState {
  return { ...defaultState };
}
