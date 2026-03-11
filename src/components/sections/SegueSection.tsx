import { MeetingData, ROLES } from "@/lib/meetingData";

interface Props {
  data: MeetingData;
  updateData: (fn: (d: MeetingData) => MeetingData) => void;
}

export default function SegueSection({ data, updateData }: Props) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">Segue / Good News</h2>
        <span className="pill-badge">5 min</span>
      </div>
      <p className="text-sm text-muted-foreground">Share personal or professional wins.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROLES.map((role) => (
          <div key={role} className="section-card">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {role}
            </label>
            <textarea
              rows={3}
              placeholder="Good news..."
              value={data.segue[role] || ""}
              onChange={(e) =>
                updateData((d) => ({
                  ...d,
                  segue: { ...d.segue, [role]: e.target.value },
                }))
              }
              className="w-full mt-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-body resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
