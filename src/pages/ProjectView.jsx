import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import TaskItem from "../components/tasks/TaskItem";
import QuickAdd from "../components/tasks/QuickAdd";
import Section from "../components/sections/Section";
import { DndContext, closestCenter, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableTask from "../components/tasks/DraggableTask";
import { sortTasksSmart } from "../components/utils/taskSort";

function InboxDropZone({ tasks }) {
  const { setNodeRef } = useDroppable({ id: "inbox" });

  const sortedTasks = [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
  const taskIds = sortedTasks.map((t) => t.id);

  return (
    <div ref={setNodeRef} className="space-y-1">
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {sortedTasks.map((task) => (
          <DraggableTask key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}

export default function ProjectView() {
  const { projectId } = useParams();
  const { tasks, sections, setProject } = useAppStore();
  // const { moveTaskToSection } = useAppStore();

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const state = useAppStore.getState();
    const tasks = state.tasks;

    // const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    let newSectionId = null;

    if (over.id === "inbox") newSectionId = null;
    else if (state.sections[projectId]?.some((s) => s.id === over.id))
      newSectionId = over.id;
    else if (overTask) newSectionId = overTask.sectionId ?? null;

    if (!overTask) {
      state.moveTaskToSection(active.id, newSectionId);
      return;
    }

    state.reorderTask(active.id, over.id, newSectionId);
  }


const clearFilter = useAppStore((s) => s.clearFilter);

useEffect(() => {
  setProject(projectId);
  clearFilter(); // 💥 THIS FIXES YOUR ISSUE
}, [projectId, setProject, clearFilter]);

const { currentFilter } = useAppStore();

let projectTasks = tasks.filter((t) => t.projectId === projectId);

if (currentFilter) {
  if (currentFilter.type === "label") {
    projectTasks = projectTasks.filter((t) =>
      t.labels?.includes(currentFilter.value)
    );
  }

  if (currentFilter.type === "priority") {
    projectTasks = projectTasks.filter(
      (t) => t.priority === currentFilter.value
    );
  }

  if (currentFilter.type === "today") {
    const today = new Date().toISOString().split("T")[0];
    projectTasks = projectTasks.filter((t) => t.dueDate === today);
  }
}
  const projectSections = sections[projectId] || [];
  const unsectioned = sortTasksSmart(
  projectTasks.filter((t) => !t.sectionId)
);

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <h1 className="text-2xl font-semibold mb-4 capitalize">{projectId}</h1>

        <QuickAdd />

        <InboxDropZone tasks={unsectioned} />
        {projectSections.map((section) => (
          <Section key={section.id} section={section} />
        ))}

      </DndContext>
    </>

  );
}
