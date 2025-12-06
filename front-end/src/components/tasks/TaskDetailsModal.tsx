import React from "react";
import type { Task } from "../../types/task";

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, isOpen, onClose }) => {
  if (!isOpen || !task) return null;

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>{task.title}</h2>

        {task.description && <p className="task-description">{task.description}</p>}

        <div className="task-meta">
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Due date:</strong> {formattedDueDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;