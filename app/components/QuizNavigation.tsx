import * as React from "react";

interface QuizNavigationProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  answeredCount: number;
  onSubmit: () => void;
}

export function QuizNavigation({
  current,
  total,
  onPrev,
  onNext,
  answeredCount,
  onSubmit
}: QuizNavigationProps) {
  const pendingCount = total - answeredCount;
  const allAnswered = answeredCount === total;

  return (
    <div className="flex items-center justify-between w-full mb-1">
      {/* Left: Pending questions info */}
      {/* <div className="text-sm font-semibold text-text-low">
        Pending: <span className="text-text-high">{pendingCount}</span> */}
        {/* <span className="text-text-low"> / {total}</span> */}
      {/* </div> */}

      <div></div>

      <div className="flex items-center gap-2">
        {allAnswered ? (
          <button
            onClick={onSubmit}
            aria-label="Submit Quiz"
            className="px-4 py-1.5 rounded text-sm font-semibold transition bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Submit Quiz
          </button>
        ) : (
          <>
            {/* Previous button */}
            <button
              onClick={onPrev}
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
            {/* Next button */}
            <button
              onClick={onNext}
              disabled={current === total - 1}
              aria-label="Next"
              className={`
                p-1.5 rounded-full transition
                ${current === total - 1
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
          </>
        )}
      </div>
    </div>
  );
}