import { IVideoStudioConfig, IPipelineStep, IScriptOutput, IGenerationRecord } from '@/models';

export interface IVideoStudioState {
  apiKey: string;
  config: IVideoStudioConfig;
  steps: IPipelineStep[];
  totalCostUsd: number;
  finalAudioUrl?: string;
  finalVideoUrl?: string;
  scriptOutput?: IScriptOutput;
  history: IGenerationRecord[];
}
