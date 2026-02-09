import { useAppStore } from "../../store/useAppStore";
import { getDueDateStatus } from "../utils/dateUtils";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function TaskItem({ task }) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const setSelectedTask = useAppStore((s) => s.setSelectedTask);

const totalSubtasks = task.subtasks?.length || 0;
const completedSubtasks =
  task.subtasks?.filter((s) => s.completed).length || 0;

const progress =
  totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

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

  const recurrenceTextMap = {
    daily: "every day",
    weekly: "every week",
    monthly: "every month",
    monday: "every Monday",
    tuesday: "every Tuesday",
    wednesday: "every Wednesday",
    thursday: "every Thursday",
    friday: "every Friday",
    saturday: "every Saturday",
    sunday: "every Sunday",
  };
  return (
    <div 
 className={`cursor-pointer flex items-center gap-3 py-3 border-b border-gray-800 group hover:bg-gray-200 dark:hover:bg-gray-600 px-2 rounded transition ${isOverdue ? "border-l-2 border-red-500 pl-2" : ""}`}>
      
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
      onClick={() => setSelectedTask(task.id)}
        className={`flex-1 ${task.completed ? "line-through text-gray-500" : ""
          }`}
      >
        {task.title}
      </span>

      {totalSubtasks > 0 && (
  <div className="mt-1">
    <div className="w-full h-1.5 bg-gray-700 rounded">
      <div
        className="h-1.5 bg-green-500 rounded transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
    <div className="text-[10px] text-gray-400 mt-0.5">
      {completedSubtasks}/{totalSubtasks} subtasks
    </div>
  </div>
)}

       {/* {task.recurrence && (
    <ArrowPathIcon
      className="w-4 h-4 text-gray-400"
      title={`Repeats ${task.recurrence}`}
    />
  )} */}
  
      {task.recurrence && (
        <ArrowPathIcon
          className="w-4 h-4 text-gray-400"
          title={`Repeats ${recurrenceTextMap[task.recurrence]}`}
        />
      )}
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
              className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-700 dark:text-gray-300"
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
        className="
          text-xs px-2 py-0.5 rounded-full cursor-pointer transition
          bg-gray-200 text-gray-800 hover:bg-gray-300
          dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
        "
      >
        #{label.name}
      </span>
    ))}
  </div>
)}
    </div>
  );
}
