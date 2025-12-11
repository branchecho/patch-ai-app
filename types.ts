export interface ScenarioOption {
  id: string;
  label: string;
  prompt: string;
  icon: string; // Emoji for simplicity
}

export interface GenerationResult {
  imageUrl: string | null;
  error: string | null;
}

export enum LoadingState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}