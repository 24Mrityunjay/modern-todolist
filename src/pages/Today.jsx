import { useAppStore } from "../store/useAppStore";
import TaskItem from "../components/tasks/TaskItem";

export default function Today() {
  const tasks = useAppStore((s) => s.tasks);

  const todayStr = new Date().toISOString().split("T")[0];

  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Today</h1>
      {todayTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </>
  );
}
