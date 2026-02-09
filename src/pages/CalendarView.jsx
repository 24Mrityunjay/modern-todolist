import { useEffect, useRef } from "react";
// Calendar core
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

// Drag & drop addon
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

// Styles (REQUIRED or calendar looks broken)
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

// Date utils
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

// Your store
import { useAppStore } from "../store/useAppStore";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";


const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});
const DnDCalendar = withDragAndDrop(Calendar);
export default function CalendarView() {
    const popupRef = useRef(null);

    const { tasks, updateTaskDate } = useAppStore();
    const [draggedTask, setDraggedTask] = useState(null)
    // const { updateTaskDueDate } = useAppStore();
    const setSelectedTask = useAppStore((s) => s.setSelectedTask);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    function DayCell({ date, children }) {
        const dateStr = date.toISOString().split("T")[0];

        const { setNodeRef, isOver } = useDroppable({
            id: dateStr, // VERY IMPORTANT → droppable id = date
        });

        return (
            <div
                ref={setNodeRef}
                className={`h-28 border border-gray-800 p-1 relative ${isOver ? "bg-blue-900/40" : ""
                    }`}
            >
                <div className="text-xs text-gray-400">{date.getDate()}</div>
                {children}
            </div>
        );
    }
    useEffect(() => {
        function handleClickOutside(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setSelectedDate(null); // closes popup
            }
        }

        if (selectedDate) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectedDate]);

    useEffect(() => {
        window.setCalendarDraggedTask = setDraggedTask;
        return () => (window.setCalendarDraggedTask = null);
    }, []);
    function handleExternalDrop({ start }) {
        // const task = window.currentDraggedTask
        // if (!task) return

        // const year = start.getFullYear()
        // const month = String(start.getMonth() + 1).padStart(2, "0")
        // const day = String(start.getDate()).padStart(2, "0")

        // const newDate = `${year}-${month}-${day}`

        // updateTaskDueDate(task.id, newDate)

        // window.currentDraggedTask = null

        if (!draggedTask) return;

        const newDate = start.toISOString().split("T")[0];
        updateTaskDate(draggedTask.id, newDate);

        setDraggedTask(null);
    }
    function handleSelectSlot(slotInfo) {
        //   const dateStr = start.toISOString().split("T")[0];
        //   setSelectedDate(dateStr);
        if (slotInfo.action !== "doubleClick") return;

        const dateStr = slotInfo.start.toISOString().split("T")[0];
        setSelectedDate(dateStr);

    }
    const addTask = useAppStore((s) => s.addTask);

    function handleAddTask() {
        if (!newTaskTitle.trim()) return;

        addTask(newTaskTitle, null, selectedDate, 4, []);
        setNewTaskTitle("");
        setSelectedDate(null);
    }
    // Convert tasks → calendar events
    const events = tasks
        .filter((t) => t.dueDate)
        .map((task) => ({
            id: task.id,
            title: task.title,
            start: new Date(task.dueDate),
            end: new Date(task.dueDate),
            allDay: true,
        }));

    // Drag to new day
    const handleEventDrop = ({ event, start }) => {
        const newDate = start.toISOString().split("T")[0];
        updateTaskDate(event.id, newDate);
    };


    return (
        <div className="p-6 h-[calc(100vh-80px)]">
            <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                views={["month"]}
                onEventDrop={handleEventDrop}
                draggableAccessor={() => true}
                onSelectEvent={(event) => setSelectedTask(event.id)}
                longPressThreshold={10} // makes double-click detection snappy

                selectable
                onDropFromOutside={handleExternalDrop}
                dragFromOutsideItem={() => draggedTask}
                onSelectSlot={handleSelectSlot}
                eventPropGetter={(event) => {
                    const task = tasks.find(t => t.id === event.id)

                    const colors = {
                        1: "#ef4444", // red
                        2: "#f97316", // orange
                        3: "#3b82f6", // blue
                        4: "#6b7280"  // gray
                    }

                    return {
                        style: {
                            backgroundColor: colors[task?.priority] || "#3b82f6",
                            borderRadius: "6px",
                            border: "none",
                            color: "white",
                            padding: "2px 6px",
                            fontSize: "12px"
                        }
                    }
                }}
            />
            {selectedDate && (
                <div ref={popupRef} className="fixed bottom-6 right-6 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-xl w-72">
                    <div className="text-sm text-gray-400 mb-2">
                        Add task for {selectedDate}
                    </div>

                    <input
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task name..."
                        className="w-full bg-[#2a2a2a] border border-gray-600 rounded px-2 py-1 mb-2"
                        onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                    />

                    <button
                        onClick={handleAddTask}
                        className="w-full bg-red-500 hover:bg-red-600 py-1 rounded text-sm"
                    >
                        Add Task
                    </button>
                </div>
            )}

        </div>
    );
}
