import * as React from "react";
import TeX from "@matejmazur/react-katex";
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

function renderWithLatex(text: string) {
  // First, handle the case where LaTeX commands are escaped with double backslashes
  const processedText = text.replace(/\\([\\{}_^])/g, '$1');
  
  // Split by $...$ and render inline math where found
  const parts = processedText.split(/(\$.*?\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      try {
        const mathContent = part.slice(1, -1).trim();
        return <TeX key={i} math={mathContent} />;
      } catch (e) {
        console.warn("Error rendering LaTeX:", part, e);
        return <span key={i} className="text-red-500">{part}</span>;
      }
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
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
        {question.question.startsWith('$$') && question.question.endsWith('$$')
          ? <TeX math={question.question.slice(2, -2)} block />
          : renderWithLatex(question.question)}
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
              <span>
                {opt.value.startsWith('$$') && opt.value.endsWith('$$')
                  ? <TeX math={opt.value.slice(2, -2)} block />
                  : renderWithLatex(opt.value)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}