export function getNextDueDate(currentDueDate, recurrence) {
  if (!currentDueDate) return null;

  const [y, m, d] = currentDueDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);

  if (recurrence === "daily") date.setDate(date.getDate() + 1);
  else if (recurrence === "weekly") date.setDate(date.getDate() + 7);
  else if (recurrence === "monthly") date.setMonth(date.getMonth() + 1);
  else {
    // weekday recurrence
    const days = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6,
    };
    const targetDay = days[recurrence];
    while (date.getDay() !== targetDay) {
      date.setDate(date.getDate() + 1);
    }
    date.setDate(date.getDate() + 7);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
