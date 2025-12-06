import React from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useSelector } from "react-redux";
import TaskColumn from "./TaskColumn";
import type { TaskStatus } from "../../types/task";
import { useAppDispatch } from "../../hooks/useRedux";
import { moveTask } from "../../store/taskSlice";
import { updateTaskApi } from "../../api/taskApi"; // 👈 NEW IMPORT

const TaskBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useSelector((state: any) => state.tasks.items);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Find the current task so we can avoid unnecessary calls
    const currentTask = (tasks as any[]).find((t: any) => t.id === taskId);
    if (!currentTask || currentTask.status === newStatus) return;

    try {
      // 2️⃣ Then update local Redux state so UI moves the card
      dispatch(
        moveTask({
          id: taskId,
          status: newStatus,
        })
      );
      // 1️⃣ Update in backend (Supabase via your API)
      await updateTaskApi(taskId, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status on drag:", err);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="task-board">
        <TaskColumn
          status="todo"
          title="To Do"
          tasks={tasks.filter((t: any) => t.status === "todo")}
        />
        <TaskColumn
          status="in_progress"
          title="In Progress"
          tasks={tasks.filter((t: any) => t.status === "in_progress")}
        />
        <TaskColumn
          status="done"
          title="Done"
          tasks={tasks.filter((t: any) => t.status === "done")}
        />
      </div>
    </DndContext>
  );
};

export default TaskBoard;
