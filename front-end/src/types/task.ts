export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO string
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface VoiceParsedTask {
  transcript: string;
  title: string;
  dueDate?: string;
  priority?: TaskPriority;
  status: TaskStatus;
}