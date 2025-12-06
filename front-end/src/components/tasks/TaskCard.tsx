import React from "react";
import type { Task } from "../../types/task";

interface Props {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
}

const priorityColor: Record<Task["priority"], string> = {
  low: "#8bc34a",
  medium: "#ffeb3b",
  high: "#ff9800",
  critical: "#f44336",
};

const TaskCard: React.FC<Props> = ({ task, onClick, onDelete }) => {
  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-card-header">
        <span className="task-title">{task.title}</span>
        <span
          className="priority-dot"
          style={{ backgroundColor: priorityColor[task.priority] }}
        />
      </div>
      {task.dueDate && (
        <div className="task-meta">
          Due: {new Date(task.dueDate).toLocaleString()}
        </div>
      )}

{task.status === "done" && (
  <button
    className="task-delete-button border-2 border-black border-r-4 z-10"
    onClick={(e) => {
      e.stopPropagation();          
      console.log("isClicked");
      onDelete?.();
    }}
    onPointerDown={(e) => {
      e.stopPropagation();
    }}
  >
    Delete
  </button>
)}
    </div>
  );
};

export default TaskCard;
