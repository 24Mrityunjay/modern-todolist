import QuickAdd from "../components/tasks/QuickAdd";
import TaskItem from "../components/tasks/TaskItem";
import { useAppStore } from "../store/useAppStore";

export default function Inbox() {
  const { tasks, currentProjectId } = useAppStore();

  const projectTasks = tasks.filter((t) => t.projectId === currentProjectId);
const inboxTasks = projectTasks
  .filter((t) => !t.sectionId)
  .sort((a, b) => a.order - b.order);
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4 capitalize">
        {currentProjectId}
      </h1>

      <QuickAdd />

      <div>
        {inboxTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </>
  );
}
