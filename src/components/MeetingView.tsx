import { useState } from "react";
import { MeetingData } from "@/lib/meetingData";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import AttendeesSection from "@/components/sections/AttendeesSection";
import SegueSection from "@/components/sections/SegueSection";
import ScorecardSection from "@/components/sections/ScorecardSection";
import RockReviewSection from "@/components/sections/RockReviewSection";
import HeadlinesSection from "@/components/sections/HeadlinesSection";
import TodoSection from "@/components/sections/TodoSection";
import IDSSection from "@/components/sections/IDSSection";
import DeptQuestionsSection from "@/components/sections/DeptQuestionsSection";
import ConcludeSection from "@/components/sections/ConcludeSection";
import { SyncStatus } from "@/lib/meetingData";

interface Props {
  data: MeetingData;
  updateData: (fn: (d: MeetingData) => MeetingData) => void;
  syncStatus: SyncStatus;
  onLock: () => void;
}

export default function MeetingView({ data, updateData, syncStatus, onLock }: Props) {
  const [section, setSection] = useState(0);

  const sections = [
    <AttendeesSection key={0} data={data} updateData={updateData} />,
    <SegueSection key={1} data={data} updateData={updateData} />,
    <ScorecardSection key={2} data={data} updateData={updateData} />,
    <RockReviewSection key={3} data={data} updateData={updateData} />,
    <HeadlinesSection key={4} data={data} updateData={updateData} />,
    <TodoSection key={5} data={data} updateData={updateData} />,
    <IDSSection key={6} data={data} updateData={updateData} />,
    <DeptQuestionsSection key={7} data={data} updateData={updateData} />,
    <ConcludeSection key={8} data={data} updateData={updateData} onLock={onLock} />,
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)]">
      {/* Section tab pills */}
      <div className="overflow-x-auto border-b border-border bg-card">
        <div className="flex gap-1 px-4 py-2">
          {[
            "Attendees",
            "Segue",
            "Scorecard",
            "Rocks",
            "Headlines",
            "To-Dos",
            "IDS™",
            "Dept Q's",
            "Conclude",
          ].map((name, i) => (
            <button
              key={i}
              onClick={() => setSection(i)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                section === i
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6">{sections[section]}</div>

      <BottomNav
        currentSection={section}
        onBack={() => setSection((s) => Math.max(0, s - 1))}
        onNext={() => setSection((s) => Math.min(8, s + 1))}
      />
    </div>
  );
}
