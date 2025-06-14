import * as React from "react";

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-high">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-primary/10 rounded-full transition"
            aria-label="Close"
          >
            <svg width={24} height={24} fill="none" viewBox="0 0 24 24" className="text-text-high">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono text-text-high">1</kbd>
            <span className="text-text-high">Select option A</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono text-text-high">2</kbd>
            <span className="text-text-high">Select option B</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono text-text-high">3</kbd>
            <span className="text-text-high">Select option C</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono text-text-high">4</kbd>
            <span className="text-text-high">Select option D</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono text-text-high">←</kbd>
            <span className="text-text-high">Previous question</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono text-text-high">→</kbd>
            <span className="text-text-high">Next question</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono text-text-high">Enter</kbd>
            <span className="text-text-high">Submit quiz (when all questions are answered)</span>
          </div>
        </div>
      </div>
    </div>
  );
} 