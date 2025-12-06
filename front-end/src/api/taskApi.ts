import { apiClient } from './client';
import type { ChatVoiceParsedTask, Task } from '../types/task';

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await apiClient.get('/tasks');
  return res.data;
};

export const createTaskApi = async (task: Partial<Task>): Promise<Task> => {
  const res = await apiClient.post('/tasks', task);
  return res.data;
};

export const updateTaskApi = async (
  id: string,
  changes: Partial<Task>
): Promise<Task> => {
  const res = await apiClient.put(`/tasks/${id}`, changes);
  return res.data;
};

export const deleteTaskApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};

export const parseVoiceApi = async ({transcript, parserId}:
  {transcript: string,
  parserId: string}
): Promise<ChatVoiceParsedTask> => {
  const res = await apiClient.post('/voice/parse', {
    parserId,
    transcript,
  });
  return res.data;
};