const SECTION_NAMES = [
  "Attendees",
  "Segue",
  "Scorecard",
  "Rock Review",
  "Headlines",
  "To-Do List",
  "IDS™",
  "Dept Questions",
  "Conclude",
];

interface BottomNavProps {
  currentSection: number;
  onBack: () => void;
  onNext: () => void;
}

export default function BottomNav({ currentSection, onBack, onNext }: BottomNavProps) {
  const progress = ((currentSection + 1) / SECTION_NAMES.length) * 100;

  return (
    <div className="sticky bottom-0 z-50 border-t border-border bg-card">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <button
          onClick={onBack}
          disabled={currentSection === 0}
          className="px-4 py-2 text-sm font-medium rounded-md border border-border bg-background text-foreground disabled:opacity-30 transition-colors hover:bg-muted"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-body">
            {currentSection + 1} / {SECTION_NAMES.length}
          </span>
          <span className="text-sm font-medium font-body text-foreground">
            {SECTION_NAMES[currentSection]}
          </span>
        </div>

        <button
          onClick={onNext}
          disabled={currentSection === SECTION_NAMES.length - 1}
          className="px-4 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground disabled:opacity-30 transition-colors hover:opacity-90"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
