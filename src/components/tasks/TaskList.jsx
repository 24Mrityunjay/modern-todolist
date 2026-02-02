import { useAppStore } from "../store/useAppStore";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const tasks = useAppStore((s) => s.tasks);

  return (
    <div className="max-w-2xl mx-auto">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} />
      ))}
    </div>
  );
}
