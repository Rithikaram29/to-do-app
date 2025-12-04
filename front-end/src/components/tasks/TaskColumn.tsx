import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';
import type { Task, TaskStatus } from '../../types/task';

interface Props {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

const TaskColumn: React.FC<Props> = ({ status, title, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="task-column">
      <h3>{title}</h3>
      <div
        className="task-column-inner"
        ref={setNodeRef}
        style={{
          backgroundColor: isOver ? 'rgba(59,130,246,0.1)' : undefined,
        }}
      >
        {tasks.map((task) => (
          <DraggableTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

interface DraggableTaskCardProps {
  task: Task;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style: React.CSSProperties = {
    transform: transform
      ? CSS.Translate.toString(transform)
      : undefined,
    opacity: isDragging ? 0.6 : 1,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard task={task} />
    </div>
  );
};

export default TaskColumn;