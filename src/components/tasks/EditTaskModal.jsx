import { useAppStore } from "../../store/useAppStore";
import { useState, useEffect } from "react";
import SubtasksSection from "./SubtasksSection";
import CommentsSection from "./CommentsSection";

export default function EditTaskModal() {
    const { tasks, selectedTaskId, clearSelectedTask, updateTask, setReminder } = useAppStore();

    const task = tasks.find((t) => t.id === selectedTaskId);

    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState(4);
    const allActivities = useAppStore((s) => s.activities);

    const activities = task
        ? allActivities.filter((a) => a.taskId === task.id)
        : [];
    useEffect(() => {
        if (!task) return;

        setTitle(task.title);
        setDueDate(task.dueDate || "");
        setPriority(task.priority || 4);

        // ONLY run when selected task changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTaskId]);

    if (!task) return null;

    function handleSave() {
        updateTask(task.id, { title, dueDate, priority });
        clearSelectedTask();
    }

    return (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1e1e1e] w-96 p-5 rounded-xl border border-gray-300 dark:border-gray-700 shadow-xl">

        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Edit Task
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-3 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full mb-3 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
        />

        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
          Reminder
        </label>

        <input
          type="datetime-local"
          value={task.reminder || ""}
          onChange={(e) => setReminder(task.id, e.target.value)}
          className="w-full mb-3 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="w-full mb-4 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
        >
          <option value={1}>🔴 P1</option>
          <option value={2}>🟠 P2</option>
          <option value={3}>🔵 P3</option>
          <option value={4}>⚪ P4</option>
        </select>

        <SubtasksSection taskId={task.id} />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={clearSelectedTask}
            className="cursor-pointer px-3 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>

        <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-3 max-h-40 overflow-y-auto">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Activity
          </h3>

          {activities.length === 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              No activity yet
            </div>
          )}

          {activities.map((a) => (
            <div
              key={a.id}
              className="text-xs text-gray-700 dark:text-gray-300 mb-1"
            >
              • {a.message}
              <span className="text-gray-500 ml-2">
                {new Date(a.time).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <CommentsSection taskId={task.id} />
      </div>
    </div>
    );
}
