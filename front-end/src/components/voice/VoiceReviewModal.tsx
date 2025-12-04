import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { closeVoiceModal } from '../../store/uiSlice';
import type { TaskPriority, TaskStatus } from '../../types/task';
import { createTask } from '../../store/taskSlice';
import { useAppDispatch } from '../../hooks/useRedux';

const VoiceReviewModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { voiceModalOpen, voiceDraft } = useSelector(
    (state: any) => state.ui
  );

  const [title, setTitle] = useState(voiceDraft?.title ?? '');
  const [priority, setPriority] = useState<TaskPriority>(
    voiceDraft?.priority ?? 'medium'
  );
  const [status, setStatus] = useState<TaskStatus>(
    voiceDraft?.status ?? 'todo'
  );
  const [dueDate, setDueDate] = useState(
    voiceDraft?.dueDate ? voiceDraft.dueDate.slice(0, 16) : ''
  ); // for datetime-local

  if (!voiceModalOpen || !voiceDraft) return null;

  const onClose = () => {
    dispatch(closeVoiceModal());
  };

  const onCreate = () => {
    dispatch(
      createTask({
        title,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      })
    );
    dispatch(closeVoiceModal());
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
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
          <label>Due Date</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onCreate} disabled={!title.trim()}>
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceReviewModal;