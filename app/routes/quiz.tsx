import * as React from "react";
import { useSearchParams, useNavigate } from "@remix-run/react";
import axios from "axios";
import API from "~/api/quizApi";

type Option = { key: string; value: string };
type Question = {
  id: number;
  question: string;
  options: Option[];
  answer: string; // correct answer, not shown to user
};

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const moduleIds = searchParams.get("moduleIds") || "";
  const navigate = useNavigate();

  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [current, setCurrent] = React.useState(0);
  const [selected, setSelected] = React.useState<Record<number, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    if (!moduleIds) return;
    setLoading(true);
    API
      .get(`module-questions?moduleIds=${moduleIds}`)
      .then(res => setQuestions(res.data))
      .catch((e) => {
        setError("Failed to load questions due to " + e.message);
      })
      .finally(() => setLoading(false));
  }, [moduleIds]);

  const handleSelect = (qid: number, option: string) => {
    setSelected(prev => ({ ...prev, [qid]: option }));
  };

  const handleSubmit = () => {
    let sc = 0;
    for (const q of questions) {
      if (selected[q.id] === q.answer) sc += 1;
    }
    setScore(sc);
    setSubmitted(true);
  };

  if (loading) {
    return (
        <div className="flex flex-1 w-full h-full justify-center items-center">
            <p>Loading questions...</p>
        </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-16 p-4 bg-red-100 border border-red-400 rounded text-red-700">
        {error}
      </div>
    );
  }
  if (questions.length === 0) {
    return (
      <div className="max-w-lg mx-auto mt-16 p-4 bg-gray-100 border border-gray-300 rounded text-gray-700">
        No questions found for the selected module(s).
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="max-w-lg mx-auto mt-16 bg-white dark:bg-gray-900 p-6 rounded shadow">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-gray-600 dark:text-gray-300">Question {current + 1} of {questions.length}</span>
        {submitted && (
          <span className="font-semibold text-blue-600">
            Score: {score} / {questions.length}
          </span>
        )}
      </div>
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{q.question}</h2>
      <div className="space-y-2">
        {q.options.map(option => (
          <label
            key={option.key}
            className={`flex items-center p-4 rounded cursor-pointer border 
              ${selected[q.id] === option.key
                ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                : "border-gray-600 dark:border-gray-700"
              }
              ${submitted && option.key === q.answer ? "ring-2 ring-green-400" : ""}
            `}
          >
            <input
              type="radio"
              name={`q${q.id}`}
              value={option.value}
              disabled={submitted}
              checked={selected[q.id] === option.key}
              onChange={() => handleSelect(q.id, option.key)}
              className="mx-2 accent-blue-600"
            />
            <span className={`
              ${submitted 
                ? option.key === q.answer 
                  ? "font-bold text-green-700 dark:text-green-400" 
                  : selected[q.id] === option.key
                    ? "text-red-600 dark:text-red-400" : ""
                : ""}
            `}>
              {option.value}
            </span>
          </label>
        ))}
      </div>
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        {current < questions.length - 1 && (
          <button
            onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Next
          </button>
        )}
        {current === questions.length - 1 && !submitted && (
          <button
            onClick={handleSubmit}
            disabled={
              Object.keys(selected).length !== questions.length
            }
            className="ml-auto px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            Submit
          </button>
        )}
      </div>
      {submitted && (
        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="w-full py-2 rounded bg-blue-600 text-white mt-2 hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      )}
    </div>
  );
}