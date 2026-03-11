import { useState } from "react";
import { MeetingData, ROLES, DEPARTMENT_QUESTIONS } from "@/lib/meetingData";

interface Props {
  data: MeetingData;
  updateData: (fn: (d: MeetingData) => MeetingData) => void;
}

export default function DeptQuestionsSection({ data, updateData }: Props) {
  const [activeRole, setActiveRole] = useState<string>(ROLES[0]);

  const questions = DEPARTMENT_QUESTIONS[activeRole] || [];
  const answers = data.departmentQuestions[activeRole] || Array(7).fill("");

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">Department Questions</h2>

      <div className="flex flex-wrap gap-2">
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeRole === role
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={`${activeRole}-${i}`} className="section-card">
            <p className="text-sm font-medium text-foreground mb-2">{q}</p>
            <textarea
              rows={2}
              placeholder="Notes..."
              value={answers[i] || ""}
              onChange={(e) =>
                updateData((d) => {
                  const dq = { ...d.departmentQuestions };
                  const arr = [...(dq[activeRole] || Array(7).fill(""))];
                  arr[i] = e.target.value;
                  dq[activeRole] = arr;
                  return { ...d, departmentQuestions: dq };
                })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
