import { useEffect, useState } from "react";
import { loadMeetingHistory } from "@/lib/meetingData";
import type { MeetingData } from "@/lib/meetingData";

interface MeetingRecord {
  id: string;
  meeting_date: string;
  week_start: string | null;
  week_end: string | null;
  rating: number | null;
  data: any;
}

interface Props {
  onLoadMeeting: (id: string) => void;
}

export default function HistoryView({ onLoadMeeting }: Props) {
  const [history, setHistory] = useState<MeetingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetingHistory()
      .then((data) => setHistory(data as MeetingRecord[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted-foreground font-body">Loading history…</span>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">No Meetings Yet</h2>
          <p className="text-muted-foreground font-body">
            Complete and save your first meeting to see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Meeting History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((meeting) => {
          const mData = meeting.data as MeetingData;
          const onTrack = mData?.scorecard?.filter((s) => s.status === "On Track").length || 0;
          const total = mData?.scorecard?.length || 12;
          const todosDone = mData?.priorTodos?.filter((t) => t.done).length || 0;
          const todosTotal = mData?.priorTodos?.filter((t) => t.text).length || 1;

          return (
            <button
              key={meeting.id}
              onClick={() => onLoadMeeting(meeting.id)}
              className="section-card text-left hover:border-secondary transition-colors cursor-pointer"
            >
              <div className="text-lg font-heading font-bold text-foreground">
                {meeting.meeting_date}
              </div>
              {meeting.week_start && meeting.week_end && (
                <div className="text-xs text-muted-foreground mt-1">
                  {meeting.week_start} → {meeting.week_end}
                </div>
              )}
              <div className="flex gap-4 mt-3 text-sm font-body">
                <div>
                  <span className="text-muted-foreground">Rating: </span>
                  <span className="font-semibold text-foreground">{meeting.rating || "—"}/10</span>
                </div>
                <div>
                  <span className="text-muted-foreground">On Track: </span>
                  <span className="font-semibold text-foreground">
                    {Math.round((onTrack / total) * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">To-Dos: </span>
                  <span className="font-semibold text-foreground">
                    {Math.round((todosDone / todosTotal) * 100)}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
