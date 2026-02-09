import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function AddTaskModal() {
  const isOpen = useAppStore((s) => s.isAddTaskOpen);
  const close = useAppStore((s) => s.closeAddTask);
  const addTask = useAppStore((s) => s.addTask); // 👈 GET ACTION

  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;

    addTask(title);   // 👈 CALL YOUR STORE FUNCTION
    setTitle("");
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1f1f1f] w-full max-w-md rounded-xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Add New Task</h2>

        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] mb-4 outline-none"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={close}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
