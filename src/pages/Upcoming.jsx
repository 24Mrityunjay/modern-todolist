// import { useAppStore } from "../store/useAppStore";
// import TaskItem from "../components/tasks/TaskItem";
// import { format, isToday, isTomorrow, parseISO } from "date-fns";

// export default function Upcoming() {
//   const tasks = useAppStore((s) => s.tasks);

//   // Only tasks with due dates & not completed
//   const upcomingTasks = tasks
//     .filter((t) => t.dueDate && !t.completed)
//     .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

//   // Group tasks by date
//   const grouped = upcomingTasks.reduce((acc, task) => {
//     const date = task.dueDate;
//     if (!acc[date]) acc[date] = [];
//     acc[date].push(task);
//     return acc;
//   }, {});

//   const formatHeader = (dateStr) => {
//     const date = parseISO(dateStr);
//     if (isToday(date)) return "Today";
//     if (isTomorrow(date)) return "Tomorrow";
//     return format(date, "MMM d, yyyy");
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-6">Upcoming</h1>

//       {Object.entries(grouped).map(([date, tasks]) => (
//         <div key={date} className="mb-6">
//           <h2 className="text-sm text-gray-400 mb-2">
//             {formatHeader(date)}
//           </h2>

//           <div className="space-y-1">
//             {tasks.map((task) => (
//               <TaskItem key={task.id} task={task} />
//             ))}
//           </div>
//         </div>
//       ))}

//       {upcomingTasks.length === 0 && (
//         <p className="text-gray-500 text-sm">No upcoming tasks 🎉</p>
//       )}
//     </div>
//   );
// }

import { useAppStore } from "../store/useAppStore";
import TaskItem from "../components/tasks/TaskItem";
import { sortTasksSmart } from "../components/utils/taskSort";

function groupTasksByDate(tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const groups = {
    today: [],
    tomorrow: [],
    week: [],
    later: [],
  };

  tasks.forEach((task) => {
    if (!task.dueDate) return;

    const [y, m, d] = task.dueDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setHours(0, 0, 0, 0);

    const diff = (date - today) / (1000 * 60 * 60 * 24);

    if (diff === 0) groups.today.push(task);
    else if (diff === 1) groups.tomorrow.push(task);
    else if (diff > 1 && diff <= 7) groups.week.push(task);
    else if (diff > 7) groups.later.push(task);
  });
Object.values(groups).forEach(group =>
  group.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
);

  return groups;
}

export default function Upcoming() {
const tasks = sortTasksSmart(useAppStore((s) => s.tasks));
  const groups = groupTasksByDate(tasks);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Upcoming</h1>

      <TaskGroup title="Today" tasks={groups.today} color="text-green-400" />
      <TaskGroup title="Tomorrow" tasks={groups.tomorrow} color="text-blue-400" />
      <TaskGroup title="Next 7 Days" tasks={groups.week} color="text-yellow-400" />
      <TaskGroup title="Later" tasks={groups.later} color="text-gray-400" />
    </div>
  );
}

function TaskGroup({ title, tasks, color }) {
  if (!tasks.length) return null;

  return (
    <div>
      <h2 className={`text-sm font-semibold mb-2 ${color}`}>{title}</h2>
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

