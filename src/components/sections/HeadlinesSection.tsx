import { MeetingData } from "@/lib/meetingData";

interface Props {
  data: MeetingData;
  updateData: (fn: (d: MeetingData) => MeetingData) => void;
}

export default function HeadlinesSection({ data, updateData }: Props) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">Headlines</h2>
        <span className="pill-badge">5 min</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-heading font-bold text-foreground">Customer Headlines</h3>
          {data.headlinesCustomer.map((h, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Customer headline ${i + 1}`}
              value={h}
              onChange={(e) =>
                updateData((d) => {
                  const arr = [...d.headlinesCustomer];
                  arr[i] = e.target.value;
                  return { ...d, headlinesCustomer: arr };
                })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
            />
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-heading font-bold text-foreground">Employee Headlines</h3>
          {data.headlinesEmployee.map((h, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Employee headline ${i + 1}`}
              value={h}
              onChange={(e) =>
                updateData((d) => {
                  const arr = [...d.headlinesEmployee];
                  arr[i] = e.target.value;
                  return { ...d, headlinesEmployee: arr };
                })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
