import { useState } from "react";
import { MeetingData } from "@/lib/meetingData";

interface Props {
  data: MeetingData;
  updateData: (fn: (d: MeetingData) => MeetingData) => void;
  onLock: () => void;
}

export default function ConcludeSection({ data, updateData, onLock }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const activeTodos = data.newTodos.filter((t) => t.text);

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">Conclude</h2>

      {/* Rating */}
      <div className="section-card">
        <label className="text-sm font-medium text-muted-foreground mb-3 block">
          Meeting Rating (1-10)
        </label>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => updateData((d) => ({ ...d, rating: n }))}
              className={`w-10 h-10 rounded-md text-sm font-bold transition-colors ${
                data.rating === n
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Cascade Messages */}
      <div className="section-card">
        <label className="text-sm font-medium text-muted-foreground mb-3 block">
          Cascade Messages
        </label>
        <div className="space-y-2">
          {data.cascadeMessages.map((msg, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Cascade message ${i + 1}`}
              value={msg}
              onChange={(e) =>
                updateData((d) => {
                  const arr = [...d.cascadeMessages];
                  arr[i] = e.target.value;
                  return { ...d, cascadeMessages: arr };
                })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
            />
          ))}
        </div>
      </div>

      {/* To-Do Summary */}
      {activeTodos.length > 0 && (
        <div className="section-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">New To-Do Summary</h3>
          <ul className="space-y-1">
            {activeTodos.map((t, i) => (
              <li key={i} className="text-sm font-body text-foreground">
                • {t.text} — <span className="text-muted-foreground">{t.owner}</span>{" "}
                {t.due && <span className="text-muted-foreground">({t.due})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowConfirm(true)}
          className="px-6 py-3 rounded-md bg-secondary text-secondary-foreground font-semibold text-sm transition-colors hover:opacity-90"
        >
          Save This Week
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 rounded-md border border-border bg-background text-foreground font-semibold text-sm transition-colors hover:bg-muted"
        >
          Print
        </button>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50">
          <div className="section-card max-w-md w-full mx-4 space-y-4">
            <h3 className="text-lg font-heading font-bold text-foreground">Lock This Meeting?</h3>
            <p className="text-sm text-muted-foreground">
              This will save the meeting to history and start a new week. Incomplete to-dos will roll
              forward.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md border border-border bg-background text-foreground text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  onLock();
                }}
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-semibold"
              >
                Confirm & Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
