export type IPipelineStepId = 'script' | 'music' | 'voiceover' | 'video';

export type IPipelineStepStatus = 'idle' | 'running' | 'polling' | 'done' | 'error';

export interface IPipelineStep {
  id: IPipelineStepId;
  label: string;
  description: string;
  status: IPipelineStepStatus;
  taskId?: string;
  output?: Record<string, unknown>;
  costUsd: number;
  error?: string;
}

export interface IScriptOutput {
  hook: string;
  body: string;
  cta: string;
  musicPrompt: string;
  voiceoverText: string;
}

export interface IVideoStudioConfig {
  idea: string;
  musicStyle: string;
  voiceGender: 'male' | 'female';
  instrumental: boolean;
}

export interface IVideoStudioState {
  apiKey: string;
  config: IVideoStudioConfig;
  steps: IPipelineStep[];
  totalCostUsd: number;
  finalAudioUrl?: string;
  finalVideoUrl?: string;
  scriptOutput?: IScriptOutput;
}

export interface IGeminiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface IGeminiCompletionResponse {
  id: string;
  model: string;
  object: string;
  choices: Array<{
    message: IGeminiMessage;
    finish_reason: string;
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
