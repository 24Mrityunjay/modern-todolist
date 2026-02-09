import { useEffect } from "react";
import AppLayout from "./layout/AppLayout";
// import Dashboard from "./pages/Dashboard";
import { useAppStore } from "./store/useAppStore";
import Today from "./pages/Today";
import Upcoming from "./pages/Upcoming";
import ProjectView from "./pages/ProjectView";
import Inbox from "./pages/Inbox";
import { Route, Routes } from "react-router-dom";
import LabelView from "./pages/LabelView";
import "react-day-picker/dist/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CalendarView from "./pages/CalendarView";
import EditTaskModal from "./components/tasks/EditTaskModal";
import ReminderWatcher from "./components/tasks/ReminderWatcher";
import AddTaskModal from "./components/tasks/AddTaskModal";

// function DarkModeWatcher() {
//   const dark = useAppStore((s) => s.darkMode);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", dark);
//   }, [dark]);

//   return null;
// }

export default function App() {

const theme = useAppStore((s) => s.theme);

// useEffect(() => {
//   const root = document.documentElement;
//   const mediaQuery = window.matchMedia("(prefers-color-scheme: system)");

//   const applyTheme = () => {
//     const systemDark = mediaQuery.matches;
//     const shouldDark = theme === "dark" || (theme === "system" && systemDark);

//     root.classList.toggle("dark", shouldDark);
//   };

//   applyTheme(); // run immediately

//   mediaQuery.addEventListener("change", applyTheme); // react to OS change
//   return () => mediaQuery.removeEventListener("change", applyTheme);

// }, [theme]);
useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark");
}, [theme]);

  useEffect(() => {
  function handleKey(e) {
    // N = new task
    if (e.key === "n" && !e.target.matches("input, textarea")) {
      useAppStore.getState().openQuickAdd?.();
    }

    // ESC = close modal
    if (e.key === "Escape") {
      useAppStore.getState().clearSelectedTask();
    }
  }

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100">

      {/* <DarkModeWatcher /> */}
      
      {/* <AppLayout>
        <Dashboard /> 
      </AppLayout> */}
      <ReminderWatcher />
      <EditTaskModal />
      <AddTaskModal />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Inbox />} />
          <Route path="/today" element={<Today />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/label/:labelId" element={<LabelView />} />
          <Route path="/project/:projectId" element={<ProjectView />} />
          <Route path="/calendar" element={<CalendarView />} />
        </Routes>
      </AppLayout>
    </div>
  );
}
