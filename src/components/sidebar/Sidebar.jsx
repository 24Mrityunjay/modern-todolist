import {
  InboxIcon,
  CalendarDaysIcon,
  CalendarIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useAppStore } from "../../store/useAppStore";
import ProjectsList from "./ProjectsList";
import { NavLink } from "react-router-dom";
import LightLogo from "../../assets/logolight.png";
import DarkLogo from "../../assets/logodark.png";

export default function Sidebar() {
  const labels = useAppStore((s) => s.labels);
  const setFilter = useAppStore((s) => s.setFilter);
  const clearFilter = useAppStore((s) => s.clearFilter);
  const theme = useAppStore((s) => s.theme);
  return (
<aside className="w-64 shrink-0 bg-gray-50 dark:bg-[#181818] border-r border-gray-200 dark:border-gray-800 p-4">
      <h1 className="text-xl font-bold text-tasklyRed mb-6 flex items-center justify-center">
        <img src={theme === "dark" ? DarkLogo : LightLogo} width="30px" height="30px" alt="logo" />
        Taskly
      </h1>

      <nav className="space-y-2" > 
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 ${isActive ? "bg-gray-300 dark:bg-gray-600" : ""
            }`
          }
        >
          <InboxIcon className="w-5 h-5" />
          <span>Inbox</span>
        </NavLink>

          <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 ${isActive ? "bg-gray-300 dark:bg-gray-600"  : ""
            }`
          }
        >
        <CalendarDaysIcon className="w-5 h-5" />
          <span>Calendar</span>
        </NavLink>

        {/* <NavLink > Calendar</NavLink> */}

        <NavLink
          to="/today"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 ${isActive ? "bg-gray-300 dark:bg-gray-600"  : ""
            }`
          }
        >
          <CalendarIcon className="w-5 h-5" /> Today
        </NavLink>


        <NavLink
          to="/upcoming"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-gray-300 dark:bg-gray-600"  : "hover:bg-gray-200 dark:hover:bg-gray-600"
            }`
          }
        >
          <SunIcon className="w-5 h-5" /> Upcoming
        </NavLink>

      </nav >
      <ProjectsList />


      <div className="mt-6">
        <p className="text-xs text-gray-500 mb-2">FILTERS</p>

        <button onClick={clearFilter} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 ">
          📋 All Tasks
        </button>

        <button
          onClick={() => setFilter({ type: "today" })}
          className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 "
        >
          📅 Today
        </button>

        <button
          onClick={() => setFilter({ type: "priority", value: 1 })}
          className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 "
        >
          🔴 Priority 1
        </button>

        <div className="mt-3 text-xs text-gray-500">LABELS</div>
        {labels.map((label) => (
          <button
            key={label.id}
            onClick={() => setFilter({ type: "label", value: label.id })}
            className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 "
          >
            #{label.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
