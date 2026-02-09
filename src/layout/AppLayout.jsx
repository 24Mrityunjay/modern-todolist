import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../topbar/Topbar";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#181818] text-gray-900 dark:text-gray-100">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONTENT */}
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-3xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
