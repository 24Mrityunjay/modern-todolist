import {
  MagnifyingGlassIcon,
  PlusIcon,
  MoonIcon
} from "@heroicons/react/24/outline";
import { useAppStore } from "../store/useAppStore";

export default function Topbar() {
  const toggleDark = useAppStore((s) => s.toggleDark);

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b dark:border-gray-800">
      <div className="flex items-center gap-4">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        <input
          placeholder="Search"
          className="bg-transparent outline-none text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <PlusIcon className="w-5 h-5" />
        </button>
        <button
          onClick={toggleDark}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
        >
          <MoonIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
