import { useState } from "react";
import TopBar from "@/components/TopBar";
import MeetingView from "@/components/MeetingView";
import HistoryView from "@/components/HistoryView";
import AnalyticsView from "@/components/AnalyticsView";
import { useMeeting } from "@/hooks/useMeeting";

const Index = () => {
  const [activeView, setActiveView] = useState("Meeting");
  const { data, updateData, syncStatus, loading, handleLock } = useMeeting();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-body">Loading meeting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar syncStatus={syncStatus} activeView={activeView} onViewChange={setActiveView} />

      {activeView === "Meeting" && (
        <MeetingView data={data} updateData={updateData} syncStatus={syncStatus} onLock={handleLock} />
      )}
      {activeView === "History" && <HistoryView onLoadMeeting={() => {}} />}
      {activeView === "Analytics" && <AnalyticsView />}
    </div>
  );
};

export default Index;
