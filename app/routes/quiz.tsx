import * as React from "react";
import { useSearchParams, useNavigate, MetaFunction } from "@remix-run/react";
import API from "~/api/quizApi";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { QuizQuestionCard } from "~/components/QuizQuestionCard";
import { QuizNavigation } from "~/components/QuizNavigation";
import { QuizResult } from "~/components/QuizResultModal";
import { QuizSettings } from "~/components/QuizSettings";

// Types
type Option = { id: string; value: string };
type Question = {
  id: string;
  question: string;
  options: Option[];
  answer: string;
  explanation: string;
};

type QuizItem = {
  question: Question;
  selectedOptionId?: string;
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export const meta: MetaFunction = () => [
  { title: "Quiz" },
  { name: "description", content: "Quiz App" },
];

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const moduleIds = searchParams.get("moduleIds");
  const count = Number(searchParams.get("count") || "20");
  const duration = count * 120; // 2 min/q

  const [quizItems, setQuizItems] = React.useState<QuizItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);
  const [timeElapsed, setTimeElapsed] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [autoNext, setAutoNext] = React.useState(true);

  // Fetch questions on mount
  React.useEffect(() => {
    if (!moduleIds) return;
    setLoading(true);
    API.get("module-questions", {
      params: { moduleIds, limit: count },
    })
      .then((res) => {
        const questions = res.data;
        const quizItems = questions.map((q: any) => {
          // Ensure options have the correct format
          const options = q.options.map((opt: any) => ({
            id: opt.key || opt.id, // Use key if available, otherwise use id
            value: opt.value
          }));
          return {
            question: {
              ...q,
              id: String(q.id),
              options
            }
          };
        });
        setQuizItems(quizItems);
      })
      .catch(() => setError("Failed to load quiz questions."))
      .finally(() => setLoading(false));
  }, [moduleIds, count]);

  // Timer effect
  React.useEffect(() => {
    if (loading || showResult) return;
    timerRef.current = setInterval(() => {
      setTimeElapsed((sec) => sec + 1);
    }, 1000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [loading, showResult]);

  // Auto-submit when time is up
  React.useEffect(() => {
    if (timeElapsed >= duration && !showResult && quizItems.length > 0) {
      setShowResult(true);
      timerRef.current && clearInterval(timerRef.current);
    }
  }, [timeElapsed, duration, showResult, quizItems.length]);

  // Focus management for autoNext (fixes focus bug)
  React.useEffect(() => {
    if (autoNext) {
      setTimeout(() => {
        if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 10);
    }
  }, [current, autoNext]);

  const handleSelect = (optionId: string) => {
    if (!quizItems[current]) return;
    
    // Create a new array with the updated selection
    const updatedItems = quizItems.map((item, idx) => {
      if (idx === current) {
        return {
          ...item,
          selectedOptionId: optionId
        };
      }
      return item;
    });
    
    setQuizItems(updatedItems);
  };

  const handlePrev = () => setCurrent((i) => Math.max(0, i - 1));
  const handleNext = () => setCurrent((i) => Math.min(quizItems.length - 1, i + 1));

  const handleSubmit = () => {
    setShowResult(true);
    timerRef.current && clearInterval(timerRef.current);
  };

  const handleAutoNext = () => {
    if (current < quizItems.length - 1) setCurrent(current + 1);
  };

  const handleRestart = () => {
    setQuizItems(prev => prev.map(item => ({ ...item, selectedOptionId: undefined })));
    setShowResult(false);
    setCurrent(0);
    setTimeElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleCustomize = () => {
    // Get the current parameters from the URL
    const currentParams = new URLSearchParams(searchParams);
    const params = new URLSearchParams();
    
    // Add all required parameters
    if (currentParams.has('courseId')) {
      params.set('courseId', currentParams.get('courseId')!);
    }
    if (currentParams.has('semesterId')) {
      params.set('semesterId', currentParams.get('semesterId')!);
    }
    if (currentParams.has('subjectId')) {
      params.set('subjectId', currentParams.get('subjectId')!);
    }
    if (currentParams.has('moduleIds')) {
      params.set('moduleIds', currentParams.get('moduleIds')!);
    }
    if (currentParams.has('count')) {
      params.set('count', currentParams.get('count')!);
    }
    
    // Navigate to quiz-setup with all parameters
    navigate(`/quiz-setup?${params.toString()}`);
  };

  const allAnswered = quizItems.length > 0 && 
    quizItems.every(item => Boolean(item.selectedOptionId));

  return (
    <main className="min-h-screen flex flex-col bg-background transition-colors">
      <section className="w-full max-w-2xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center relative">
        {/* Navbar + Timer */}
        {!loading && !error && (
          <div className="absolute top-6 left-0 right-0 flex items-center justify-between px-2">
            {/* Left: Question number */}
            <div className="text-sm font-semibold text-text-low">
              Question <span className="text-text-high">{current + 1}</span>
              <span className="text-text-low"> / {quizItems.length}</span>
            </div>
            {/* Center: Timer and settings */}
            <div className="flex items-center gap-3">
              <QuizSettings autoNext={autoNext} setAutoNext={setAutoNext} />
              <span className="font-semibold text-text-high">
                Time {timeElapsed < duration ? "Left" : "Elapsed"}:
              </span>
              <span className={timeElapsed >= duration * 0.8 ? "text-red-600 font-bold" : "text-primary font-bold"}>
                {timeElapsed < duration
                  ? formatTime(duration - timeElapsed)
                  : formatTime(timeElapsed)}
              </span>
            </div>
            {/* Right: Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={current === 0}
                aria-label="Previous"
                className={`
                  p-1.5 rounded-full transition 
                  ${current === 0
                    ? "bg-border text-text-low cursor-not-allowed"
                    : "bg-surface border border-border hover:border-primary text-text-high"
                  }
                  flex items-center justify-center
                `}
              >
                <svg width={18} height={18} fill="none" viewBox="0 0 18 18">
                  <path d="M11.5 14L7 9l4.5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                disabled={current === quizItems.length - 1}
                aria-label="Next"
                className={`
                  p-1.5 rounded-full transition
                  ${current === quizItems.length - 1
                    ? "bg-border text-text-low cursor-not-allowed"
                    : "bg-surface border border-border hover:border-primary text-text-high"
                  }
                  flex items-center justify-center
                `}
              >
                <svg width={18} height={18} fill="none" viewBox="0 0 18 18">
                  <path d="M6.5 4l4.5 5-4.5 5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || showResult}
                className={`
                  ml-2 px-3 py-1.5 rounded text-sm font-semibold transition
                  ${allAnswered && !showResult
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-border text-text-low cursor-not-allowed"
                  }
                `}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center bg-border-error/10 text-border-error border border-border-error rounded p-3 mb-4 max-w-md mx-auto">
            {error}
          </div>
        ) : (
          <>
            {!showResult && (
              <div className="flex flex-col gap-5 mt-24">
                <QuizQuestionCard
                  question={quizItems[current].question}
                  selectedOption={quizItems[current].selectedOptionId}
                  onSelect={handleSelect}
                  autoNext={autoNext}
                  onAutoNext={handleAutoNext}
                  disabled={showResult}
                />

                <QuizNavigation
                  current={current}
                  total={quizItems.length}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  answeredCount={quizItems.filter(item => item.selectedOptionId !== undefined).length}
                />
              </div>
            )}

            {showResult && (
              <QuizResult
                quizItems={quizItems}
                onRestart={handleRestart}
                onGoHome={handleGoHome}
                onCustomize={handleCustomize}
              />
            )}
          </>
        )}
      </section>
    </main>
  );
}