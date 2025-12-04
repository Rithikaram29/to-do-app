import { addDays, nextDay } from 'date-fns';
import type { VoiceParsedTask, TaskPriority, TaskStatus } from '../types/task';

const PRIORITY_KEYWORDS: Record<string, TaskPriority> = {
  'high priority': 'high',
  'low priority': 'low',
  urgent: 'high',
  critical: 'critical',
  high: 'high',
  low: 'low',
  medium: 'medium',
};

const STATUS_KEYWORDS: Record<string, TaskStatus> = {
  'in progress': 'in_progress',
  done: 'done',
  completed: 'done',
  'to do': 'todo',
};

export function parseVoiceLocally(transcript: string): VoiceParsedTask {
  const lower = transcript.toLowerCase();
  let priority: TaskPriority | undefined;
  let status: TaskStatus = 'todo';
  let dueDate: string | undefined;

  // Priority detection
  for (const [key, value] of Object.entries(PRIORITY_KEYWORDS)) {
    if (lower.includes(key)) {
      priority = value;
      break;
    }
  }

  // Status detection
  for (const [key, value] of Object.entries(STATUS_KEYWORDS)) {
    if (lower.includes(key)) {
      status = value;
      break;
    }
  }

  const now = new Date();
  // const words = lower.split(/\s+/);

  // Very simple relative date parsing (extend as needed)
  if (lower.includes('tomorrow')) {
    dueDate = addDays(now, 1).toISOString();
  } else if (lower.includes('next week')) {
    dueDate = addDays(now, 7).toISOString();
  } else if (lower.includes('in 3 days')) {
    dueDate = addDays(now, 3).toISOString();
  } else if (lower.includes('next monday')) {
    dueDate = nextDay(now, 1).toISOString(); // 0=Sunday,1=Monday
  }

  // Title extraction heuristic: remove prefixes like "create", "remind me to"
  let title = transcript;

  const PREFIXES = [
    'create a',
    'create an',
    'create task to',
    'create task',
    'remind me to',
    'remind me',
    'add a task to',
  ];

  for (const prefix of PREFIXES) {
    if (lower.startsWith(prefix)) {
      title = transcript.slice(prefix.length).trim();
      break;
    }
  }

  // Trim parts about due date and priority from the end (very rough)
  title = title.replace(/by (tomorrow|next week|next monday|friday|monday).*/i, '').trim();
  title = title.replace(/it's (high|low|medium|critical) priority.*/i, '').trim();

  if (!title) {
    title = transcript; // fallback
  }

  return {
    transcript,
    title,
    dueDate,
    priority,
    status,
  };
}