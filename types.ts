export interface GeneratedCodeResponse {
  code: string;
  explanation: string;
  language: string;
}

export enum ViewMode {
  CODE = 'CODE',
  PREVIEW = 'PREVIEW',
  SPLIT = 'SPLIT'
}

export interface HistoryItem {
  id: string;
  prompt: string;
  response: GeneratedCodeResponse;
  timestamp: number;
}