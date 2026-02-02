import { useParams } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import TaskItem from "../components/tasks/TaskItem";

export default function LabelView() {
  const { labelId } = useParams();
  const tasks = useAppStore((s) => s.tasks);

  const filtered = tasks.filter((t) => t.labels?.includes(labelId));

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">#{labelId.charAt(0).toUpperCase()+labelId.slice(1)}</h1>
      {filtered.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </>
  );
}
