import axios from 'axios';
import { ActionContext } from 'vuex';
import { IVideoStudioState } from './models';
import { IRootState } from '../common/models';
import { ISunoAudioResponse, IProducerAudioResponse } from '@/models';
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
  console.info('[VideoStudio] ► script: start', { idea: state.config.idea });
  commit('setStepStatus', { id: 'script', status: 'running' });
  try {
    const content = await scriptGeneratorOperator.generate(state.config.idea, { token: state.apiKey });
    const output = scriptGeneratorOperator.parseScriptOutput(content);
    console.info('[VideoStudio] ✓ script: done', output);
    commit('setScriptOutput', output);
    commit('setStepOutput', { id: 'script', output: output as unknown as Record<string, unknown> });
    commit('setStepStatus', { id: 'script', status: 'done' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Script generation failed';
    console.error('[VideoStudio] ✕ script: failed', err);
    commit('setStepStatus', { id: 'script', status: 'error', error: msg });
    throw err;
  }
}

// Returns the Suno audio ID (needed for video generation via sunoOperator.mp4)
async function generateMusic({ commit, state }: Context): Promise<string> {
  if (!state.scriptOutput) throw new Error('Script output missing');
  console.info('[VideoStudio] ► music: start');
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
    console.info('[VideoStudio] ► music: submitted', { taskId });
    commit('setStepTaskId', { id: 'music', taskId });
    commit('setStepStatus', { id: 'music', status: 'polling' });

    const { audioUrl, sunoAudioId } = await pollUntil(async () => {
      const taskRes = await sunoOperator.task(taskId, { token: state.apiKey });
      const audioData = (taskRes.data.response as ISunoAudioResponse)?.data;
      const first = audioData?.[0];
      if (first?.audio_url && first?.id) {
        return { audioUrl: first.audio_url, sunoAudioId: first.id };
      }
      return null;
    });

    console.info('[VideoStudio] ✓ music: done', { sunoAudioId, audioUrl });
    commit('setStepOutput', { id: 'music', output: { audio_url: audioUrl, audio_id: sunoAudioId } });
    commit('setFinalUrls', { audioUrl });
    commit('setStepStatus', { id: 'music', status: 'done' });
    return sunoAudioId;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Music generation failed';
    console.error('[VideoStudio] ✕ music: failed', err);
    commit('setStepStatus', { id: 'music', status: 'error', error: msg });
    throw err;
  }
}

async function generateVoiceover({ commit, state }: Context): Promise<void> {
  if (!state.scriptOutput) throw new Error('Script output missing');
  console.info('[VideoStudio] ► voiceover: start');
  commit('setStepStatus', { id: 'voiceover', status: 'running' });
  try {
    const res = await producerOperator.audio(
      {
        action: 'generate',
        custom: true,
        lyric: state.scriptOutput.voiceoverText,
        prompt: `cinematic spoken word, ${state.config.voiceGender} vocal, motivational narration, clear voice`,
        model: VIDEO_STUDIO_PRODUCER_MODEL,
        vocal_gender: state.config.voiceGender,
        instrumental: false,
        callback_url: VIDEO_STUDIO_PRODUCER_CALLBACK
      },
      { token: state.apiKey }
    );
    const taskId = res.data.task_id;
    commit('setStepTaskId', { id: 'voiceover', taskId });
    commit('setStepStatus', { id: 'voiceover', status: 'polling' });

    // Producer /tasks has a CORS misconfiguration in the browser — route through our proxy.
    const { audioUrl, audioId } = await pollUntil(async () => {
      const taskRes = await axios.post(
        '/acedata/producer/tasks',
        { action: 'retrieve', id: taskId },
        {
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${state.apiKey}`,
            'x-record-exempt': 'true'
          }
        }
      );
      const audioData = (taskRes.data.response as IProducerAudioResponse)?.data;
      const first = audioData?.[0];
      if (first?.audio_url && first?.id) {
        return { audioUrl: first.audio_url, audioId: first.id };
      }
      return null;
    });

    console.info('[VideoStudio] ✓ voiceover: done', { audioId, audioUrl });
    commit('setStepOutput', { id: 'voiceover', output: { audio_url: audioUrl, audio_id: audioId } });
    commit('setStepStatus', { id: 'voiceover', status: 'done' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Voiceover generation failed';
    console.error('[VideoStudio] ✕ voiceover: failed', err);
    commit('setStepStatus', { id: 'voiceover', status: 'error', error: msg });
    throw err;
  }
}

// Uses Suno mp4 endpoint — takes a Suno audio_id, returns video_url synchronously
async function generateVideo({ commit, state }: Context, sunoAudioId: string): Promise<void> {
  console.info('[VideoStudio] ► video: start', { sunoAudioId });
  commit('setStepStatus', { id: 'video', status: 'running' });
  try {
    const res = await sunoOperator.mp4({ audio_id: sunoAudioId }, { token: state.apiKey });
    console.info('[VideoStudio] video: response', res.data);
    const taskId = res.data?.task_id;

    // mp4 may return the video_url directly or via task polling
    const directUrl = res.data?.data?.video_url;
    if (directUrl) {
      console.info('[VideoStudio] ✓ video: done (sync)', { videoUrl: directUrl });
      commit('setStepOutput', { id: 'video', output: { video_url: directUrl } });
      commit('setFinalUrls', { videoUrl: directUrl });
      commit('setStepStatus', { id: 'video', status: 'done' });
      return;
    }

    if (!taskId) throw new Error('No task ID returned from video generation');

    console.info('[VideoStudio] video: polling', { taskId });
    commit('setStepTaskId', { id: 'video', taskId });
    commit('setStepStatus', { id: 'video', status: 'polling' });

    const videoUrl = await pollUntil(async () => {
      const taskRes = await sunoOperator.task(taskId, { token: state.apiKey });
      const audioData = (taskRes.data.response as ISunoAudioResponse)?.data;
      return audioData?.[0]?.video_url ?? null;
    });

    console.info('[VideoStudio] ✓ video: done (async)', { videoUrl });
    commit('setStepOutput', { id: 'video', output: { video_url: videoUrl } });
    commit('setFinalUrls', { videoUrl });
    commit('setStepStatus', { id: 'video', status: 'done' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Video generation failed';
    console.error('[VideoStudio] ✕ video: failed', err);
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
  console.info('[VideoStudio] Pipeline: START');
  commit('resetPipeline');
  commit('setTotalCost');

  try {
    await generateScript(context);
    const sunoAudioId = await generateMusic(context);

    // Voiceover and video are independent — run in parallel for speed
    console.info('[VideoStudio] Pipeline: parallel [voiceover, video]');
    const results = await Promise.allSettled([
      generateVoiceover(context),
      generateVideo(context, sunoAudioId)
    ]);

    const voiceoverResult = results[0];
    const videoResult = results[1];

    if (voiceoverResult.status === 'rejected') {
      console.warn('[VideoStudio] Voiceover failed but video may succeed', voiceoverResult.reason);
    }
    if (videoResult.status === 'rejected') {
      console.error('[VideoStudio] Pipeline: FAILED - video generation critical', videoResult.reason);
      throw videoResult.reason;
    }

    console.info('[VideoStudio] Pipeline: SUCCESS');
  } catch (err) {
    console.error('[VideoStudio] Pipeline: FAILED', err);
    throw err;
  }
};

export default {
  setApiKey,
  setConfig,
  resetPipeline,
  runPipeline
};
