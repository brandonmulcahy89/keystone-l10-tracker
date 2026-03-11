import { MeetingData } from "@/lib/meetingData";

interface Props {
  data: MeetingData;
  updateData: (fn: (d: MeetingData) => MeetingData) => void;
}

export default function TodoSection({ data, updateData }: Props) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-foreground">To-Do List</h2>
        <span className="pill-badge">10 min</span>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-heading font-bold text-foreground mb-3">Prior Week Review</h3>
          <div className="space-y-2">
            {data.priorTodos.map((todo, i) => (
              <div key={i} className="section-card flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.done || false}
                  onChange={(e) =>
                    updateData((d) => {
                      const arr = [...d.priorTodos];
                      arr[i] = { ...arr[i], done: e.target.checked };
                      return { ...d, priorTodos: arr };
                    })
                  }
                  className="w-4 h-4 rounded accent-secondary"
                />
                <input
                  type="text"
                  placeholder="To-do item"
                  value={todo.text}
                  onChange={(e) =>
                    updateData((d) => {
                      const arr = [...d.priorTodos];
                      arr[i] = { ...arr[i], text: e.target.value };
                      return { ...d, priorTodos: arr };
                    })
                  }
                  className={`flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-body ${
                    todo.done ? "line-through opacity-50" : ""
                  }`}
                />
                <input
                  type="text"
                  placeholder="Owner"
                  value={todo.owner}
                  onChange={(e) =>
                    updateData((d) => {
                      const arr = [...d.priorTodos];
                      arr[i] = { ...arr[i], owner: e.target.value };
                      return { ...d, priorTodos: arr };
                    })
                  }
                  className="w-28 rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
                />
                <input
                  type="date"
                  value={todo.due}
                  onChange={(e) =>
                    updateData((d) => {
                      const arr = [...d.priorTodos];
                      arr[i] = { ...arr[i], due: e.target.value };
                      return { ...d, priorTodos: arr };
                    })
                  }
                  className="rounded-md border border-input bg-background px-2 py-2 text-sm font-body"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-heading font-bold text-foreground mb-3">New To-Dos This Meeting</h3>
          <div className="space-y-2">
            {data.newTodos.map((todo, i) => (
              <div key={i} className="section-card flex items-center gap-3">
                <input
                  type="text"
                  placeholder="New to-do"
                  value={todo.text}
                  onChange={(e) =>
                    updateData((d) => {
                      const arr = [...d.newTodos];
                      arr[i] = { ...arr[i], text: e.target.value };
                      return { ...d, newTodos: arr };
                    })
                  }
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
                />
                <input
                  type="text"
                  placeholder="Owner"
                  value={todo.owner}
                  onChange={(e) =>
                    updateData((d) => {
                      const arr = [...d.newTodos];
                      arr[i] = { ...arr[i], owner: e.target.value };
                      return { ...d, newTodos: arr };
                    })
                  }
                  className="w-28 rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
                />
                <input
                  type="date"
                  value={todo.due}
                  onChange={(e) =>
                    updateData((d) => {
                      const arr = [...d.newTodos];
                      arr[i] = { ...arr[i], due: e.target.value };
                      return { ...d, newTodos: arr };
                    })
                  }
                  className="rounded-md border border-input bg-background px-2 py-2 text-sm font-body"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
