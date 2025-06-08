import * as React from "react";

interface QuizSettingsProps {
  autoNext: boolean;
  setAutoNext: (v: boolean) => void;
}

// Custom checkbox styles for consistent look
export function QuizSettings({ autoNext, setAutoNext }: QuizSettingsProps) {
  return (
    <div className="flex items-center">
      <label className="inline-flex items-center cursor-pointer">
        <input
          id="auto-next"
          type="checkbox"
          checked={autoNext}
          onChange={e => setAutoNext(e.target.checked)}
          className="peer appearance-none w-4 h-4 border-2 border-border rounded transition 
            checked:bg-primary checked:border-primary checked:after:block
            after:hidden after:content-[''] after:w-2 after:h-1 after:border-b-2 after:border-l-2 after:border-white after:absolute after:top-0.5 after:left-1 after:rotate-[-45deg]
            relative
            bg-surface
            focus:ring-2 focus:ring-primary/30"
        />
        {/* Custom checkmark */}
        <span className="absolute w-4 h-4 pointer-events-none"></span>
        <span className="ml-2 text-sm text-text-high">Auto Next</span>
      </label>
    </div>
  );
}