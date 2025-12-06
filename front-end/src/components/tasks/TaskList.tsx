import React, { useState } from "react";
import { useSelector } from "react-redux";
import TaskCard from "./TaskCard";
import TaskDetailsModal from "./taskDetailsModal";
import type { Task } from "../../types/task";

const TaskList: React.FC = () => {
  const { items, filters } = useSelector((state: any) => state.tasks);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const filtered = items.filter((t: any) => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !(t.description || "").toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="task-list">
      {filtered.map((task: Task) => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => handleOpenTask(task)}
        />
      ))}
      {filtered.length === 0 && <p>No tasks found.</p>}

      <TaskDetailsModal task={selectedTask} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default TaskList;