import * as React from "react";

type Option = { id: string; value: string };
type Question = {
  id: number;
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

// Add a key based on the question's id to fully reset the option buttons if you want!
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
    // Optional: focus the first option instead
    // optionRefs.current[0]?.focus();
  }, [question.id]);

  const handleSelect = (optionId: string, idx: number) => {
    if (disabled) return;
    onSelect(optionId);
    if (autoNext && onAutoNext) {
      setTimeout(() => {
        onAutoNext();
      }, 150);
    }
  };

  return (
    <div className="bg-surface rounded-xl shadow-card p-5 min-h-[120px] flex flex-col justify-center">
      <div className="font-bold text-lg text-text-high mb-3">
        {question.question}
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
              <span>{opt.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}