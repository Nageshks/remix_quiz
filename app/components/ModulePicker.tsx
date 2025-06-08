import * as React from "react";

type Module = { id: number; name: string };

interface ModulePickerProps {
  modules: Module[];
  selectedModules: string[];
  onToggle: (id: string) => void;
  disabled?: boolean;
}

export function ModulePicker({ modules, selectedModules, onToggle, disabled }: ModulePickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {modules.length === 0 && (
        <div className="text-text-low text-sm">No modules found.</div>
      )}
      {modules.map(mod => {
        const selected = selectedModules.includes(String(mod.id));
        return (
          <button
            key={mod.id}
            type="button"
            disabled={disabled}
            tabIndex={0}
            aria-pressed={selected}
            className={`
              px-4 py-1 rounded-lg border
              flex items-center justify-center transition font-medium
              outline-none
              min-w-[120px] max-w-full
              ${selected
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border bg-surface text-text-high hover:border-primary/50 hover:bg-primary/5"
              }
              ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
              focus:ring-2 focus:ring-primary/40
              select-none
              whitespace-nowrap
            `}
            onClick={() => onToggle(String(mod.id))}
            onKeyDown={e => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                onToggle(String(mod.id));
              }
            }}
          >
            <span className="truncate">{mod.name}</span>
          </button>
        );
      })}
    </div>
  );
}