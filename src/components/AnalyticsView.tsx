import { useEffect, useState, useMemo } from "react";
import { loadMeetingHistory } from "@/lib/meetingData";
import type { MeetingData } from "@/lib/meetingData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

interface MeetingRecord {
  id: string;
  meeting_date: string;
  rating: number | null;
  data: any;
}

export default function AnalyticsView() {
  const [history, setHistory] = useState<MeetingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetingHistory()
      .then((data) => setHistory((data as MeetingRecord[]).reverse()))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (history.length < 2) return null;

    const ratings = history.map((m) => m.rating || 0);
    const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);

    const scorecardOnTrack = history.map((m) => {
      const d = m.data as MeetingData;
      const on = d?.scorecard?.filter((s) => s.status === "On Track").length || 0;
      const total = d?.scorecard?.length || 12;
      return Math.round((on / total) * 100);
    });

    const rocksOnTrack = history.map((m) => {
      const d = m.data as MeetingData;
      const on = d?.rocks?.filter((r) => r.status === "OT").length || 0;
      const total = d?.rocks?.length || 6;
      return Math.round((on / total) * 100);
    });

    const todoCompletion = history.map((m) => {
      const d = m.data as MeetingData;
      const done = d?.priorTodos?.filter((t) => t.done).length || 0;
      const total = d?.priorTodos?.filter((t) => t.text).length || 1;
      return Math.round((done / total) * 100);
    });

    return {
      avgRating,
      avgScorecard: Math.round(scorecardOnTrack.reduce((a, b) => a + b, 0) / scorecardOnTrack.length),
      avgRocks: Math.round(rocksOnTrack.reduce((a, b) => a + b, 0) / rocksOnTrack.length),
      avgTodo: Math.round(todoCompletion.reduce((a, b) => a + b, 0) / todoCompletion.length),
      labels: history.map((m) => m.meeting_date),
      ratings,
      scorecardOnTrack,
      scorecardOffTrack: scorecardOnTrack.map((v) => 100 - v),
      rocksOnTrack,
      todoCompletion,
    };
  }, [history]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted-foreground font-body">Loading analytics…</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">Not Enough Data</h2>
          <p className="text-muted-foreground font-body">
            Analytics unlock after 2 saved meetings.
          </p>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "hsl(220, 20%, 90%)" } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in space-y-6">
      <h2 className="text-2xl font-heading font-bold text-foreground">Analytics</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Rating", value: `${stats.avgRating}/10` },
          { label: "Scorecard On-Track", value: `${stats.avgScorecard}%` },
          { label: "Rocks On-Track", value: `${stats.avgRocks}%` },
          { label: "To-Do Completion", value: `${stats.avgTodo}%` },
        ].map((stat) => (
          <div key={stat.label} className="section-card text-center">
            <div className="text-2xl font-heading font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="section-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Meeting Rating Trend</h3>
          <div className="h-48">
            <Line
              data={{
                labels: stats.labels,
                datasets: [
                  {
                    data: stats.ratings,
                    borderColor: "hsl(33, 75%, 47%)",
                    backgroundColor: "hsl(33, 75%, 47%, 0.1)",
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="section-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">To-Do Completion %</h3>
          <div className="h-48">
            <Line
              data={{
                labels: stats.labels,
                datasets: [
                  {
                    data: stats.todoCompletion,
                    borderColor: "hsl(142, 71%, 45%)",
                    backgroundColor: "hsl(142, 71%, 45%, 0.1)",
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="section-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Scorecard On/Off Track</h3>
          <div className="h-48">
            <Bar
              data={{
                labels: stats.labels,
                datasets: [
                  {
                    label: "On Track",
                    data: stats.scorecardOnTrack,
                    backgroundColor: "hsl(142, 71%, 45%)",
                  },
                  {
                    label: "Off Track",
                    data: stats.scorecardOffTrack,
                    backgroundColor: "hsl(0, 72%, 51%)",
                  },
                ],
              }}
              options={{
                ...chartOptions,
                plugins: { legend: { display: true, position: "top" as const } },
                scales: { ...chartOptions.scales, x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
              }}
            />
          </div>
        </div>

        <div className="section-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Rocks On-Track %</h3>
          <div className="h-48">
            <Line
              data={{
                labels: stats.labels,
                datasets: [
                  {
                    data: stats.rocksOnTrack,
                    borderColor: "hsl(33, 75%, 47%)",
                    backgroundColor: "hsl(33, 75%, 47%, 0.1)",
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      {/* Scorecard trend table */}
      <div className="section-card overflow-x-auto">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Scorecard Metric Trends (Last 8 Weeks)</h3>
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 text-muted-foreground">Metric</th>
              {stats.labels.slice(-8).map((l) => (
                <th key={l} className="text-center py-2 px-2 text-muted-foreground text-xs">{l}</th>
              ))}
              <th className="text-center py-2 px-2 text-muted-foreground">Trend</th>
            </tr>
          </thead>
          <tbody>
            {history[0] &&
              (history[0].data as MeetingData)?.scorecard?.map((metric, mi) => {
                const last8 = history.slice(-8);
                const values = last8.map((m) => {
                  const d = m.data as MeetingData;
                  return d?.scorecard?.[mi]?.actual || "—";
                });
                const nums = values.map(Number).filter((n) => !isNaN(n));
                let trend = "Flat";
                if (nums.length >= 2) {
                  const diff = nums[nums.length - 1] - nums[0];
                  if (diff > 0) trend = "Up";
                  else if (diff < 0) trend = "Down";
                }

                return (
                  <tr key={mi} className="border-b border-border/50">
                    <td className="py-2 px-2 font-medium text-foreground">{metric.metric}</td>
                    {values.map((v, vi) => (
                      <td key={vi} className="text-center py-2 px-2 text-foreground">{v}</td>
                    ))}
                    <td className="text-center py-2 px-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          trend === "Up"
                            ? "bg-success/20 text-success"
                            : trend === "Down"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {trend === "Up" ? "↑" : trend === "Down" ? "↓" : "→"} {trend}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
