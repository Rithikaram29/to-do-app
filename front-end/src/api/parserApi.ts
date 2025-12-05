import { apiClient } from './client';
import type { ParserId } from '../types/parser';
import type { VoiceParsedTask } from '../types/task';

export const parseWithBackendParser = async (
  parserId: ParserId,
  transcript: string
): Promise<VoiceParsedTask> => {
  const res = await apiClient.post('/voice/parse', {
    parserId,
    transcript,
  });
  return res.data;
};