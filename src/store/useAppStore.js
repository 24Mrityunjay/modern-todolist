import { create } from "zustand";
import { nanoid } from "nanoid";

export const useAppStore = create((set) => ({
  currentProjectId: "inbox",

  projects: [
    { id: "inbox", name: "Inbox", color: "gray" },
    { id: "work", name: "Work", color: "blue" },
  ],
  labels: [
    { id: "work", name: "Work", color: "blue" },
    { id: "personal", name: "Personal", color: "green" },
    { id: "urgent", name: "Urgent", color: "red" },
  ],

  sections: {
    work: [
      { id: "planning", name: "Planning" },
      { id: "dev", name: "Development" },
    ],
  },

  tasks: [],

  addTask: (
    title,
    sectionId = null,
    dueDate = null,
    priority = 4,
    labels = []
  ) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: nanoid(),
          title: title?.trim() || "Untitled Task",
          completed: false,
          projectId: state.currentProjectId,
          sectionId,
          dueDate,
          priority: Number(priority) || 4,
          labels: Array.isArray(labels) ? labels : [],
          order: -Date.now(),
        },
      ],
    })),

  toggleTask: (id) =>
    set((state) => {
      const updated = state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );

      console.log("Toggled:", id, updated.find(t => t.id === id)); // 👈 DEBUG
      return { tasks: updated };
    }),


  setProject: (projectId) => set({ currentProjectId: projectId }),

  moveTaskToSection: (taskId, newSectionId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, sectionId: newSectionId } : t
      ),
    })),
  reorderTask: (activeId, overId, newSectionId) =>
    set((state) => {
      let tasks = state.tasks.map((t) =>
        t.id === activeId ? { ...t, sectionId: newSectionId } : t
      );

      const sectionTasks = tasks
        .filter((t) => t.sectionId === newSectionId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const oldIndex = sectionTasks.findIndex((t) => t.id === activeId);
      const newIndex = sectionTasks.findIndex((t) => t.id === overId);

      if (oldIndex === -1 || newIndex === -1) return { tasks };

      const [moved] = sectionTasks.splice(oldIndex, 1);
      sectionTasks.splice(newIndex, 0, moved);

      sectionTasks.forEach((t, i) => (t.order = i + 1));

      return { tasks: [...tasks] };
    }),

  currentFilter: null, // { type: 'label' | 'priority' | 'today', value }
  setFilter: (filter) => set({ currentFilter: filter }),
  clearFilter: () => set({ currentFilter: null }),

}));
