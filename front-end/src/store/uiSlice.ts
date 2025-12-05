// uiSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { VoiceParsedTask } from '../types/task';


interface UiState {
  showTaskForm: boolean;
  editingTaskId: string | null;
  voiceModalOpen: boolean;
  voiceDraft: VoiceParsedTask | null;
}

const initialState: UiState = {
  showTaskForm: false,
  editingTaskId: null,
  voiceModalOpen: false,
  voiceDraft: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openTaskForm(state, action: PayloadAction<{ taskId?: string } | undefined>) {
      state.showTaskForm = true;
      state.editingTaskId = action.payload?.taskId ?? null;
    },
    closeTaskForm(state) {
      state.showTaskForm = false;
      state.editingTaskId = null;
    },
    openVoiceModal(state, action: PayloadAction<VoiceParsedTask>) {
      state.voiceDraft = action.payload;
      state.voiceModalOpen = true;
    },
    closeVoiceModal(state) {
      state.voiceModalOpen = false;
      state.voiceDraft = null;
    },
    // ✅ new
    updateVoiceDraft(state, action: PayloadAction<Partial<VoiceParsedTask>>) {
      if (!state.voiceDraft) return;
      state.voiceDraft = {
        ...state.voiceDraft,
        ...action.payload,
      };
    },
  },
});

export const {
  openTaskForm,
  closeTaskForm,
  openVoiceModal,
  closeVoiceModal,
  updateVoiceDraft,   
} = uiSlice.actions;

export default uiSlice.reducer;