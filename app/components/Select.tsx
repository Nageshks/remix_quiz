import * as React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { id: string | number; name: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loading?: boolean;
}

export function Select({ label, options, value, onChange, loading, id, ...rest }: SelectProps) {
  return (
    <div>
      <label className="block font-semibold mb-1 text-text-high" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-2 py-2 rounded border border-border bg-surface text-text-high focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        disabled={loading || options.length === 0}
        {...rest}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>
  );
}