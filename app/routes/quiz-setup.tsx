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
  const semesterId = searchParams.get("semesterId");
  const subjectId = searchParams.get("subjectId");
  const moduleIds = searchParams.get("moduleIds");
  const count = searchParams.get("count");
  const navigate = useNavigate();

  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [modules, setModules] = React.useState<Module[]>([]);
  const [selectedSemester, setSelectedSemester] = React.useState(semesterId || "");
  const [selectedSubject, setSelectedSubject] = React.useState(subjectId || "");
  const [selectedModules, setSelectedModules] = React.useState<string[]>(moduleIds ? moduleIds.split(",") : []);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [selectedCount, setSelectedCount] = React.useState(count || "20");
  const [courseName, setCourseName] = React.useState<string>("");

  // Fetch course name
  React.useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    API.get(`courses/${courseId}`)
      .then((res) => setCourseName(res.data.name))
      .catch(() => setError("Failed to load course details"))
      .finally(() => setLoading(false));
  }, [courseId]);

  // Load semesters when courseId changes
  React.useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    API.get(`courses/${courseId}/semesters`)
      .then((res) => {
        setSemesters(res.data);
        // If we have a semesterId from URL, select it and load subjects
        if (semesterId) {
          setSelectedSemester(semesterId);
          return API.get(`semesters/${semesterId}/subjects`);
        }
      })
      .then((res) => {
        if (res) {
          setSubjects(res.data);
          // If we have a subjectId from URL, select it and load modules
          if (subjectId) {
            setSelectedSubject(subjectId);
            return API.get(`subjects/${subjectId}/modules`);
          }
        }
      })
      .then((res) => {
        if (res) {
          setModules(res.data);
        }
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [courseId, semesterId, subjectId]);

  // Load subjects when semester changes
  React.useEffect(() => {
    if (!selectedSemester) {
      setSubjects([]);
      setSelectedSubject("");
      setModules([]);
      setSelectedModules([]);
      return;
    }
    setLoading(true);
    API.get(`semesters/${selectedSemester}/subjects`)
      .then((res) => {
        setSubjects(res.data);
        // If we have a subjectId from URL and it matches current semester, select it
        if (subjectId && res.data.some((s: Subject) => String(s.id) === subjectId)) {
          setSelectedSubject(subjectId);
        } else {
          setSelectedSubject("");
        }
      })
      .catch(() => setError("Failed to load subjects"))
      .finally(() => setLoading(false));
  }, [selectedSemester, subjectId]);

  // Load modules when subject changes
  React.useEffect(() => {
    if (!selectedSubject) {
      setModules([]);
      setSelectedModules([]);
      return;
    }
    setLoading(true);
    API.get(`subjects/${selectedSubject}/modules`)
      .then((res) => {
        setModules(res.data);
        // If we have moduleIds from URL, verify they belong to current subject
        if (moduleIds) {
          const validModuleIds = moduleIds.split(",").filter(id => 
            res.data.some((m: Module) => String(m.id) === id)
          );
          setSelectedModules(validModuleIds);
        }
      })
      .catch(() => setError("Failed to load modules"))
      .finally(() => setLoading(false));
  }, [selectedSubject, moduleIds]);

  const handleStartQuiz = () => {
    if (selectedModules.length === 0) return;
    const params = new URLSearchParams();
    if (courseId) params.set("courseId", courseId);
    if (selectedSemester) params.set("semesterId", selectedSemester);
    if (selectedSubject) params.set("subjectId", selectedSubject);
    params.set("moduleIds", selectedModules.join(","));
    params.set("count", selectedCount);
    navigate(`/quiz?${params.toString()}`);
  };
  

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-2 py-8">
      <div className="w-full max-w-xl bg-surface rounded-2xl shadow-card p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-primary">Quiz Setup</h1>
        {courseName && (
          <h2 className="text-lg text-center mb-4 text-text-high">{courseName}</h2>
        )}
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