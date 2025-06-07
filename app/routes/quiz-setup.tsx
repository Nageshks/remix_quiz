import * as React from "react";
import { useSearchParams, useNavigate } from "@remix-run/react";
import axios from "axios";
import API from "~/api/quizApi";

type Semester = { id: number; name: string };
type Subject = { id: number; name: string };
type Module = { id: number; name: string };

export default function QuizSetup() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const navigate = useNavigate();

  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [modules, setModules] = React.useState<Module[]>([]);
  const [selectedSemester, setSelectedSemester] = React.useState("");
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [selectedModules, setSelectedModules] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Fetch semesters when courseId changes
  React.useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    API
      .get(`courses/${courseId}/semesters`)
      .then((res) => setSemesters(res.data))
      .catch(() => setError("Failed to load semesters"))
      .finally(() => setLoading(false));
  }, [courseId]);

  // Fetch subjects when semester changes
  React.useEffect(() => {
    if (!selectedSemester) return;
    setLoading(true);
    API
      .get(`semesters/${selectedSemester}/subjects`)
      .then((res) => setSubjects(res.data))
      .catch(() => setError("Failed to load subjects"))
      .finally(() => setLoading(false));
  }, [selectedSemester]);

  // Fetch modules when subject changes
  React.useEffect(() => {
    if (!selectedSubject) return;
    setLoading(true);
    API
      .get(`subjects/${selectedSubject}/modules`)
      .then((res) => setModules(res.data))
      .catch(() => setError("Failed to load modules"))
      .finally(() => setLoading(false));
  }, [selectedSubject]);

  const handleModuleToggle = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  const handleStartQuiz = () => {
    if (selectedModules.length === 0) return;
    navigate(`/quiz?moduleIds=${selectedModules.join(",")}`);
  };

  return (
    <div className="max-w-lg mx-auto mt-16 bg-white dark:bg-gray-900 rounded-xl shadow p-6">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">Quiz Setup</h1>
      {error && (
        <div className="my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
      <div className="mt-6 flex flex-col gap-4">
        {/* Semester Select */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200" htmlFor="semester">
            Semester
          </label>
          <select
            id="semester"
            className="w-full px-2 py-2 rounded border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:ring focus:ring-blue-200"
            value={selectedSemester}
            onChange={e => {
              setSelectedSemester(e.target.value);
              setSubjects([]);
              setSelectedSubject("");
              setModules([]);
              setSelectedModules([]);
              setError(null);
            }}
            disabled={loading || semesters.length === 0}
          >
            <option value="">Select semester</option>
            {semesters.map(sem => (
              <option key={sem.id} value={sem.id}>{sem.name}</option>
            ))}
          </select>
        </div>

        {/* Subject Select */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200" htmlFor="subject">
            Subject
          </label>
          <select
            id="subject"
            className="w-full rounded px-2 py-2 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:ring focus:ring-blue-200"
            value={selectedSubject}
            onChange={e => {
              setSelectedSubject(e.target.value);
              setModules([]);
              setSelectedModules([]);
              setError(null);
            }}
            disabled={!selectedSemester || loading || subjects.length === 0}
          >
            <option value="">Select subject</option>
            {subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        {/* Module Multi-Select */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">
            Module(s)
          </label>
          <div className="flex flex-col gap-2">
            {modules.length === 0 && (
              <div className="text-gray-400 text-sm">No modules found.</div>
            )}
            {modules.map(mod => (
              <label key={mod.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  value={mod.id}
                  checked={selectedModules.includes(String(mod.id))}
                  onChange={() => handleModuleToggle(String(mod.id))}
                  disabled={loading}
                />
                <span className="text-gray-800 dark:text-gray-100">{mod.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          className={`w-full py-2 rounded text-white font-semibold transition 
            ${selectedModules.length > 0 && !loading
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
            }`}
          disabled={selectedModules.length === 0 || loading}
          onClick={handleStartQuiz}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              Loading…
            </span>
          ) : (
            "Start Quiz"
          )}
        </button>
      </div>
    </div>
  );
}