import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './taskSlice';
import uiReducer from './uiSlice';
import parserReducer from './parserSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ui: uiReducer,
    parser: parserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;