import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskItem from "./TaskItem";

export default function DraggableTask({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
  <button
    {...attributes}
    {...listeners}
    className="cursor-grab text-gray-500 hover:text-white"
  >
    ☰
  </button>

  <div className="flex-1">
    <TaskItem task={task} />
  </div>
</div>
  );
}
