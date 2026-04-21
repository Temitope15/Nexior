import { IVideoStudioConfig, IPipelineStep, IScriptOutput } from '@/models';

export interface IVideoStudioState {
  apiKey: string;
  config: IVideoStudioConfig;
  steps: IPipelineStep[];
  totalCostUsd: number;
  finalAudioUrl?: string;
  finalVideoUrl?: string;
  scriptOutput?: IScriptOutput;
}
