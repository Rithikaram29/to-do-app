import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { closeTaskForm } from '../../store/uiSlice';
import { useAppDispatch } from '../../hooks/useRedux';
import type { TaskPriority, TaskStatus } from '../../types/task';
import { createTask, updateTask } from '../../store/taskSlice';

const TaskForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showTaskForm, editingTaskId } = useSelector(
    (state: any) => state.ui
  );
  const tasks = useSelector((state: any) => state.tasks.items);

  const editingTask = tasks.find((t) => t.id === editingTaskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description ?? '');
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setDueDate(
        editingTask.dueDate ? editingTask.dueDate.slice(0, 16) : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
    }
  }, [editingTask]);

  if (!showTaskForm) return null;

  const onClose = () => dispatch(closeTaskForm());

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      dispatch(
        updateTask({
          id: editingTask.id,
          changes: {
            title,
            description,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          },
        })
      );
    } else {
      dispatch(
        createTask({
          title,
          description,
          status,
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        })
      );
    }

    dispatch(closeTaskForm());
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={onSubmit}>
        <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>

        <div className="field">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="field">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="field">
          <label>Due Date</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">
            {editingTask ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;