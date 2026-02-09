export function sortTasksSmart(tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const toLocalDate = (dueDate) => {
    if (!dueDate) return null;
    const [y, m, d] = dueDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  return [...tasks].sort((a, b) => {
    const dateA = toLocalDate(a.dueDate);
    const dateB = toLocalDate(b.dueDate);

    const isOverdueA = dateA && dateA < today;
    const isOverdueB = dateB && dateB < today;

    if (isOverdueA && !isOverdueB) return -1;
    if (!isOverdueA && isOverdueB) return 1;

    if (dateA && dateB) return dateA - dateB;
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;

    return (a.order || 0) - (b.order || 0);
  });
}
