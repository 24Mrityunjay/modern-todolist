import { useState } from "react";
import { useAppStore } from "../../store/useAppStore";

export default function CommentsSection({ taskId }) {
  const [text, setText] = useState("");
  const task = useAppStore((s) => s.tasks.find((t) => t.id === taskId));
  const addComment = useAppStore((s) => s.addComment);

  if (!task) return null;

  return (
    <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-3">
      <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Comments
      </h3>

      <div className="space-y-2 mb-2 max-h-32 overflow-y-auto pr-1">
        {(task.comments || []).map((c) => (
          <div
            key={c.id}
            className="text-xs text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-[#2a2a2a] px-2 py-1 rounded"
          >
            <span>{c.text}</span>
            <span className="block text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              {new Date(c.time).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && text.trim()) {
            addComment(taskId, text.trim());
            setText("");
          }
        }}
        placeholder="Write a comment..."
        className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
      />
    </div>
  );
}
