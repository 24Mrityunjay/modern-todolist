import { create } from "zustand";
import { nanoid } from "nanoid";
import { getNextDueDate } from "../components/utils/recurrence";

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

  // addTask: (
  //   title,
  //   sectionId = null,
  //   dueDate = null,
  //   priority = 4,
  //   labels = [],
  //   recurrence = null // NEW
  // ) =>
  //   set((state) => ({
  //     tasks: [
  //       ...state.tasks,
  //       {
  //         id: nanoid(),
  //         title: title?.trim() || "Untitled Task",
  //         completed: false,
  //         projectId: state.currentProjectId,
  //         sectionId,
  //         dueDate,
  //         priority: Number(priority) || 4,
  //         labels: Array.isArray(labels) ? labels : [],
  //         recurrence, // 🔁 store rule
  //         order: Date.now(),
  //       },
  //     ],
  //   })),

  addTask: (
  title,
  sectionId = null,
  dueDate = null,
  priority = 4,
  labels = [],
  recurrence = null
) =>
  set((state) => {
    const newTask = {
      id: nanoid(),
      title: title?.trim() || "Untitled Task",
      completed: false,
      projectId: state.currentProjectId,
      sectionId,
      dueDate,
      priority: Number(priority) || 4,
      labels: Array.isArray(labels) ? labels : [],
      recurrence,
      order: Date.now(),
      subtasks: [], // ✅ NEW
      comments: [],
      reminder: null, // "2026-02-10T09:00"
notified: false,
    };

    return {
      tasks: [...state.tasks, newTask],

      // 🕘 Activity log
      activities: [
        {
          id: nanoid(),
          taskId: newTask.id,
          message: "Task created",
          time: Date.now(),
        },
        ...(state.activities || []),
      ],
    };
  }),


// toggleTask: (id) =>
//   set((state) => {
//     const task = state.tasks.find((t) => t.id === id);
//     if (!task) return state;

//     const updatedTasks = state.tasks.map((t) =>
//       t.id === id ? { ...t, completed: !t.completed } : t
//     );

//     // If task was just completed AND has recurrence
//     if (!task.completed && task.recurrence) {
//       const nextDueDate = getNextDueDate(task.dueDate, task.recurrence);

//       updatedTasks.push({
//         ...task,
//         id: nanoid(),
//         completed: false,
//         dueDate: nextDueDate,
//         order: Date.now(),
//       });
//     }

//     return { tasks: updatedTasks };
//   }),

toggleTask: (id) =>
  set((state) => {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return state;

    const completed = !task.completed;

    let updatedTasks = state.tasks.map((t) =>
      t.id === id ? { ...t, completed } : t
    );

    let newActivities = [
      {
        id: nanoid(),
        taskId: id,
        message: completed ? "Completed task" : "Marked incomplete",
        time: Date.now(),
      },
    ];

    // 🔁 If just completed AND recurring → create next instance
    if (completed && task.recurrence) {
      const nextDueDate = getNextDueDate(task.dueDate, task.recurrence);

      const nextTask = {
        ...task,
        id: nanoid(),
        completed: false,
        dueDate: nextDueDate,
        order: Date.now(),
      };

      updatedTasks.push(nextTask);

      newActivities.unshift({
        id: nanoid(),
        taskId: nextTask.id,
        message: `Recurring task created (next due ${nextDueDate})`,
        time: Date.now(),
      });
    }

    return {
      tasks: updatedTasks,
      activities: [...newActivities, ...(state.activities || [])],
    };
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
  updateTaskDate: (taskId, newDate) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, dueDate: newDate } : t
      ),
    })),
  updateTaskDueDate: (taskId, dueDate) =>
    set((state) => ({
      tasks: state.tasks.map(t =>
        t.id === taskId ? { ...t, dueDate } : t
      )
    })),
selectedTaskId: null,

setSelectedTask: (id) => set({ selectedTaskId: id }),
clearSelectedTask: () => set({ selectedTaskId: null }),
// updateTask: (taskId, updates) =>
//   set((state) => ({
//     tasks: state.tasks.map((t) =>
//       t.id === taskId ? { ...t, ...updates } : t
//     ),
//   })),
updateTask: (taskId, updates) =>
  set((state) => {
    const oldTask = state.tasks.find((t) => t.id === taskId);
    const newTasks = state.tasks.map((t) =>
      t.id === taskId ? { ...t, ...updates } : t
    );

    const changes = [];

    if (updates.title && updates.title !== oldTask.title)
      changes.push("Renamed task");

    if (updates.dueDate !== oldTask.dueDate)
      changes.push(`Changed due date to ${updates.dueDate}`);

    if (updates.priority && updates.priority !== oldTask.priority)
      changes.push(`Changed priority to P${updates.priority}`);

    const newActivities = changes.map((msg) => ({
      id: nanoid(),
      taskId,
      message: msg,
      time: Date.now(),
    }));

    return {
      tasks: newTasks,
      activities: [...newActivities, ...state.activities],
    };
  }),

activities: [],
addActivity: (taskId, message) =>
  set((state) => ({
    activities: [
      {
        id: nanoid(),
        taskId,
        message,
        time: Date.now(),
      },
      ...state.activities,
    ],
  })),

addSubtask: (taskId, title) =>
  set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            subtasks: [
              ...(t.subtasks || []),
              { id: nanoid(), title, completed: false },
            ],
          }
        : t
    ),
  })),

toggleSubtask: (taskId, subtaskId) =>
  set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            subtasks: (t.subtasks || []).map((s) =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s
            ),
          }
        : t
    ),
  })),

deleteSubtask: (taskId, subtaskId) =>
  set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            subtasks: (t.subtasks || []).filter((s) => s.id !== subtaskId),
          }
        : t
    ),
  })),
addComment: (taskId, text) =>
  set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            comments: [
              ...(t.comments || []),
              { id: nanoid(), text, time: Date.now() },
            ],
          }
        : t
    ),
  })),

  setReminder: (taskId, dateTime) =>
  set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === taskId ? { ...t, reminder: dateTime } : t
    ),
  })),
quickAddOpen: false,
openQuickAdd: () => set({ quickAddOpen: true }),
closeQuickAdd: () => set({ quickAddOpen: false }),
theme: localStorage.getItem("theme") || "light",
setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },

toggleTheme: () =>
  set((state) => {
    const newTheme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    return { theme: newTheme };
  }),

    isAddTaskOpen: false,

  openAddTask: () => set({ isAddTaskOpen: true }),
  closeAddTask: () => set({ isAddTaskOpen: false }),

  searchQuery: "",
setSearchQuery: (query) => set({ searchQuery: query }),
}));
