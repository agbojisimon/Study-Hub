import {
  useParams,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { getQuestionsForQuiz, getCourse } from "@/services/courseService";
import type { QuizResult, QuizAnswerRecord, Difficulty } from "@/types";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { useProgress } from "@/contexts/ProgressContext";
import { calculateGrade, generateQuizId } from "@/utils/quizUtils";

export function QuizPage() {
  const { courseCode, week } = useParams<{
    courseCode: string;
    week: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addQuizResult } = useProgress();

  const mode = (searchParams.get("mode") as "practice" | "exam") ?? "practice";
  const difficulty = (searchParams.get("difficulty") as string) ?? "Mixed";
  const countParam = searchParams.get("count") ?? "10";
  const count: number | "all" =
    countParam === "all" ? "all" : parseInt(countParam, 10);
  const weekNum = week === "all" ? "all" : parseInt(week ?? "0", 10);

  const course = useMemo(() => getCourse(courseCode ?? ""), [courseCode]);

  const questions = useMemo(() => {
    if (!course) return [];
    return getQuestionsForQuiz(course.code, weekNum, difficulty, count);
  }, [course, weekNum, difficulty, count]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<string>>(
    new Set(),
  );
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [startTime] = useState(Date.now());
  const [questionStartTimes, setQuestionStartTimes] = useState<
    Record<string, number>
  >({});

  const currentQuestion = questions[currentIndex];
  const currentQuestionId = currentQuestion?.id ?? null;
  const isAnswered =
    currentQuestionId !== null
      ? submittedAnswers.has(currentQuestionId)
      : false;
  const selectedAnswer =
    currentQuestionId !== null ? (answers[currentQuestionId] ?? null) : null;
  const isFlagged =
    currentQuestionId !== null ? flagged.has(currentQuestionId) : false;

  const handleSubmit = useCallback(() => {
    if (!course || questions.length === 0) return;

    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    const answerRecords: QuizAnswerRecord[] = questions.map((q) => {
      const selected = answers[q.id] ?? null;
      const qStartTime = questionStartTimes[q.id] ?? startTime;
      const timeSpent = Math.round((Date.now() - qStartTime) / 1000);
      return {
        questionId: q.id,
        selectedAnswer: selected,
        isCorrect: selected === q.correctAnswer,
        timeSpent,
        flagged: flagged.has(q.id),
      };
    });

    const correctAnswers = answerRecords.filter((a) => a.isCorrect).length;
    const wrongAnswers = answerRecords.length - correctAnswers;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const grade = calculateGrade(percentage);
    const averageTimePerQuestion = Math.round(timeTaken / questions.length);

    const performanceByDifficulty: Record<
      string,
      { correct: number; total: number }
    > = {};
    const performanceByWeek: Record<
      number,
      { correct: number; total: number }
    > = {};
    const topicPerformance: Record<string, { correct: number; total: number }> =
      {};

    questions.forEach((q, idx) => {
      const record = answerRecords[idx];
      const diffKey = q.difficulty;
      if (!performanceByDifficulty[diffKey]) {
        performanceByDifficulty[diffKey] = { correct: 0, total: 0 };
      }
      performanceByDifficulty[diffKey].total++;
      if (record.isCorrect) performanceByDifficulty[diffKey].correct++;

      if (!performanceByWeek[q.week]) {
        performanceByWeek[q.week] = { correct: 0, total: 0 };
      }
      performanceByWeek[q.week].total++;
      if (record.isCorrect) performanceByWeek[q.week].correct++;

      if (!topicPerformance[q.topic]) {
        topicPerformance[q.topic] = { correct: 0, total: 0 };
      }
      topicPerformance[q.topic].total++;
      if (record.isCorrect) topicPerformance[q.topic].correct++;
    });

    const topicRates = Object.entries(topicPerformance).map(
      ([topic, stats]) => ({
        topic,
        rate: stats.total > 0 ? stats.correct / stats.total : 0,
      }),
    );
    const sortedTopics = [...topicRates].sort((a, b) => b.rate - a.rate);
    const strongTopics = sortedTopics
      .slice(0, 3)
      .filter((t) => t.rate >= 0.5)
      .map((t) => t.topic);
    const weakTopics = [...sortedTopics]
      .reverse()
      .slice(0, 3)
      .filter((t) => t.rate < 0.75)
      .map((t) => t.topic);

    const result: QuizResult = {
      id: generateQuizId(),
      courseCode: course.code,
      week: weekNum,
      mode,
      difficulty: difficulty as Difficulty | "Mixed",
      score: correctAnswers,
      totalQuestions: questions.length,
      correctAnswers,
      wrongAnswers,
      timeTaken,
      averageTimePerQuestion,
      date: new Date().toISOString(),
      answers: answerRecords,
      performanceByDifficulty,
      performanceByWeek,
      strongTopics,
      weakTopics,
      grade,
      percentage,
    };

    addQuizResult(result);
    navigate("/results", { state: { result, questions } });
  }, [
    course,
    questions,
    startTime,
    answers,
    questionStartTimes,
    flagged,
    weekNum,
    mode,
    difficulty,
    addQuizResult,
    navigate,
  ]);

  useEffect(() => {
    if (!currentQuestionId) return;
    setQuestionStartTimes((prev) => {
      if (prev[currentQuestionId] !== undefined) return prev;
      return { ...prev, [currentQuestionId]: Date.now() };
    });
  }, [currentQuestionId]);

  const handleSelectAnswer = useCallback(
    (idx: number) => {
      if (isAnswered || !currentQuestionId) return;
      setAnswers((prev) => ({ ...prev, [currentQuestionId]: idx }));
      setSubmittedAnswers((prev) => {
        const next = new Set(prev);
        next.add(currentQuestionId);
        return next;
      });
    },
    [isAnswered, currentQuestionId],
  );

  const handleToggleFlag = useCallback(() => {
    if (!currentQuestionId) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestionId)) {
        next.delete(currentQuestionId);
      } else {
        next.add(currentQuestionId);
      }
      return next;
    });
  }, [currentQuestionId]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
    handleSubmit();
  }, [currentIndex, questions.length, handleSubmit]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const navigatorItems = useMemo(() => {
    const total = questions.length;
    if (total <= 11) return Array.from({ length: total }, (_, i) => i);

    const around = [
      currentIndex - 2,
      currentIndex - 1,
      currentIndex,
      currentIndex + 1,
      currentIndex + 2,
    ].filter((idx) => idx > 0 && idx < total - 1);

    const indexes = [0, ...around, total - 1].sort((a, b) => a - b);
    const unique = indexes.filter(
      (val, i, arr) => i === 0 || val !== arr[i - 1],
    );

    const items: Array<number | "ellipsis"> = [];
    unique.forEach((idx, i) => {
      if (i > 0 && idx - unique[i - 1] > 1) items.push("ellipsis");
      items.push(idx);
    });
    return items;
  }, [questions.length, currentIndex]);

  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="card p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">Course not found.</p>
          <Link to="/" className="btn-primary mt-4">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="card p-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No questions available for this selection.
          </p>
          <Link to={`/course/${course.code}`} className="btn-primary mt-4">
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[680px] px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <Link
          to={`/course/${course.code}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit Quiz
        </Link>

        <div className="flex items-center gap-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
            Question {currentIndex + 1} of {questions.length}
          </p>
          {mode === "exam" ? (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
              Exam Mode
            </span>
          ) : (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
              Practice Mode
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-[13px]">
        <span>Week {currentQuestion.week}</span>
        <span aria-hidden="true">·</span>
        <span>{currentQuestion.weekTitle}</span>
        <span aria-hidden="true">·</span>
        <span>{currentQuestion.topic}</span>
        <span aria-hidden="true">·</span>
        <span>{currentQuestion.subTopic}</span>
        <span aria-hidden="true">·</span>
        <span>{currentQuestion.difficulty}</span>
      </p>

      <div className="mt-4">
        <ProgressBar
          value={currentIndex + 1}
          max={questions.length}
          label="Progress"
        />
      </div>

      <div className="mt-6">
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          isFlagged={isFlagged}
          onSelectAnswer={handleSelectAnswer}
          onToggleFlag={handleToggleFlag}
        />
      </div>

      <div className="mt-8 flex items-center justify-between gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
          {navigatorItems.map((item, idx) => {
            if (item === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  aria-hidden="true"
                  className="h-1 w-1 shrink-0 rounded-full bg-gray-300 dark:bg-gray-700"
                />
              );
            }

            return (
              <button
                key={questions[item].id}
                onClick={() => setCurrentIndex(item)}
                aria-label={`Go to question ${item + 1}`}
                className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
                  item === currentIndex
                    ? "bg-primary-600"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-primary-400"
        >
          {currentIndex === questions.length - 1
            ? "Finish Quiz"
            : "Next Question"}
          {currentIndex === questions.length - 1 ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export default QuizPage;
