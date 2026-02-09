import {
  MagnifyingGlassIcon,
  PlusIcon,
  MoonIcon
} from "@heroicons/react/24/outline";
import { useAppStore } from "../store/useAppStore";

export default function Topbar() {
  // const toggleDark = useAppStore((s) => s.toggleDark);
   const openAddTask = useAppStore((s) => s.openAddTask);
   const searchQuery = useAppStore((s) => s.searchQuery);
const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  const { theme, toggleTheme } = useAppStore();
  return (
    <header className="flex items-center justify-between px-6 py-3
bg-white dark:bg-[#1f1f1f]
border-b border-gray-200 dark:border-gray-800
text-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-4">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />

        <input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
       <button
        onClick={openAddTask}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
      >
        <PlusIcon className="w-5 h-5" />
      </button>
        <button
          onClick={toggleTheme}
          className="cursor-pointer px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
        >
         {theme === "dark" ? "☀️ Switch to Light" : "🌙 Switch to Dark"}
        </button>
      </div>
    </header>
  );
}
