import { MeetingData } from "@/lib/meetingData";

interface Props {
  data: MeetingData;
  updateData: (fn: (d: MeetingData) => MeetingData) => void;
}

export default function ScorecardSection({ data, updateData }: Props) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">Scorecard</h2>
        <span className="pill-badge">15 min</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 text-muted-foreground font-medium">Metric</th>
              <th className="text-left py-2 px-2 text-muted-foreground font-medium">Owner</th>
              <th className="text-left py-2 px-2 text-muted-foreground font-medium">Goal</th>
              <th className="text-left py-2 px-2 text-muted-foreground font-medium">Actual</th>
              <th className="text-left py-2 px-2 text-muted-foreground font-medium">Status</th>
              <th className="text-left py-2 px-2 text-muted-foreground font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.scorecard.map((metric, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-2 px-2 font-medium text-foreground">{metric.metric}</td>
                <td className="py-2 px-2 text-muted-foreground">{metric.owner}</td>
                <td className="py-2 px-2">
                  <input
                    type="text"
                    value={metric.goal}
                    onChange={(e) =>
                      updateData((d) => {
                        const sc = [...d.scorecard];
                        sc[i] = { ...sc[i], goal: e.target.value };
                        return { ...d, scorecard: sc };
                      })
                    }
                    className="w-20 rounded border border-input bg-background px-2 py-1 text-sm"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="text"
                    value={metric.actual}
                    onChange={(e) =>
                      updateData((d) => {
                        const sc = [...d.scorecard];
                        sc[i] = { ...sc[i], actual: e.target.value };
                        return { ...d, scorecard: sc };
                      })
                    }
                    className="w-20 rounded border border-input bg-background px-2 py-1 text-sm"
                  />
                </td>
                <td className="py-2 px-2">
                  <select
                    value={metric.status}
                    onChange={(e) =>
                      updateData((d) => {
                        const sc = [...d.scorecard];
                        sc[i] = { ...sc[i], status: e.target.value as any };
                        return { ...d, scorecard: sc };
                      })
                    }
                    className={`rounded border border-input px-2 py-1 text-xs font-medium ${
                      metric.status === "On Track"
                        ? "bg-success/20 text-success"
                        : metric.status === "Off Track"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <option value="N/A">N/A</option>
                    <option value="On Track">On Track</option>
                    <option value="Off Track">Off Track</option>
                  </select>
                </td>
                <td className="py-2 px-2">
                  <input
                    type="text"
                    value={metric.notes}
                    placeholder="Notes"
                    onChange={(e) =>
                      updateData((d) => {
                        const sc = [...d.scorecard];
                        sc[i] = { ...sc[i], notes: e.target.value };
                        return { ...d, scorecard: sc };
                      })
                    }
                    className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
