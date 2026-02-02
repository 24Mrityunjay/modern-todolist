export function sortTasksSmart(tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [...tasks].sort((a, b) => {
    // Convert date safely
    const getDate = (t) => {
      if (!t.dueDate) return null;
      const [y, m, d] = t.dueDate.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const dateA = getDate(a);
    const dateB = getDate(b);

    const isOverdueA = dateA && dateA < today;
    const isOverdueB = dateB && dateB < today;

    // 🔴 Overdue first
    if (isOverdueA && !isOverdueB) return -1;
    if (!isOverdueA && isOverdueB) return 1;

    // 📅 Then tasks with dates (nearest first)
    if (dateA && dateB) return dateA - dateB;
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;

    // 🧩 Fallback to manual drag order
    return (a.order || 0) - (b.order || 0);
  });
}
