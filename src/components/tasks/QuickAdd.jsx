import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { parseTaskInput } from "../utils/parseTaskInput";

export default function QuickAdd() {
  const [title, setTitle] = useState("");
  const [sectionId, setSectionId] = useState(null);
  const [priority, setPriority] = useState(4);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const labels = useAppStore((s) => s.labels);

  const { addTask, currentProjectId, sections } = useAppStore();
  const [dueDate, setDueDate] = useState("");

  const projectSections = sections[currentProjectId] || [];

  const handleAdd = () => {
    if (!title.trim()) return;
    const parsed = parseTaskInput(title);
    addTask(
      parsed.title,
      sectionId || null,
      parsed.dueDate || dueDate || null,
      parsed.priority || priority,
      parsed.labels.length ? parsed.labels : selectedLabels
    );

    setTitle("");
    setPriority(4);
    setSectionId("");
    setDueDate("");
    setSelectedLabels([]);
  };

  return (
    <div className="mb-4 space-y-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task..."
        className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2"
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />

      {projectSections.length > 0 && (
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2 text-sm"
        />

      )}

      <select
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value))}
        className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2 text-sm"
      >
        <option value={1}>🔴 Priority 1</option>
        <option value={2}>🟠 Priority 2</option>
        <option value={3}>🔵 Priority 3</option>
        <option value={4}>⚪ Priority 4</option>
      </select>

      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <button
            key={label.id}
            type="button"
            onClick={() =>
              setSelectedLabels((prev) =>
                prev.includes(label.id)
                  ? prev.filter((l) => l !== label.id)
                  : [...prev, label.id]
              )
            }
            className={`px-2 py-1 text-xs rounded-full border
        ${selectedLabels.includes(label.id)
                ? "bg-gray-700 border-gray-500"
                : "border-gray-700"
              }`}
          >
            #{label.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleAdd}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
      >
        Add Task
      </button>
    </div>
  );
}
