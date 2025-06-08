import * as React from "react";

type Item = { id: number | string; name: string };

interface SinglePickerProps {
  label: string;
  items: Item[];
  selected: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function SinglePicker({ label, items, selected, onSelect, disabled }: SinglePickerProps) {
  return (
    <div>
      <label className="block font-semibold mb-1 text-text-high">{label}</label>
      <div className="flex flex-wrap gap-3">
        {items.length === 0 && (
          <div className="text-text-low text-sm">No {label.toLowerCase()}s found.</div>
        )}
        {items.map(item => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            tabIndex={0}
            aria-pressed={selected === String(item.id)}
            className={`
              px-4 py-1 rounded-lg border
              flex items-center justify-center transition font-medium
              outline-none
              min-w-[120px] max-w-full
              ${selected === String(item.id)
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border bg-surface text-text-high hover:border-primary/50 hover:bg-primary/5"
              }
              ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
              focus:ring-2 focus:ring-primary/40
              select-none
              whitespace-nowrap
            `}
            onClick={() => onSelect(String(item.id))}
            onKeyDown={e => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                onSelect(String(item.id));
              }
            }}
          >
            <span className="truncate">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}