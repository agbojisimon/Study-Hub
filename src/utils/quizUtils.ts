import type { QuizResult } from '@/types';

export function calculateGrade(percentage: number): string {
  if (percentage >= 70) return 'A';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 45) return 'D';
  if (percentage >= 40) return 'E';
  return 'F';
}

export function getMotivationalMessage(percentage: number): string {
  if (percentage >= 90) return 'Outstanding! You have mastered this material.';
  if (percentage >= 75) return 'Excellent work! You are well prepared for your exams.';
  if (percentage >= 60) return 'Great job! You have a solid understanding of the concepts.';
  if (percentage >= 50) return 'Good effort! Keep practicing to strengthen your knowledge.';
  if (percentage >= 40) return 'You are making progress. Review the material and try again.';
  return 'Keep studying! Every expert was once a beginner.';
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function generateQuizId(): string {
  return `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
