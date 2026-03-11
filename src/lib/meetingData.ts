import { supabase } from "@/integrations/supabase/client";

export const ROLES = [
  "Sales Manager",
  "Design Engineer",
  "Finish Room Manager",
  "Shop Foreman",
  "Production Manager",
  "Install Manager",
] as const;

export type Role = typeof ROLES[number];

export interface Attendee {
  role: Role;
  name: string;
  present: boolean;
}

export interface ScorecardMetric {
  metric: string;
  owner: string;
  goal: string;
  actual: string;
  status: "On Track" | "Off Track" | "N/A";
  notes: string;
}

export interface Rock {
  role: Role;
  description: string;
  dueDate: string;
  status: "OT" | "OFT";
}

export interface TodoItem {
  text: string;
  owner: string;
  due: string;
  done?: boolean;
}

export interface IssueItem {
  description: string;
  raisedBy: string;
  resolution: "To-Do" | "Rock" | "Drop" | "";
}

export interface MeetingData {
  attendees: Attendee[];
  meetingDate: string;
  facilitator: string;
  notetaker: string;
  segue: Record<string, string>;
  scorecard: ScorecardMetric[];
  rocks: Rock[];
  headlinesCustomer: string[];
  headlinesEmployee: string[];
  priorTodos: TodoItem[];
  newTodos: TodoItem[];
  issues: IssueItem[];
  departmentQuestions: Record<string, string[]>;
  rating: number | null;
  cascadeMessages: string[];
}

export const DEFAULT_SCORECARD: ScorecardMetric[] = [
  { metric: "New Leads / Quotes Sent", owner: "Sales", goal: "", actual: "", status: "N/A", notes: "" },
  { metric: "Closed Sales / Revenue ($)", owner: "Sales", goal: "", actual: "", status: "N/A", notes: "" },
  { metric: "Design Drawings Completed", owner: "Design", goal: "", actual: "", status: "N/A", notes: "" },
  { metric: "Design Revisions / Errors", owner: "Design", goal: "", actual: "", status: "N/A", notes: "" },
  { metric: "Finish Room Units Completed", owner: "Finish Rm", goal: "", actual: "", status: "N/A", notes: "" },
  { metric: "Rework / Defect Rate (%)", owner: "Finish Rm", goal: "", actual: "", status: "N/A", notes: "" },
  { metric: "Shop Units Produced", owner: "Shop", goal: "", actual: "", status: "N/A", notes: "" },
  { metric: "On-Time Production (%)", owner: "Shop", goal: "", actual: "", status: "N/A", notes: "" },
  { metric: "Jobs in Production Queue", owner: "Production", goal: "", actual: "", status: "N/A", notes: "" },
  { metric: "Schedule Adherence (%)", owner: "Production", goal: "", actual: "", status: "N/A", notes: "" },
  { metric: "Installs Completed", owner: "Install", goal: "", actual: "", status: "N/A", notes: "" },
  { metric: "Punch List / Callbacks", owner: "Install", goal: "", actual: "", status: "N/A", notes: "" },
];

export const DEPARTMENT_QUESTIONS: Record<string, string[]> = {
  "Sales Manager": [
    "How does our pipeline look — are we on track for monthly revenue?",
    "What's our close rate, and are any deals at risk of going cold?",
    "What customer objections are you hearing most in the field?",
    "What marketing or lead generation needs more support right now?",
    "Are there upsell or add-on opportunities we're leaving on the table?",
    "Do you have everything you need from design, production, or install to close deals?",
    "Any customers waiting on follow-up that could affect our reputation?",
  ],
  "Design Engineer": [
    "How many active projects in queue — any running behind schedule?",
    "Are you getting complete info from sales when jobs are turned over?",
    "Any recurring errors, change orders, or miscommunications to address?",
    "Do you have the software and tools you need to work efficiently?",
    "Any specs or customer requirements that are difficult to execute?",
    "Are design handoffs to the shop minimizing rework and confusion?",
    "What templates or improvements could save time across multiple projects?",
  ],
  "Finish Room Manager": [
    "How many units came through this week — were we on schedule?",
    "What is our defect/rework rate and what are the main causes?",
    "Any issues with materials, coatings, equipment, or capacity?",
    "Are handoffs from the shop clean, or are units arriving not ready?",
    "Any safety or ventilation concerns that need to be addressed?",
    "Are quality control checks being followed consistently?",
    "What would allow your team to finish more units at the same quality?",
  ],
  "Shop Foreman": [
    "Are we meeting production targets — what's the status of active jobs?",
    "Any bottlenecks — equipment issues, material shortages, or staffing gaps?",
    "How is team morale? Any issues with attendance or attitude?",
    "Are job packets and materials arriving complete and on time?",
    "Any recurring quality issues at specific stages of production?",
    "Is the shop floor organized? Any lean/5S improvements needed?",
    "What would help increase output or reduce errors this week?",
  ],
  "Production Manager": [
    "How does the production schedule look — all jobs properly sequenced and on time?",
    "Any jobs at risk of missing their ship or install dates?",
    "Are materials being ordered and arriving on time, or vendor delays?",
    "How is capacity over the next 2–4 weeks — properly loaded?",
    "Any coordination issues between design, shop, finish room, and install?",
    "What is the current WIP count — any jobs stalled?",
    "What scheduling or communication improvements would help most right now?",
  ],
  "Install Manager": [
    "How many installs are scheduled this week and next — are we on track?",
    "Any issues, damages, or delays on recent installs to resolve?",
    "What is our callback/punch list rate — are items closing quickly?",
    "Are crews getting complete info and materials before arriving on site?",
    "Are customers satisfied with the installation experience?",
    "Any site-condition challenges causing problems (access, dimensions)?",
    "What would help your team install faster with fewer callbacks?",
  ],
};

export function createDefaultMeetingData(): MeetingData {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  return {
    attendees: ROLES.map((role) => ({ role, name: "", present: false })),
    meetingDate: today.toISOString().split("T")[0],
    facilitator: "",
    notetaker: "",
    segue: Object.fromEntries(ROLES.map((r) => [r, ""])),
    scorecard: DEFAULT_SCORECARD.map((m) => ({ ...m })),
    rocks: ROLES.map((role) => ({ role, description: "", dueDate: "", status: "OT" as const })),
    headlinesCustomer: ["", "", "", ""],
    headlinesEmployee: ["", "", "", ""],
    priorTodos: Array.from({ length: 7 }, () => ({ text: "", owner: "", due: "", done: false })),
    newTodos: Array.from({ length: 7 }, () => ({ text: "", owner: "", due: "" })),
    issues: Array.from({ length: 6 }, () => ({ description: "", raisedBy: "", resolution: "" as const })),
    departmentQuestions: Object.fromEntries(
      ROLES.map((role) => [role, Array(7).fill("")])
    ),
    rating: null,
    cascadeMessages: ["", "", "", ""],
  };
}

export type SyncStatus = "synced" | "saving" | "error";

export async function loadActiveMeeting() {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function saveMeeting(id: string, meetingData: MeetingData) {
  const { error } = await supabase
    .from("meetings")
    .update({
      data: meetingData as any,
      meeting_date: meetingData.meetingDate,
      rating: meetingData.rating,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function createMeeting(meetingData: MeetingData) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const { data, error } = await supabase
    .from("meetings")
    .insert({
      data: meetingData as any,
      meeting_date: meetingData.meetingDate,
      week_start: monday.toISOString().split("T")[0],
      week_end: friday.toISOString().split("T")[0],
      status: "active",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function lockMeeting(id: string, meetingData: MeetingData) {
  const { error } = await supabase
    .from("meetings")
    .update({
      status: "locked",
      data: meetingData as any,
      rating: meetingData.rating,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function loadMeetingHistory() {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("status", "locked")
    .order("meeting_date", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function loadMeetingById(id: string) {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
