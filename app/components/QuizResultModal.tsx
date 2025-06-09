import * as React from "react";
import { renderTextWithLatex } from "~/utils/latexUtils";

type Option = { id: string; value: string };
type Question = {
  id: string;
  question: string;
  options: Option[];
  answer: string;
  explanation?: string;
};

type QuizItem = {
  question: Question;
  selectedOptionId?: string;
};

interface QuizResultProps {
  quizItems: QuizItem[];
  onRestart: () => void;
  onGoHome: () => void;
  onCustomize: () => void;
}

export function QuizResult({
  quizItems,
  onRestart,
  onGoHome,
  onCustomize,
}: QuizResultProps) {
  const total = quizItems.length;
  const correct = quizItems.filter(
    (item) => item.selectedOptionId === item.question.answer
  ).length;
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(0) : "0";

  return (
    <div className="max-w-xl mx-auto p-6 bg-surface rounded-xl shadow-card mt-24">
      <h2 className="text-2xl font-bold text-primary mb-2">Quiz Results</h2>
      <div className="mb-6">
        <div className="mb-1 font-semibold text-lg text-text-high">
          Score: <span className="text-primary">{correct}</span> / {total}
        </div>
        <div className="mb-1 font-semibold text-text-high">
          Accuracy: <span className="text-primary">{accuracy}%</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-text-high">Review Answers</h3>
        <ol className="space-y-4">
          {quizItems.map((item, idx) => {
            const selected = item.selectedOptionId;
            const isCorrect = selected === item.question.answer;
            const selectedOption = item.question.options.find(opt => opt.id === selected);
            const correctOption = item.question.options.find(opt => opt.id === item.question.answer);

            return (
              <li key={item.question.id} className="bg-muted rounded-lg p-3">
                <div className="mb-1 font-bold text-text-high">
                  Q{idx + 1}. {renderTextWithLatex(item.question.question)}
                </div>
                <div className="flex flex-col gap-1 ml-3 text-sm">
                  <div className="text-text-high">
                    Your answer:{" "}
                    <span className={isCorrect ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                      {selectedOption ? renderTextWithLatex(selectedOption.value) : <span className="text-text-low">Not answered</span>}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="text-text-high">
                      Correct answer:{" "}
                      <span className="text-primary font-semibold">
                        {correctOption ? renderTextWithLatex(correctOption.value) : <span className="text-text-low">N/A</span>}
                      </span>
                    </div>
                  )}
                  {item.question.explanation && (
                    <div className="text-gray-700 mt-1">
                      <span className="font-medium">Explanation:</span> {renderTextWithLatex(item.question.explanation)}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={onRestart}
          className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition"
        >
          Restart
        </button>
        <button
          onClick={onGoHome}
          className="px-4 py-2 rounded bg-surface border border-border text-text-high font-semibold hover:border-primary transition"
        >
          Home
        </button>
        <button
          onClick={onCustomize}
          className="px-4 py-2 rounded bg-surface border border-border text-text-high font-semibold hover:border-primary transition"
        >
          Customize
        </button>
      </div>
    </div>
  );
}