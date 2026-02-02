export function getDueDateStatus(dueDate) {
  if (!dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 🔥 Convert "YYYY-MM-DD" safely to local date
  const [year, month, day] = dueDate.split("-").map(Number);
  const taskDate = new Date(year, month - 1, day); // LOCAL time
  taskDate.setHours(0, 0, 0, 0);

  const diff = (taskDate - today) / (1000 * 60 * 60 * 24);

  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  return "future";
}
