import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskStatus, TaskPriority } from '../types/task';

interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
  filters: {
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string; // ISO (e.g. date-only)
    search?: string;
  };
}

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  filters: {},
};

interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

interface UpdateTaskPayload {
  id: string;
  changes: Partial<Omit<Task, 'id' | 'createdAt'>>;
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.items = action.payload;
    },
    createTask(state, action: PayloadAction<CreateTaskPayload>) {
      const now = new Date().toISOString();
      state.items.push({
        id: nanoid(),
        title: action.payload.title,
        description: action.payload.description,
        status: action.payload.status ?? 'todo',
        priority: action.payload.priority ?? 'medium',
        dueDate: action.payload.dueDate,
        createdAt: now,
        updatedAt: now,
      });
    },
    updateTask(state, action: PayloadAction<UpdateTaskPayload>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = {
          ...state.items[idx],
          ...action.payload.changes,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    moveTask(
      state,
      action: PayloadAction<{ id: string; status: TaskStatus; index?: number }>
    ) {
      const { id, status, index } = action.payload;
      const taskIndex = state.items.findIndex((t) => t.id === id);
      if (taskIndex === -1) return;

      const [task] = state.items.splice(taskIndex, 1);
      const updated = { ...task, status, updatedAt: new Date().toISOString() };

      if (typeof index === 'number') {
        // insert near tasks with same status
        let countBefore = 0;
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].status === status) {
            if (countBefore === index) {
              state.items.splice(i, 0, updated);
              return;
            }
            countBefore++;
          }
        }
      }

      state.items.push(updated);
    },
    setFilters(
      state,
      action: PayloadAction<Partial<TasksState['filters']>>
    ) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  setFilters,
} = tasksSlice.actions;

export default tasksSlice.reducer;