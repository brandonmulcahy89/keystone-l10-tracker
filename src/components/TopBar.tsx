import { SyncStatus } from "@/lib/meetingData";

interface TopBarProps {
  syncStatus: SyncStatus;
  activeView: string;
  onViewChange: (view: string) => void;
}

const views = ["Meeting", "History", "Analytics"];

export default function TopBar({ syncStatus, activeView, onViewChange }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-primary">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-heading font-bold text-primary-foreground">
            Keystone Kitchens
          </h1>
          <span className="pill-badge">L10 Tracker</span>
        </div>

        <nav className="hidden sm:flex items-center gap-1 rounded-lg bg-navy-light p-1">
          {views.map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeView === v
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div
            className={
              syncStatus === "synced"
                ? "status-synced"
                : syncStatus === "saving"
                ? "status-saving"
                : "status-error"
            }
          />
          <span className="text-xs text-primary-foreground/60 font-body">
            {syncStatus === "synced" ? "Synced" : syncStatus === "saving" ? "Saving…" : "Error"}
          </span>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex border-t border-navy-light">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              activeView === v
                ? "bg-secondary text-secondary-foreground"
                : "text-primary-foreground/70"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </header>
  );
}
