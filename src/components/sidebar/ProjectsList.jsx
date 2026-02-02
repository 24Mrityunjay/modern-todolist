import { useAppStore } from "../../store/useAppStore";
import { NavLink } from "react-router-dom";

const colorMap = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  gray: "bg-gray-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
};

export default function ProjectsList() {
  const { projects } = useAppStore();

  return (
    <div className="mt-6">
      <h3 className="text-xs uppercase text-gray-400 mb-2">Projects</h3>
      {projects.map((project) => (
        <NavLink
          key={project.id}
          to={`/project/${project.id}`}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 ${isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <span className={`w-3 h-3 rounded-full ${colorMap[project.color]}`} />
          <span>{project.name}</span>
        </NavLink>
      ))}
    </div>
  );
}
