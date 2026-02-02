import { useDroppable } from "@dnd-kit/core";
import DraggableTask from "../tasks/DraggableTask";
import { useAppStore } from "../../store/useAppStore";
import { useMemo } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { sortTasksSmart } from "../utils/taskSort";

export default function Section({ section }) {
  const { setNodeRef } = useDroppable({ id: section.id });

  const allTasks = useAppStore((s) => s.tasks);
  const tasks = useMemo(() => {
  return sortTasksSmart(
    allTasks.filter((t) => t.sectionId === section.id)
  );
}, [allTasks, section.id]);

  const taskIds = tasks.map((t) => t.id);
  return (
    <div ref={setNodeRef} className="mt-6 min-h-[40px]">
      <h2 className="text-sm font-semibold text-gray-400 mb-2">
        {section.name}
      </h2>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {tasks.map((task) => (
            <DraggableTask key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}