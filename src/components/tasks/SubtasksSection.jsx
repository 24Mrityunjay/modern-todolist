import { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function SubtasksSection({ taskId }) {
  const [newSubtask, setNewSubtask] = useState("");
  const [open, setOpen] = useState(true);

  const task = useAppStore((s) => s.tasks.find((t) => t.id === taskId));
  const addSubtask = useAppStore((s) => s.addSubtask);
  const toggleSubtask = useAppStore((s) => s.toggleSubtask);
  const deleteSubtask = useAppStore((s) => s.deleteSubtask);
  const toggleTask = useAppStore((s) => s.toggleTask);

  useEffect(() => {
    if (!task?.subtasks?.length) return;

    const allDone = task.subtasks.every((s) => s.completed);
    if (allDone && !task.completed) {
      toggleTask(task.id);
    }
  }, [task?.subtasks]); // safe dependency

  if (!task) return null;

  return (
    <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 hover:text-gray-700 dark:hover:text-gray-200"
      >
        <span>
          {open ? "▼" : "▶"} Subtasks ({task.subtasks?.length || 0})
        </span>
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 mb-2">
          {(task.subtasks || []).map((s) => (
            <div key={s.id} className="flex items-center gap-2 group">
              <input
                type="checkbox"
                checked={s.completed}
                onChange={() => toggleSubtask(task.id, s.id)}
                className="w-4 h-4 accent-gray-600 dark:accent-gray-400"
              />

              <span
                className={`flex-1 text-sm ${
                  s.completed
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {s.title}
              </span>

              <button
                onClick={() => deleteSubtask(task.id, s.id)}
                className="text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <input
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newSubtask.trim()) {
              addSubtask(task.id, newSubtask.trim());
              setNewSubtask("");
            }
          }}
          placeholder="Add subtask..."
          className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
        />
      </div>
    </div>
  );
}
