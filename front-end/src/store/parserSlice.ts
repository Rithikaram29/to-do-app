import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ParserId, ParserOption } from '../types/parser';

interface ParserState {
  options: ParserOption[];
  selectedId: ParserId;
}

const initialState: ParserState = {
  options: [
    {
      id: 'local_rules',
      label: 'Local Rules',
      description: 'Fast, offline heuristic parser running in the browser.',
      isRemote: false,
    },
    {
      id: 'openai',
      label: 'OpenAI LLM',
      description: 'Cloud AI parser (will use OpenAI in backend).',
      isRemote: true,
    },
    {
      id: 'gemini',
      label: 'Gemini LLM',
      description: 'Cloud AI parser (will use Gemini in backend).',
      isRemote: true,
    },
  ],
  selectedId: 'local_rules',
};

const parserSlice = createSlice({
  name: 'parser',
  initialState,
  reducers: {
    setSelectedParser(state, action: PayloadAction<ParserId>) {
      state.selectedId = action.payload;
    },
    // if later you want to load options from backend:
    setParserOptions(state, action: PayloadAction<ParserOption[]>) {
      state.options = action.payload;
      if (!state.options.find((o) => o.id === state.selectedId)) {
        state.selectedId = state.options[0]?.id ?? 'local_rules';
      }
    },
  },
});

export const { setSelectedParser, setParserOptions } = parserSlice.actions;
export default parserSlice.reducer;