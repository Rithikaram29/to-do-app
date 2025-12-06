import React, { useEffect } from "react";
import Header from "./Header";
import TaskBoard from "../tasks/TaskBoard";
import TaskList from "../tasks/TaskList";
import TaskFilters from "../tasks/TaskFilters";
import TaskForm from "../tasks/TaskForm";
import VoiceReviewModal from "../voice/VoiceReviewModal";
import { useAppDispatch } from "../../hooks/useRedux";
import { setTasks } from "../../store/taskSlice";
import { fetchTasks } from "../../api/taskApi";
import VoiceChatAssistant from "../voice/VoiceChatAssistant";

const AppLayout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const tasks = await fetchTasks();
        dispatch(setTasks(tasks));
      } catch (err) {
        console.error("Failed to load tasks from backend", err);
      }
    })();
  }, [dispatch]);

  return (
    <div className="app-root">
      <Header />
      <main>

        <section className="views">
          <div className="view">
            <h2 className="font-bold">Board View</h2>
            <TaskBoard />
          </div>
          <div className="view">
            <h2 className="font-bold">List View</h2>
            <TaskFilters />
            <TaskList />
          </div>
        </section>
      </main>
      <TaskForm />
      <VoiceReviewModal />
       <VoiceChatAssistant />
    </div>
  );
};

export default AppLayout;
