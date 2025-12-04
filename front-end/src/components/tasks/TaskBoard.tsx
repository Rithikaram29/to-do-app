import React from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useSelector } from 'react-redux';
import TaskColumn from './TaskColumn';
import type { TaskStatus } from '../../types/task';
import { useAppDispatch } from '../../hooks/useRedux';
import { moveTask } from '../../store/taskSlice';

const TaskBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useSelector((state: any) => state.tasks.items);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    dispatch(
      moveTask({
        id: taskId,
        status: newStatus,
      })
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="task-board">
        <TaskColumn
          status="todo"
          title="To Do"
          tasks={tasks.filter((t: any) => t.status === 'todo')}
        />
        <TaskColumn
          status="in_progress"
          title="In Progress"
          tasks={tasks.filter((t: any) => t.status === 'in_progress')}
        />
        <TaskColumn
          status="done"
          title="Done"
          tasks={tasks.filter((t: any) => t.status === 'done')}
        />
      </div>
    </DndContext>
  );
};

export default TaskBoard;