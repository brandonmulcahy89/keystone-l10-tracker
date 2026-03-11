import { MeetingData, ROLES } from "@/lib/meetingData";

interface Props {
  data: MeetingData;
  updateData: (fn: (d: MeetingData) => MeetingData) => void;
}

export default function AttendeesSection({ data, updateData }: Props) {
  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">Attendees</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.attendees.map((att, i) => (
          <div key={att.role} className="section-card flex flex-col gap-3">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {att.role}
            </div>
            <input
              type="text"
              placeholder="Name"
              value={att.name}
              onChange={(e) =>
                updateData((d) => {
                  const next = { ...d, attendees: [...d.attendees] };
                  next.attendees[i] = { ...next.attendees[i], name: e.target.value };
                  return next;
                })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  att.present ? "bg-success" : "bg-muted"
                }`}
                onClick={() =>
                  updateData((d) => {
                    const next = { ...d, attendees: [...d.attendees] };
                    next.attendees[i] = { ...next.attendees[i], present: !att.present };
                    return next;
                  })
                }
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${
                    att.present ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
              <span className="text-sm font-body text-foreground">
                {att.present ? "Present" : "Absent"}
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="section-card">
          <label className="text-sm font-medium text-muted-foreground">Meeting Date</label>
          <input
            type="date"
            value={data.meetingDate}
            onChange={(e) => updateData((d) => ({ ...d, meetingDate: e.target.value }))}
            className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
          />
        </div>
        <div className="section-card">
          <label className="text-sm font-medium text-muted-foreground">Facilitator</label>
          <input
            type="text"
            placeholder="Facilitator name"
            value={data.facilitator}
            onChange={(e) => updateData((d) => ({ ...d, facilitator: e.target.value }))}
            className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
          />
        </div>
        <div className="section-card">
          <label className="text-sm font-medium text-muted-foreground">Notetaker</label>
          <input
            type="text"
            placeholder="Notetaker name"
            value={data.notetaker}
            onChange={(e) => updateData((d) => ({ ...d, notetaker: e.target.value }))}
            className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
          />
        </div>
      </div>
    </div>
  );
}
