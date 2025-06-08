import * as React from "react";

type CourseCardProps = {
  name: string;
  description?: string;
  href: string;
};

export function CourseCard({ name, description, href }: CourseCardProps) {
  return (
    <a
      href={href}
      className={`
        group block rounded-xl border border-border bg-surface shadow-card p-5
        hover:border-primary hover:shadow-lg transition
        focus:outline-none focus:ring-2 focus:ring-primary/30
      `}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-lg font-semibold text-primary group-hover:underline">
          {name}
        </span>
        <svg
          className="w-5 h-5 text-primary opacity-80 group-hover:translate-x-1 transition"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
      </div>
      {description && (
        <p className="mt-1 text-text-low text-sm">{description}</p>
      )}
    </a>
  );
}