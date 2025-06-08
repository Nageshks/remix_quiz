import * as React from "react";
import { useSearchParams, useNavigate, MetaFunction } from "@remix-run/react";
import API from "~/api/quizApi";
import { SinglePicker } from "~/components/SinglePicker";
import { ModulePicker } from "~/components/ModulePicker";
import { LoadingSpinner } from "~/components/LoadingSpinner";

type Semester = { id: number; name: string };
type Subject = { id: number; name: string };
type Module = { id: number; name: string };

export const meta: MetaFunction = () => [
  { title: "Quiz Setup" },
  { name: "description", content: "Quiz App" },
];

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
  const [selectedCount, setSelectedCount] = React.useState("20");

  React.useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    API.get(`courses/${courseId}/semesters`)
      .then((res) => setSemesters(res.data))
      .catch(() => setError("Failed to load semesters"))
      .finally(() => setLoading(false));
  }, [courseId]);

  React.useEffect(() => {
    if (!selectedSemester) return;
    setLoading(true);
    API.get(`semesters/${selectedSemester}/subjects`)
      .then((res) => setSubjects(res.data))
      .catch(() => setError("Failed to load subjects"))
      .finally(() => setLoading(false));
  }, [selectedSemester]);

  React.useEffect(() => {
    if (!selectedSubject) return;
    setLoading(true);
    API.get(`subjects/${selectedSubject}/modules`)
      .then((res) => setModules(res.data))
      .catch(() => setError("Failed to load modules"))
      .finally(() => setLoading(false));
  }, [selectedSubject]);

  const handleStartQuiz = () => {
    if (selectedModules.length === 0) return;
    navigate(`/quiz?moduleIds=${selectedModules.join(",")}&count=${selectedCount}`);
  };
  

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-2 py-8">
      <div className="w-full max-w-xl bg-surface rounded-2xl shadow-card p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-primary">Quiz Setup</h1>
        {error && (
          <div className="my-2 bg-border-error/10 border border-border-error text-border-error px-4 py-2 rounded">
            {error}
          </div>
        )}
        <div className="mt-6 flex flex-col gap-4">
          {/* Semester Picker */}
          <SinglePicker
            label="Semester"
            items={semesters}
            selected={selectedSemester}
            onSelect={id => {
              setSelectedSemester(id);
              setSubjects([]);
              setSelectedSubject("");
              setModules([]);
              setSelectedModules([]);
              setError(null);
            }}
            disabled={loading}
          />

          {/* Subject Picker */}
          <SinglePicker
            label="Subject"
            items={subjects}
            selected={selectedSubject}
            onSelect={id => {
              setSelectedSubject(id);
              setModules([]);
              setSelectedModules([]);
              setError(null);
            }}
            disabled={loading || !selectedSemester}
          />

          {/* Module Picker */}
          <div>
            <label className="block font-semibold mb-1 text-text-high">Module(s)</label>
            <ModulePicker
              modules={modules}
              selectedModules={selectedModules}
              onToggle={id =>
                setSelectedModules(prev =>
                  prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
                )
              }
              disabled={loading}
            />
          </div>

          <SinglePicker
            label="Question Count"
            items={[
              { id: "20", name: "20" },
              { id: "10", name: "10" },
              { id: "5", name: "5" },
            ]}
            selected={selectedCount}
            onSelect={setSelectedCount}
            disabled={loading}
          />
          <button
            className={`w-full py-2 rounded font-semibold transition 
            ${selectedModules.length > 0 && !loading
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-border text-text-low cursor-not-allowed"
              }`}
            disabled={selectedModules.length === 0 || loading}
            onClick={handleStartQuiz}
          >
            {loading ? <LoadingSpinner /> : "Start Quiz"}
          </button>
        </div>
      </div>
    </main>
  );
}