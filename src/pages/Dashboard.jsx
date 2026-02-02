import { useAppStore } from "../store/useAppStore";
import TaskList from "../components/tasks/TaskList";
import QuickAdd from "../components/tasks/QuickAdd";

export default function Dashboard() {
  const selectedView = useAppStore((s) => s.selectedView);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 capitalize">{selectedView}</h2>
      <QuickAdd />
      <TaskList />
    </>
  );
}
