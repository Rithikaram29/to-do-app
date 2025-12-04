import React from 'react';
import { useAppDispatch } from '../../hooks/useRedux';
import { setFilters } from '../../store/taskSlice';
import type { TaskPriority, TaskStatus } from '../../types/task';

const TaskFilters: React.FC = () => {
  const dispatch = useAppDispatch();

  const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    dispatch(setFilters({ status: value as TaskStatus | undefined }));
  };

  const onPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || undefined;
    dispatch(setFilters({ priority: value as TaskPriority | undefined }));
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ search: e.target.value || undefined }));
  };

  return (
    <div className="task-filters">
      <input placeholder="Search..." onChange={onSearchChange} />

      <select onChange={onStatusChange} defaultValue="">
        <option value="">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select onChange={onPriorityChange} defaultValue="">
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </div>
  );
};

export default TaskFilters;