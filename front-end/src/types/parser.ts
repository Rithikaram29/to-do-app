export type ParserId = 'local_rules' | 'openai' | 'gemini';

export interface ParserOption {
  id: ParserId;
  label: string;
  description: string;
  isRemote: boolean; // true = goes through backend/LLM
}