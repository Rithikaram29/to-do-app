import React from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useSelector } from "react-redux";
import TaskColumn from "./TaskColumn";
import type { TaskStatus } from "../../types/task";
import { useAppDispatch } from "../../hooks/useRedux";
import { moveTask, setTasks } from "../../store/taskSlice";
import { updateTaskApi, deleteTaskApi, fetchTasks } from "../../api/taskApi"; // 👈 add deleteTaskApi

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
      // First update local Redux state so UI moves the card
      dispatch(
        moveTask({
          id: taskId,
          status: newStatus,
        }),
      );
      // Then update in backend
      await updateTaskApi(taskId, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task status on drag:", err);
    }
  };

  // 👇 NEW: delete handler used by the Delete button on done cards
  const handleDeleteTask = async (taskId: string) => {
    console.log("triggering delete task")
    try {
      await deleteTaskApi(taskId);

      const latestTasks = await fetchTasks();
      dispatch(setTasks(latestTasks));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="task-board">
        <TaskColumn
          status="todo"
          title="To Do"
          tasks={tasks.filter((t: any) => t.status === "todo")}
          onDeleteTask={handleDeleteTask} // 👈 pass handler
        />
        <TaskColumn
          status="in_progress"
          title="In Progress"
          tasks={tasks.filter((t: any) => t.status === "in_progress")}
          onDeleteTask={handleDeleteTask} // 👈 pass handler
        />
        <TaskColumn
          status="done"
          title="Done"
          tasks={tasks.filter((t: any) => t.status === "done")}
          onDeleteTask={handleDeleteTask} // 👈 pass handler
        />
      </div>
    </DndContext>
  );
};

export default TaskBoard;