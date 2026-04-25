import { IVideoStudioState } from './models';
import { IPipelineStep, IPipelineStepId, IPipelineStepStatus, IScriptOutput, IVideoStudioConfig, IGenerationRecord } from '@/models';
import { PIPELINE_COST_TABLE } from '@/constants/videoStudio';

export default {
  setApiKey(state: IVideoStudioState, apiKey: string): void {
    state.apiKey = apiKey;
  },

  setConfig(state: IVideoStudioState, config: Partial<IVideoStudioConfig>): void {
    state.config = { ...state.config, ...config };
  },

  setStepStatus(
    state: IVideoStudioState,
    payload: { id: IPipelineStepId; status: IPipelineStepStatus; error?: string }
  ): void {
    const step = state.steps.find((s) => s.id === payload.id);
    if (step) {
      step.status = payload.status;
      if (payload.error !== undefined) step.error = payload.error;
    }
  },

  setStepTaskId(state: IVideoStudioState, payload: { id: IPipelineStepId; taskId: string }): void {
    const step = state.steps.find((s) => s.id === payload.id);
    if (step) step.taskId = payload.taskId;
  },

  setStepOutput(
    state: IVideoStudioState,
    payload: { id: IPipelineStepId; output: Record<string, unknown> }
  ): void {
    const step = state.steps.find((s) => s.id === payload.id);
    if (step) step.output = payload.output;
  },

  setScriptOutput(state: IVideoStudioState, output: IScriptOutput): void {
    state.scriptOutput = output;
  },

  setFinalUrls(state: IVideoStudioState, payload: { audioUrl?: string; videoUrl?: string }): void {
    if (payload.audioUrl !== undefined) state.finalAudioUrl = payload.audioUrl;
    if (payload.videoUrl !== undefined) state.finalVideoUrl = payload.videoUrl;
  },

  setTotalCost(state: IVideoStudioState): void {
    state.totalCostUsd = Object.values(PIPELINE_COST_TABLE).reduce((sum, cost) => sum + cost, 0);
  },

  resetPipeline(state: IVideoStudioState): void {
    state.steps = state.steps.map((step): IPipelineStep => ({
      ...step,
      status: 'idle',
      taskId: undefined,
      output: undefined,
      error: undefined
    }));
    state.totalCostUsd = 0;
    state.finalAudioUrl = undefined;
    state.finalVideoUrl = undefined;
    state.scriptOutput = undefined;
    state.lastRunIdea = undefined;
  },

  // Clear only steps that aren't already 'done' so a retry resumes from the failure point
  // instead of re-billing successful steps. Also clears any final URLs that depend on
  // a non-done step (e.g. video URL if video step is being retried).
  resetIncompleteSteps(state: IVideoStudioState): void {
    state.steps = state.steps.map((step): IPipelineStep =>
      step.status === 'done'
        ? step
        : { ...step, status: 'idle', taskId: undefined, output: undefined, error: undefined }
    );
    const videoStep = state.steps.find((s) => s.id === 'video');
    if (videoStep?.status !== 'done') state.finalVideoUrl = undefined;
    const musicStep = state.steps.find((s) => s.id === 'music');
    if (musicStep?.status !== 'done') state.finalAudioUrl = undefined;
  },

  setLastRunIdea(state: IVideoStudioState, idea: string): void {
    state.lastRunIdea = idea;
  },

  addHistoryEntry(state: IVideoStudioState, entry: IGenerationRecord): void {
    state.history.unshift(entry);
    if (state.history.length > 50) {
      state.history.pop();
    }
  },

  clearHistory(state: IVideoStudioState): void {
    state.history = [];
  }
};
