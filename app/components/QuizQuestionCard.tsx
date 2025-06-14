import * as React from "react";
import { renderTextWithLatex } from "~/utils/latexUtils";
import "katex/dist/katex.min.css";

type Option = { id: string; value: string };
type Question = {
  id: string;
  question: string;
  options: Option[];
  answer: string;
  explanation: string;
};

interface QuizQuestionCardProps {
  question: Question;
  selectedOption: string | undefined;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
  autoNext?: boolean;
  onAutoNext?: () => void;
}

export function QuizQuestionCard({
  question,
  selectedOption,
  onSelect,
  disabled,
  autoNext = false,
  onAutoNext,
}: QuizQuestionCardProps) {
  // Refs for all option buttons
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // On question change, blur all options
  React.useEffect(() => {
    optionRefs.current.forEach(btn => btn && btn.blur());
  }, [question.id]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (disabled) return;
      
      // Check if the key is a number between 1-4
      const numKey = parseInt(e.key);
      if (numKey >= 1 && numKey <= 4 && numKey <= question.options.length) {
        e.preventDefault();
        const optionId = question.options[numKey - 1].id;
        handleSelect(optionId, numKey - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [question.options, disabled]);

  const handleSelect = (optionId: string, idx: number) => {
    if (disabled) return;
    onSelect(optionId);
    if (autoNext && onAutoNext) {
      setTimeout(() => {
        onAutoNext();
      }, 150);
    }
  };

  // Get option label (A, B, C, D)
  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
  };

  return (
    <div className="bg-surface rounded-xl shadow-card p-5 min-h-[120px] flex flex-col justify-center">
      <div className="font-bold text-lg text-text-high mb-3">
        {renderTextWithLatex(question.question)}
      </div>
      <div className="flex flex-col gap-2" role="radiogroup">
        {question.options.map((opt, idx) => {
          const selected = selectedOption === opt.id;
          return (
            <button
              key={opt.id}
              ref={el => (optionRefs.current[idx] = el)}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={0}
              onClick={() => handleSelect(opt.id, idx)}
              className={`
                flex items-center gap-3 w-full text-left px-2 py-1.5 rounded-md text-base
                transition outline-none bg-transparent
                ${selected ? "font-semibold text-primary" : "text-text-high"}
                ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-primary/5"}
                focus:ring-2 focus:ring-primary/40 select-none duration-100
              `}
              onKeyDown={e => {
                if (!disabled && (e.key === " " || e.key === "Enter")) {
                  e.preventDefault();
                  handleSelect(opt.id, idx);
                }
              }}
              disabled={disabled}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-border text-sm font-medium">
                {getOptionLabel(idx)}
              </span>
              <span>
                {renderTextWithLatex(opt.value)}
              </span>
              <span className="ml-auto text-sm text-text-low">
                Press {idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}