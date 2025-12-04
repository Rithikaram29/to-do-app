import React from 'react';
import Header from './Header';
import TaskBoard from '../tasks/TaskBoard';
import TaskList from '../tasks/TaskList';
import TaskFilters from '../tasks/TaskFilters';
import TaskForm from '../tasks/TaskForm';
import VoiceReviewModal from '../voice/VoiceReviewModal';

const AppLayout: React.FC = () => {
  return (
    <div className="app-root">
      <Header />
      <main>
        <TaskFilters />
        <section className="views">
          <div className="view">
            <h2>Board View</h2>
            <TaskBoard />
          </div>
          <div className="view">
            <h2>List View</h2>
            <TaskList />
          </div>
        </section>
      </main>
      <TaskForm />
      <VoiceReviewModal />
    </div>
  );
};

export default AppLayout;