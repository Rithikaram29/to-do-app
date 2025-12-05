import React from "react";
import { useSelector } from "react-redux";
import { closeVoiceModal, updateVoiceDraft } from "../../store/uiSlice";
import type { TaskPriority, TaskStatus } from "../../types/task";
import { createTask } from "../../store/taskSlice";
import { useAppDispatch } from "../../hooks/useRedux";

const VoiceReviewModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { voiceModalOpen, voiceDraft } = useSelector((state: any) => state.ui);

  if (!voiceModalOpen || !voiceDraft) return null;

  const onClose = () => {
    dispatch(closeVoiceModal());
  };

  const onCreate = () => {
    if (!voiceDraft.title.trim()) return;

    dispatch(
      createTask({
        title: voiceDraft.title,
        priority: (voiceDraft.priority ?? "medium") as TaskPriority,
        status: (voiceDraft.status ?? "todo") as TaskStatus,
        dueDate: voiceDraft.dueDate,
      })
    );
    dispatch(closeVoiceModal());
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateVoiceDraft({ title: e.target.value }));
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateVoiceDraft({ priority: e.target.value as TaskPriority }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateVoiceDraft({ status: e.target.value as TaskStatus }));
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // "YYYY-MM-DDTHH:mm"
    const iso = value ? new Date(value).toISOString() : undefined;
    dispatch(updateVoiceDraft({ dueDate: iso }));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Review Voice Task</h2>

        <div className="field">
          <label>Transcript</label>
          <p className="transcript-box">{voiceDraft.transcript}</p>
        </div>

        <div className="field">
          <label>Title</label>
          <input
            value={voiceDraft.title ?? ""}
            onChange={handleTitleChange}
            placeholder="Task title"
          />
        </div>

        <div className="field">
          <label>Priority</label>
          <select
            value={voiceDraft.priority ?? "medium"}
            onChange={handlePriorityChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="field">
          <label>Status</label>
          <select
            value={voiceDraft.status ?? "todo"}
            onChange={handleStatusChange}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="field">
          <label>Due Date</label>
          <input
            type="datetime-local"
            value={voiceDraft.dueDate ? voiceDraft.dueDate.slice(0, 16) : ""}
            onChange={handleDueDateChange}
          />
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={onCreate}
            disabled={!voiceDraft.title || !voiceDraft.title.trim()}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceReviewModal;