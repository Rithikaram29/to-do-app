import React from 'react';
import { useSelector } from 'react-redux';
import TaskCard from './TaskCard';

const TaskList: React.FC = () => {
  const { items, filters } = useSelector((state: any) => state.tasks);

  const filtered = items.filter((t: any) => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !(t.description || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="task-list">
      {filtered.map((task: any) => (
        <TaskCard key={task.id} task={task} />
      ))}
      {filtered.length === 0 && <p>No tasks found.</p>}
    </div>
  );
};

export default TaskList;