import { ActionContext } from 'vuex';
import { IVideoStudioState } from './models';
import { IRootState } from '../common/models';
import {
  ISunoAudioResponse,
  IProducerAudioResponse,
  IProducerVideoResponse
} from '@/models';
import { sunoOperator, producerOperator } from '@/operators';
import { scriptGeneratorOperator } from '@/operators/scriptGenerator';
import {
  VIDEO_STUDIO_SUNO_MODEL,
  VIDEO_STUDIO_PRODUCER_MODEL,
  VIDEO_STUDIO_SUNO_CALLBACK,
  VIDEO_STUDIO_PRODUCER_CALLBACK,
  VIDEO_STUDIO_POLL_INTERVAL_MS,
  VIDEO_STUDIO_POLL_MAX_ATTEMPTS
} from '@/constants/videoStudio';

type Context = ActionContext<IVideoStudioState, IRootState>;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollUntil<T>(
  fn: () => Promise<T | null>,
  maxAttempts = VIDEO_STUDIO_POLL_MAX_ATTEMPTS,
  intervalMs = VIDEO_STUDIO_POLL_INTERVAL_MS
): Promise<T> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await fn();
    if (result !== null) return result;
    await sleep(intervalMs);
  }
  throw new Error('Generation timed out. Please try again.');
}

async function generateScript({ commit, state }: Context): Promise<void> {
  commit('setStepStatus', { id: 'script', status: 'running' });
  try {
    const res = await scriptGeneratorOperator.generate(state.config.idea, { token: state.apiKey });
    const content = res.data.choices?.[0]?.message?.content ?? '';
    const output = scriptGeneratorOperator.parseScriptOutput(content);
    commit('setScriptOutput', output);
    commit('setStepOutput', { id: 'script', output: output as unknown as Record<string, unknown> });
    commit('setStepStatus', { id: 'script', status: 'done' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Script generation failed';
    commit('setStepStatus', { id: 'script', status: 'error', error: msg });
    throw err;
  }
}

async function generateMusic({ commit, state }: Context): Promise<string> {
  if (!state.scriptOutput) throw new Error('Script output missing');
  commit('setStepStatus', { id: 'music', status: 'running' });
  try {
    const prompt = state.config.musicStyle
      ? `${state.scriptOutput.musicPrompt}, ${state.config.musicStyle}`
      : state.scriptOutput.musicPrompt;

    const res = await sunoOperator.audio(
      {
        action: 'generate',
        prompt,
        model: VIDEO_STUDIO_SUNO_MODEL,
        instrumental: state.config.instrumental,
        callback_url: VIDEO_STUDIO_SUNO_CALLBACK
      },
      { token: state.apiKey }
    );
    const taskId = res.data.task_id;
    commit('setStepTaskId', { id: 'music', taskId });
    commit('setStepStatus', { id: 'music', status: 'polling' });

    const audioUrl = await pollUntil(async () => {
      const taskRes = await sunoOperator.task(taskId, { token: state.apiKey });
      const audioData = (taskRes.data.response as ISunoAudioResponse)?.data;
      return audioData?.[0]?.audio_url ?? null;
    });

    commit('setStepOutput', { id: 'music', output: { audio_url: audioUrl } });
    commit('setFinalUrls', { audioUrl });
    commit('setStepStatus', { id: 'music', status: 'done' });
    return audioUrl;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Music generation failed';
    commit('setStepStatus', { id: 'music', status: 'error', error: msg });
    throw err;
  }
}

async function generateVoiceover({ commit, state }: Context): Promise<string> {
  if (!state.scriptOutput) throw new Error('Script output missing');
  commit('setStepStatus', { id: 'voiceover', status: 'running' });
  try {
    const res = await producerOperator.audio(
      {
        action: 'generate',
        prompt: state.scriptOutput.voiceoverText,
        model: VIDEO_STUDIO_PRODUCER_MODEL,
        vocal_gender: state.config.voiceGender,
        callback_url: VIDEO_STUDIO_PRODUCER_CALLBACK
      },
      { token: state.apiKey }
    );
    const taskId = res.data.task_id;
    commit('setStepTaskId', { id: 'voiceover', taskId });
    commit('setStepStatus', { id: 'voiceover', status: 'polling' });

    const { audioUrl, audioId } = await pollUntil(async () => {
      const taskRes = await producerOperator.task(taskId, { token: state.apiKey });
      const audioData = (taskRes.data.response as IProducerAudioResponse)?.data;
      const first = audioData?.[0];
      if (first?.audio_url && first?.id) {
        return { audioUrl: first.audio_url, audioId: first.id };
      }
      return null;
    });

    commit('setStepOutput', { id: 'voiceover', output: { audio_url: audioUrl, audio_id: audioId } });
    commit('setStepStatus', { id: 'voiceover', status: 'done' });
    return audioId;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Voiceover generation failed';
    commit('setStepStatus', { id: 'voiceover', status: 'error', error: msg });
    throw err;
  }
}

async function generateVideo({ commit, state }: Context, audioId: string): Promise<void> {
  commit('setStepStatus', { id: 'video', status: 'running' });
  try {
    const res = await producerOperator.video({ audio_id: audioId }, { token: state.apiKey });
    const taskId = res.data.task_id;
    commit('setStepTaskId', { id: 'video', taskId });
    commit('setStepStatus', { id: 'video', status: 'polling' });

    const videoUrl = await pollUntil(async () => {
      const taskRes = await producerOperator.task(taskId, { token: state.apiKey });
      const videoData = (taskRes.data.response as unknown as IProducerVideoResponse)?.data;
      return videoData?.video_url ?? null;
    });

    commit('setStepOutput', { id: 'video', output: { video_url: videoUrl } });
    commit('setFinalUrls', { videoUrl });
    commit('setStepStatus', { id: 'video', status: 'done' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Video generation failed';
    commit('setStepStatus', { id: 'video', status: 'error', error: msg });
    throw err;
  }
}

export const setApiKey = ({ commit }: Context, apiKey: string): void => {
  commit('setApiKey', apiKey);
};

export const setConfig = ({ commit }: Context, config: Partial<IVideoStudioState['config']>): void => {
  commit('setConfig', config);
};

export const resetPipeline = ({ commit }: Context): void => {
  commit('resetPipeline');
};

export const runPipeline = async (context: Context): Promise<void> => {
  const { commit } = context;
  commit('resetPipeline');
  commit('setTotalCost');

  await generateScript(context);
  await generateMusic(context);
  const audioId = await generateVoiceover(context);
  await generateVideo(context, audioId);
};
