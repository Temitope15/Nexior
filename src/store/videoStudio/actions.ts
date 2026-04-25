import axios, { AxiosError } from 'axios';
import { ActionContext } from 'vuex';
import { IVideoStudioState } from './models';
import { IRootState } from '../common/models';
import { ISunoAudioResponse, IProducerAudioResponse, ILumaGenerateResponse } from '@/models';
import { sunoOperator, producerOperator, lumaOperator } from '@/operators';
import { scriptGeneratorOperator } from '@/operators/scriptGenerator';
import {
  VIDEO_STUDIO_SUNO_MODEL,
  VIDEO_STUDIO_PRODUCER_MODEL,
  VIDEO_STUDIO_SUNO_CALLBACK,
  VIDEO_STUDIO_PRODUCER_CALLBACK,
  VIDEO_STUDIO_LUMA_CALLBACK,
  VIDEO_STUDIO_POLL_INTERVAL_MS,
  VIDEO_STUDIO_POLL_MAX_ATTEMPTS,
  VIDEO_STUDIO_VIDEO_POLL_MAX_ATTEMPTS
} from '@/constants/videoStudio';

// Always-prefix the error with a short, scannable hint about what likely went wrong.
// AceData's 403 doesn't always include a specific code in the body, so we infer from status.
export interface IClassifiedError {
  message: string;
  hint: 'balance' | 'auth' | 'rate_limit' | 'unknown';
  status?: number;
}
function extractApiError(err: unknown, fallback: string): string {
  return classifyApiError(err, fallback).message;
}
function classifyApiError(err: unknown, fallback: string): IClassifiedError {
  const axErr = err as AxiosError<{ error?: { message?: string; code?: string; type?: string }; trace_id?: string }>;
  const status = axErr?.response?.status;
  const data = axErr?.response?.data;
  const apiMsg = data?.error?.message || data?.error?.code || data?.error?.type;
  const trace = data?.trace_id;

  let hint: IClassifiedError['hint'] = 'unknown';
  let prefix = '';
  if (status === 403) {
    hint = 'balance';
    prefix = 'Forbidden — likely balance exhausted or model not enabled on this key.';
  } else if (status === 401) {
    hint = 'auth';
    prefix = 'Unauthorized — your AceData key looks invalid or expired.';
  } else if (status === 429) {
    hint = 'rate_limit';
    prefix = 'Rate limited — too many requests in a short window.';
  }

  let message: string;
  if (apiMsg && prefix) {
    message = `${prefix} ${apiMsg}`;
  } else if (apiMsg) {
    message = apiMsg;
  } else if (prefix) {
    message = prefix;
  } else if (err instanceof Error) {
    message = err.message;
  } else {
    message = fallback;
  }
  if (trace) message += ` (trace_id=${trace})`;
  return { message, hint, status };
}

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
  const step = state.steps.find((s) => s.id === 'script');
  if (step?.status === 'done' && state.scriptOutput) {
    console.info('[VideoStudio] ✓ script: skip (already done — saves Gemini credits)');
    return;
  }
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
  const step = state.steps.find((s) => s.id === 'music');
  if (step?.status === 'done' && step.output?.audio_id) {
    console.info('[VideoStudio] ✓ music: skip (already done — saves Suno credits)');
    return step.output.audio_id as string;
  }
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
  const step = state.steps.find((s) => s.id === 'voiceover');
  if (step?.status === 'done') {
    console.info('[VideoStudio] ✓ voiceover: skip (already done — saves Producer credits)');
    return;
  }
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

// Generate video using Luma Dream Machine.
// Async-submit → poll. callback_url makes the initial POST return a task_id immediately
// instead of holding the connection 1–2 min (which was causing api_error on dropped connections).
async function generateVideo({ commit, state }: Context): Promise<void> {
  if (!state.scriptOutput) throw new Error('Script output required for video generation');

  const videoStep = state.steps.find((s) => s.id === 'video');
  if (videoStep?.status === 'done') {
    console.info('[VideoStudio] ✓ video: skip (already done — saves Luma credits)');
    return;
  }
  // Idempotency guard: if a Luma task is already in flight from a prior run, resume polling
  // instead of submitting again — re-submitting double-charges the user for no reason.
  let taskId = videoStep?.taskId;

  if (!taskId) {
    console.info('[VideoStudio] ► video: submit Luma');
    commit('setStepStatus', { id: 'video', status: 'running' });
    try {
      const res = await lumaOperator.generate(
        {
          prompt: state.scriptOutput.hook || 'Create an engaging short-form video',
          callback_url: VIDEO_STUDIO_LUMA_CALLBACK
        },
        { token: state.apiKey }
      );
      taskId = res.data?.task_id;
      const immediateUrl = res.data?.video_url;
      const apiError = res.data?.error?.message;

      if (apiError) throw new Error(apiError);

      // Sync mode can occasionally return the URL directly even with callback_url set.
      if (immediateUrl) {
        console.info('[VideoStudio] ✓ video: done (immediate)', { videoUrl: immediateUrl });
        commit('setStepOutput', { id: 'video', output: { video_url: immediateUrl, task_id: taskId } });
        commit('setFinalUrls', { videoUrl: immediateUrl });
        commit('setStepStatus', { id: 'video', status: 'done' });
        return;
      }

      if (!taskId) throw new Error('Luma returned no task_id and no video_url');

      commit('setStepTaskId', { id: 'video', taskId });
    } catch (err: unknown) {
      const msg = extractApiError(err, 'Video generation failed');
      console.error('[VideoStudio] ✕ video: submit failed', err);
      commit('setStepStatus', { id: 'video', status: 'error', error: msg });
      throw err;
    }
  } else {
    console.info('[VideoStudio] ► video: resume polling existing task', { taskId });
  }

  commit('setStepStatus', { id: 'video', status: 'polling' });

  try {
    const finalVideoUrl = await pollUntil(async () => {
      let lumaResponse: ILumaGenerateResponse | undefined;
      try {
        const taskRes = await lumaOperator.task(taskId as string, { token: state.apiKey });
        lumaResponse = taskRes.data.response as ILumaGenerateResponse | undefined;
      } catch (e) {
        // Transient poll error (network blip / 5xx). Read calls are cheap — keep polling.
        console.warn('[VideoStudio] video: poll error (continuing)', e);
        return null;
      }
      const url = lumaResponse?.video_url;
      const lumaState = lumaResponse?.state;
      console.info('[VideoStudio] video: poll', { lumaState, hasUrl: !!url });

      // Fail fast — no point polling for 5 more minutes if Luma already said it failed.
      if (lumaState === 'failed') {
        const errMsg = lumaResponse?.error?.message || 'Luma reported state=failed';
        throw new Error(errMsg);
      }
      return url || null;
    }, VIDEO_STUDIO_VIDEO_POLL_MAX_ATTEMPTS);

    console.info('[VideoStudio] ✓ video: done (polled)', { videoUrl: finalVideoUrl });
    commit('setStepOutput', { id: 'video', output: { video_url: finalVideoUrl, task_id: taskId } });
    commit('setFinalUrls', { videoUrl: finalVideoUrl });
    commit('setStepStatus', { id: 'video', status: 'done' });
  } catch (err: unknown) {
    const msg = extractApiError(err, 'Video generation failed');
    console.error('[VideoStudio] ✕ video: poll failed', err);
    // Keep the task_id on the step so the user can retry without paying for a new submission.
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
  const { commit, state } = context;
  console.info('[VideoStudio] Pipeline: START');
  // If the idea changed since the last run, do a full reset. Otherwise keep done steps so
  // a retry after partial failure resumes from where it stopped instead of re-billing
  // already-paid steps (script, music, voiceover can each cost real credits).
  const ideaChanged = state.lastRunIdea !== state.config.idea;
  if (ideaChanged) {
    console.info('[VideoStudio] Pipeline: idea changed — full reset');
    commit('resetPipeline');
  } else {
    console.info('[VideoStudio] Pipeline: same idea — resuming from last failure point');
    commit('resetIncompleteSteps');
  }
  commit('setLastRunIdea', state.config.idea);
  commit('setTotalCost');

  try {
    await generateScript(context);
    await generateMusic(context);

    // Sequential — voiceover before video. Two reasons:
    //  1) Clearer UX: users read the shot list top-to-bottom and expect that order.
    //  2) Cost: if voiceover fails (cheap), we don't waste the $0.10 Luma submit.
    await generateVoiceover(context);
    await generateVideo(context);

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
