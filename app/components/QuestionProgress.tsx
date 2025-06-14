import * as React from "react";

interface QuestionProgressProps {
  total: number;
  current: number;
  answeredQuestions: boolean[];
  onQuestionClick: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function QuestionProgress({
  total,
  current,
  answeredQuestions,
  onQuestionClick,
  isOpen,
  onClose,
}: QuestionProgressProps) {
  if (!isOpen) return null;

  const pendingCount = answeredQuestions.filter(answered => !answered).length;

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-surface rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-high">Question Progress</h2>
            <p className="text-sm text-text-low mt-1">
              {pendingCount} question{pendingCount !== 1 ? 's' : ''} pending
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-primary/10 rounded-full transition"
            aria-label="Close"
          >
            <svg width={24} height={24} fill="none" viewBox="0 0 24 24" className="text-text-high">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: total }).map((_, index) => {
            const isAnswered = answeredQuestions[index];
            const isCurrent = current === index;
            
            return (
              <button
                key={index}
                onClick={() => {
                  onQuestionClick(index);
                  onClose();
                }}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-colors
                  ${isCurrent 
                    ? "bg-primary text-primary-foreground" 
                    : isAnswered
                      ? "bg-primary/10 text-primary border border-primary"
                      : "bg-muted text-text-low border border-border"
                  }
                  hover:border-primary
                `}
                aria-label={`Question ${index + 1}${isAnswered ? " (Answered)" : " (Not answered)"}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="text-text-high">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary/10 border border-primary"></span>
            <span className="text-text-high">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-muted border border-border"></span>
            <span className="text-text-high">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
} 