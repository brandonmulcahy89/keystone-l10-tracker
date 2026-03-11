import { MeetingData, ROLES } from "@/lib/meetingData";

interface Props {
  data: MeetingData;
  updateData: (fn: (d: MeetingData) => MeetingData) => void;
}

export default function RockReviewSection({ data, updateData }: Props) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">Rock Review</h2>
        <span className="pill-badge">15 min</span>
      </div>

      <div className="space-y-3">
        {data.rocks.map((rock, i) => (
          <div
            key={i}
            className={`section-card flex flex-col sm:flex-row items-start sm:items-center gap-3 border-l-4 ${
              rock.status === "OT" ? "border-l-success" : "border-l-destructive"
            }`}
          >
            <div className="flex-shrink-0 w-36 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {rock.role}
            </div>
            <input
              type="text"
              placeholder="Rock description"
              value={rock.description}
              onChange={(e) =>
                updateData((d) => {
                  const rocks = [...d.rocks];
                  rocks[i] = { ...rocks[i], description: e.target.value };
                  return { ...d, rocks };
                })
              }
              className="flex-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
            />
            <input
              type="date"
              value={rock.dueDate}
              onChange={(e) =>
                updateData((d) => {
                  const rocks = [...d.rocks];
                  rocks[i] = { ...rocks[i], dueDate: e.target.value };
                  return { ...d, rocks };
                })
              }
              className="rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
            />
            <div className="flex gap-1">
              <button
                onClick={() =>
                  updateData((d) => {
                    const rocks = [...d.rocks];
                    rocks[i] = { ...rocks[i], status: "OT" };
                    return { ...d, rocks };
                  })
                }
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  rock.status === "OT"
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                OT
              </button>
              <button
                onClick={() =>
                  updateData((d) => {
                    const rocks = [...d.rocks];
                    rocks[i] = { ...rocks[i], status: "OFT" };
                    return { ...d, rocks };
                  })
                }
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  rock.status === "OFT"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                OFT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
