import * as chrono from "chrono-node";

export function parseTaskInput(text) {
    let taskText = text;
    let priority = null;
    let labels = [];

    // 🚩 Priority
    const pMatch = text.match(/p([1-4])/i);
    if (pMatch) {
        priority = Number(pMatch[1]);
        taskText = taskText.replace(pMatch[0], "");
    }

    // 🏷 Labels
    const labelMatches = [...text.matchAll(/#(\w+)/g)];
    if (labelMatches.length) {
        labels = labelMatches.map((m) => m[1]);
        taskText = taskText.replace(/#\w+/g, "");
    }

    // 📅 Date & Time
    const dateResult = chrono.parse(text)[0];
    let dueDate = null;

    if (dateResult && dateResult.start.isCertain("day") && dateResult.index > 0) {
        const dateObj = dateResult.start.date();

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");

        dueDate = `${year}-${month}-${day}`;

        const before = taskText.slice(0, dateResult.index);
        const after = taskText.slice(dateResult.index + dateResult.text.length);

        taskText = (before + after).trim();
    }
    return {
        title: taskText.trim(),
        priority,
        labels,
        dueDate, // "2026-02-02"
    };
}
