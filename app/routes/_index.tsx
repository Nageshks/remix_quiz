import type { MetaFunction } from "@remix-run/node";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import API from "~/api/quizApi";


export const meta: MetaFunction = () => {
  return [
    { title: "Quiz App" },
    { name: "description", content: "Quiz App" },
  ];
};

type Course = {
  id: number;
  name: string;
  description?: string;
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    API.get("courses")
      .then((res) => setCourses(res.data))
      .catch(() => setError("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 rounded shadow">
      <h1 className="text-3xl font-bold text-center mb-2">Quiz App</h1>
      <h2 className="text-xl text-center text-gray-600 mb-6">Choose a Course to Begin</h2>
      {loading && <div className="text-center">Loading…</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      <ul>
        {courses.map((course) => (
          <li key={course.id} className="mb-2">
            <a
              href={`/quiz-setup?courseId=${course.id}`}
              className="block p-4 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <span className="font-medium">{course.name}</span>
              {course.description && (
                <div className="text-sm text-blue-200">{course.description}</div>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}