import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { closeTaskForm } from "../../store/uiSlice";
import { useAppDispatch } from "../../hooks/useRedux";
import type { TaskPriority, TaskStatus } from "../../types/task";
import { setTasks } from "../../store/taskSlice";
import { createTaskApi, updateTaskApi, fetchTasks } from "../../api/taskApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TaskForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showTaskForm, editingTaskId } = useSelector((state: any) => state.ui);
  const tasks = useSelector((state: any) => state.tasks.items);

  const editingTask = tasks.find((t: any) => t.id === editingTaskId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description ?? "");
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate ? editingTask.dueDate.slice(0, 16) : "");
    } else {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setDueDate("");
    }
  }, [editingTask]);

  if (!showTaskForm) return null;

  const onClose = () => dispatch(closeTaskForm());

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      if (editingTask) {
        // UPDATE via backend (Supabase)
        await updateTaskApi(editingTask.id, {
          title,
          description,
          status,
          priority,
          dueDate: dueDate || undefined,
        });
      } else {
        // CREATE via backend (Supabase)
        await createTaskApi({
          title,
          description,
          status,
          priority,
          dueDate: dueDate || undefined,
        });
      }

      // After saving, fetch fresh tasks from backend and hydrate Redux
      const latestTasks = await fetchTasks();
      dispatch(setTasks(latestTasks));
    } catch (err) {
      console.error("Failed to save task:", err);
    }

    console.log("calling_close_task_form");
    dispatch(closeTaskForm());
    setIsLoading(false);
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={onSubmit}>
        <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>

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
          {/* <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          /> */}
          <DatePicker
            selected={dueDate ? new Date(dueDate) : null}
            onChange={(date: Date | null) =>
              setDueDate(date ? date.toISOString().slice(0, 16) : "")
            }
            showTimeSelect // 👈 enable time picker
            timeFormat="HH:mm" // 👈 time format
            timeIntervals={15} // 👈 step in minutes
            timeCaption="Time" // 👈 label above time picker
            dateFormat="yyyy-MM-dd HH:mm" // 👈 how it shows in the input
            placeholderText="Select date & time"
            className="date-input"
          />
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">
            {editingTask ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
