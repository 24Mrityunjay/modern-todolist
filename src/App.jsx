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

function DarkModeWatcher() {
  const dark = useAppStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return null;
}

export default function App() {
  return (
    <>
      <DarkModeWatcher />
      {/* <AppLayout>
        <Dashboard />
      </AppLayout> */}
      <AppLayout>
        <Routes>
          <Route path="/" element={<Inbox />} />
          <Route path="/today" element={<Today />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/label/:labelId" element={<LabelView />} />
          <Route path="/project/:projectId" element={<ProjectView />} />
        </Routes>
      </AppLayout>
    </>
  );
}
