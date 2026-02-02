import { useAppStore } from "../../store/useAppStore";
import { getDueDateStatus } from "../utils/dateUtils";

export default function TaskItem({ task }) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const priorityStyles = {
    1: "border-red-500 checked:bg-red-500 checked:border-red-500",
    2: "border-orange-400 checked:bg-orange-500 checked:border-orange-500",
    3: "border-blue-400 checked:bg-blue-500 checked:border-blue-500",
    4: "border-gray-400 checked:bg-gray-500 checked:border-gray-500",
  };
  const labels = useAppStore((s) => s.labels);
const setFilter = useAppStore((s) => s.setFilter);

const taskLabels = labels.filter((l) => task.labels?.includes(l.id));

  const currentTask = useAppStore((s) =>
    s.tasks.find((t) => t.id === task.id)
  );

  const status = getDueDateStatus(task.dueDate);

const dateColors = {
  overdue: "text-red-400",
  today: "text-green-400",
  tomorrow: "text-blue-400",
  future: "text-gray-400",
};
const formattedDate =
  status === "today"
    ? "Today"
    : status === "tomorrow"
    ? "Tomorrow"
    : new Date(task.dueDate).toDateString();

    const isOverdue = getDueDateStatus(task.dueDate) === "overdue";

  return (
    <div className={`flex items-center gap-3 py-3 border-b border-gray-800 group hover:bg-[#1a1a1a] px-2 rounded transition ${isOverdue ? "border-l-2 border-red-500 pl-2" : ""}`}>
      <div className="relative w-5 h-5 shrink-0">

        <input
          type="checkbox"
          checked={currentTask.completed}
          onChange={(e) => {
            e.stopPropagation();   // ⛔ stop drag
            toggleTask(task.id);
          }}
          onPointerDown={(e) => e.stopPropagation()} // ⛔ prevents drag start
          className={`
      peer appearance-none w-5 h-5 rounded-full
      border-2 ${priorityStyles[task.priority]}
      hover:border-gray-300
      cursor-pointer transition-all duration-150
    `}
        />

        <svg
          className="
      absolute inset-0 m-auto w-3 pointer-events-none
      opacity-0
      peer-hover:opacity-100
      peer-checked:opacity-100
      transition-opacity duration-150
      text-white
    "
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <span
        className={`flex-1 ${task.completed ? "line-through text-gray-500" : ""
          }`}
      >
        {task.title}
      </span>
      {task.priority <= 4 && (
        <div className="text-xs text-gray-400">
          Priority {task.priority}
        </div>
      )}
      {task.dueDate && (
        <span className={`text-xs ${dateColors[status]}`}>
          📅 {formattedDate}
        </span>
      )}

      {/* {taskLabels.length > 0 && (
        <div className="flex gap-2 mt-1 flex-wrap">
          {taskLabels.map((label) => (
            <span
              key={label.id}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300"
            >
              #{label.name}
            </span>
          ))}
        </div>
      )} */}

      {taskLabels.length > 0 && (
  <div className="flex gap-2 mt-1 flex-wrap">
    {taskLabels.map((label) => (
      <span
        key={label.id}
        onClick={() => setFilter({ type: "label", value: label.id })}
        className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 cursor-pointer hover:bg-gray-600"
      >
        #{label.name}
      </span>

    ))}
  </div>
)}
    </div>
  );
}
