import React from 'react';
import { useAppDispatch } from '../../hooks/useRedux';
import { openTaskForm } from '../../store/uiSlice';
import VoiceInput from '../voice/VoiceInput';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <header className="app-header">
      <h1>Voice-Enabled Task Tracker</h1>
      <div className="header-actions">
        <button onClick={() => dispatch(openTaskForm(undefined))}>
          + Add Task
        </button>
        <VoiceInput />
      </div>
    </header>
  );
};

export default Header;