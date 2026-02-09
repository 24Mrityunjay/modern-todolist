import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const selectedDate = value ? new Date(value) : undefined;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm text-left"
      >
        {value ? format(new Date(value), "PPP") : "Pick a due date"}
      </button>

      {/* Calendar Popup */}
      {open && (
        <div className="absolute z-50 mt-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              // const formatted = date.toISOString().split("T")[0]; // YYYY-MM-DD
              onChange(date);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
