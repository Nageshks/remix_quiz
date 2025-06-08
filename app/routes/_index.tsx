import type { MetaFunction } from "@remix-run/node";
import * as React from "react";
import API from "~/api/quizApi";
import { CourseCard } from "~/components/CourseCard";
import { LoadingSpinner } from "~/components/LoadingSpinner";

export const meta: MetaFunction = () => [
  { title: "Quiz App" },
  { name: "description", content: "Quiz App" },
];

type Course = {
  id: number;
  name: string;
  description?: string;
};

export default function Home() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    API.get("courses")
      .then((res) => setCourses(res.data))
      .catch(() => setError("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-background transition-colors flex flex-col">
      <section className="w-full max-w-2xl mx-auto px-4 py-16 sm:py-24 flex-1 flex flex-col">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-primary mb-2">Quiz App</h1>
          <p className="text-lg text-text-low">Choose a Course to Begin</p>
        </div>
        {loading && (
          <div className="text-center text-text-low">
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div className="text-center bg-border-error/10 text-border-error border border-border-error rounded p-3 mb-4 max-w-md mx-auto">
            {error}
          </div>
        )}
        <ul className="grid gap-6 grid-cols-1 flex-1">
          {courses.map((course) => (
            <li key={course.id}>
              <CourseCard
                name={course.name}
                description={course.description}
                href={`/quiz-setup?courseId=${course.id}`}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}