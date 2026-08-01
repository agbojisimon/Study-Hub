import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const CoursePage = lazy(() => import('@/pages/CoursePage'));
const WeekPage = lazy(() => import('@/pages/WeekPage'));
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const ResultsPage = lazy(() => import('@/pages/ResultsPage'));
const ReviewPage = lazy(() => import('@/pages/ReviewPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/course/:courseCode" element={<CoursePage />} />
                <Route path="/course/:courseCode/week/:week" element={<WeekPage />} />
                <Route path="/quiz/:courseCode/:week" element={<QuizPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<LandingPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ProgressProvider>
  );
}

export default App;
