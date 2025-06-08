import * as React from "react";

type Option = { id: string; value: string };
type Question = {
  id: number;
  question: string;
  options: Option[];
  answer: string;
  explanation?: string;
};

interface QuizResultProps {
  questions: Question[];
  selectedOptions: Record<number, string>; // { [index]: optionId }
  onRestart: () => void;
  onGoHome: () => void;
  onCustomize: () => void;
}



export function QuizResult({
  questions,
  selectedOptions,
  onRestart,
  onGoHome,
  onCustomize,
}: QuizResultProps) {
  const total = questions.length;
  const correct = questions.filter(
    (q, idx) => selectedOptions[idx] === q.answer
  ).length;
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(0) : "0";

  return (
    <div className="max-w-xl mx-auto p-6 bg-surface rounded-xl shadow-card mt-8">
      <h2 className="text-2xl font-bold text-primary mb-2">Quiz Results</h2>
      <div className="mb-6">
        <div className="mb-1 font-semibold text-lg">
          Score: <span className="text-primary">{correct}</span> / {total}
        </div>
        <div className="mb-1 font-semibold">
          Accuracy: <span className="text-primary">{accuracy}%</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Review Answers</h3>
        <ol className="space-y-4">
          {questions.map((q, idx) => {
            const selected = selectedOptions[idx];
            const isCorrect = selected === q.answer;
            const selectedOption = q.options.find(opt => opt.id === selected);
            const correctOption = q.options?.find(opt => opt.id === q.answer);


            return (
              <li key={q.id} className="bg-muted rounded-lg p-3">
                <div className="mb-1 font-bold text-text-high">
                  Q{idx + 1}. {q.question}
                </div>
                <div className="flex flex-col gap-1 ml-3 text-sm">
                  <div>
                    Your answer:{" "}
                    <span className={isCorrect ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                      {selectedOption ? selectedOption.value : <span className="text-text-low">Not answered</span>}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div>
                      Correct answer:{" "}
                      <span className="text-primary font-semibold">
                        {correctOption ? correctOption.value : <span className="text-text-low">N/A</span>}
                      </span>
                    </div>
                  )}
                  {q.explanation && (
                    <div className="text-gray-700 mt-1">
                      <span className="font-medium">Explanation:</span> {q.explanation}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex justify-center gap-3 mt-6">
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