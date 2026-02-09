import { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function ReminderWatcher() {
  const tasks = useAppStore((s) => s.tasks);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (task.reminder && !task.notified) {
          const reminderTime = new Date(task.reminder);

          if (reminderTime <= now) {
            alert(`🔔 Reminder: ${task.title}`);

            useAppStore.setState((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === task.id ? { ...t, notified: true } : t
              ),
            }));
          }
        }
      });
    }, 30000); // check every 30 sec

    return () => clearInterval(interval);
  }, [tasks]);

  return null;
}
