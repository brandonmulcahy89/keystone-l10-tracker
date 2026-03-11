import { MeetingData } from "@/lib/meetingData";

interface Props {
  data: MeetingData;
  updateData: (fn: (d: MeetingData) => MeetingData) => void;
}

export default function IDSSection({ data, updateData }: Props) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">IDS™ — Identify, Discuss, Solve</h2>
        <span className="pill-badge">30 min</span>
      </div>

      <div className="space-y-3">
        {data.issues.map((issue, i) => (
          <div key={i} className="section-card flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground w-6">{i + 1}.</span>
            <input
              type="text"
              placeholder="Issue description"
              value={issue.description}
              onChange={(e) =>
                updateData((d) => {
                  const arr = [...d.issues];
                  arr[i] = { ...arr[i], description: e.target.value };
                  return { ...d, issues: arr };
                })
              }
              className="flex-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
            />
            <input
              type="text"
              placeholder="Raised by"
              value={issue.raisedBy}
              onChange={(e) =>
                updateData((d) => {
                  const arr = [...d.issues];
                  arr[i] = { ...arr[i], raisedBy: e.target.value };
                  return { ...d, issues: arr };
                })
              }
              className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
            />
            <select
              value={issue.resolution}
              onChange={(e) =>
                updateData((d) => {
                  const arr = [...d.issues];
                  arr[i] = { ...arr[i], resolution: e.target.value as any };
                  return { ...d, issues: arr };
                })
              }
              className="rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
            >
              <option value="">Resolution…</option>
              <option value="To-Do">To-Do</option>
              <option value="Rock">Rock</option>
              <option value="Drop">Drop</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
