import { InboxIcon, CalendarIcon, SunIcon } from "@heroicons/react/24/outline";
import { useAppStore } from "../../store/useAppStore";
import ProjectsList from "./ProjectsList";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const labels = useAppStore((s) => s.labels);
  const setFilter = useAppStore((s) => s.setFilter);
  const clearFilter = useAppStore((s) => s.clearFilter);
  return (
    <aside className="w-64 shrink-0 bg-sidebar dark:bg-[#181818] border-r dark:border-gray-800 p-4">
      <h1 className="text-xl font-bold text-todoistRed mb-6">Todoist</h1>

      <nav className="space-y-2" > <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 ${isActive ? "bg-gray-800" : ""
          }`
        }
      >
        <InboxIcon className="w-5 h-5" />
        <span>Inbox</span>
      </NavLink>

        <NavLink
          to="/today"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 ${isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <CalendarIcon className="w-5 h-5" /> Today
        </NavLink>


        <NavLink
          to="/upcoming"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded ${isActive ? "bg-gray-800" : "hover:bg-gray-800"
            }`
          }
        >
          <SunIcon className="w-5 h-5" /> Upcoming
        </NavLink>

      </nav >
      <ProjectsList />


      <div className="mt-6">
        <p className="text-xs text-gray-500 mb-2">FILTERS</p>

        <button onClick={clearFilter} className="sidebar-item">
          📋 All Tasks
        </button>

        <button
          onClick={() => setFilter({ type: "today" })}
          className="sidebar-item"
        >
          📅 Today
        </button>

        <button
          onClick={() => setFilter({ type: "priority", value: 1 })}
          className="sidebar-item"
        >
          🔴 Priority 1
        </button>

        <div className="mt-3 text-xs text-gray-500">LABELS</div>
        {labels.map((label) => (
          <button
            key={label.id}
            onClick={() => setFilter({ type: "label", value: label.id })}
            className="sidebar-item"
          >
            #{label.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
