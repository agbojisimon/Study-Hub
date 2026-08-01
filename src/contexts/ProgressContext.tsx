import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loadProgress, saveProgress, recordQuizResult, resetProgress } from '@/services/progressService';
import type { ProgressState, QuizResult } from '@/types';

interface ProgressContextValue {
  progress: ProgressState;
  addQuizResult: (result: QuizResult) => void;
  toggleDarkMode: () => void;
  clearProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (progress.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [progress.darkMode]);

  const addQuizResult = (result: QuizResult) => {
    setProgress((prev) => recordQuizResult(prev, result));
  };

  const toggleDarkMode = () => {
    setProgress((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const clearProgress = () => {
    setProgress(resetProgress());
  };

  return (
    <ProgressContext.Provider value={{ progress, addQuizResult, toggleDarkMode, clearProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
