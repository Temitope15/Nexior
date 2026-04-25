import axios, { AxiosError } from 'axios';
import { ActionContext } from 'vuex';
import { IVideoStudioState } from './models';
import { IRootState } from '../common/models';
import { ISunoAudioResponse, IProducerAudioResponse } from '@/models';
import { sunoOperator, producerOperator } from '@/operators';
import { scriptGeneratorOperator } from '@/operators/scriptGenerator';
import { BASE_URL_API } from '@/constants';
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

// ─────────────────────────────────────────────────────────────────────
// Video provider fallback chain.
// AceData exposes ~9 video models. Any single key may have only a subset
// enabled — submitting to a disabled model returns 403. We iterate the
// list, falling through ONLY on permission errors (401/403), so the
// pipeline finishes on whichever model the user's key has access to.
// ─────────────────────────────────────────────────────────────────────
interface IVideoProvider {
  name: string;
  label: string;
  submitPath: string;
  taskPath: string;
}
const VIDEO_PROVIDERS: IVideoProvider[] = [
  { name: 'luma', label: 'Luma Dream Machine', submitPath: '/luma/videos', taskPath: '/luma/tasks' },
  { name: 'veo', label: 'Google Veo', submitPath: '/veo/videos', taskPath: '/veo/tasks' },
  { name: 'kling', label: 'Kuaishou Kling', submitPath: '/kling/videos', taskPath: '/kling/tasks' },
  { name: 'hailuo', label: 'MiniMax Hailuo', submitPath: '/hailuo/videos', taskPath: '/hailuo/tasks' },
  { name: 'seedance', label: 'ByteDance Seedance', submitPath: '/seedance/videos', taskPath: '/seedance/tasks' },
  { name: 'sora', label: 'OpenAI Sora', submitPath: '/sora/videos', taskPath: '/sora/tasks' },
  { name: 'wan', label: 'Tongyi Wanxiang', submitPath: '/wan/videos', taskPath: '/wan/tasks' },
  { name: 'pika', label: 'Pika', submitPath: '/pika/videos', taskPath: '/pika/tasks' },
  { name: 'pixverse', label: 'PixVerse', submitPath: '/pixverse/videos', taskPath: '/pixverse/tasks' }
];
async function submitVideoProvider(
  provider: IVideoProvider,
  prompt: string,
  callbackUrl: string,
  token: string
) {
  return axios.post(
    provider.submitPath,
    { prompt, callback_url: callbackUrl },
    {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${token}`
      },
      baseURL: BASE_URL_API
    }
  );
}
async function pollVideoProvider(
  provider: IVideoProvider,
  taskId: string,
  token: string
) {
  return axios.post(
    provider.taskPath,
    { action: 'retrieve', id: taskId },
    {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
        'x-record-exempt': 'true'
      },
      baseURL: BASE_URL_API
    }
  );
}

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

// Generate video — tries each provider in VIDEO_PROVIDERS until one accepts the submit.
// Falls through ONLY on 403/401 (key doesn't have that model enabled). Real errors bail.
async function generateVideo({ commit, state }: Context): Promise<void> {
  if (!state.scriptOutput) throw new Error('Script output required for video generation');

  const videoStep = state.steps.find((s) => s.id === 'video');
  if (videoStep?.status === 'done') {
    console.info('[VideoStudio] ✓ video: skip (already done — saves credits)');
    return;
  }

  const prompt = state.scriptOutput.hook || 'Create an engaging short-form video';

  // Idempotency: if a previous run already chose a provider and got a task_id, resume polling.
  const persistedProviderName = videoStep?.output?.provider as string | undefined;
  const persistedTaskId = videoStep?.taskId;

  let activeProvider: IVideoProvider | undefined;
  let taskId: string | undefined;

  if (persistedProviderName && persistedTaskId) {
    activeProvider = VIDEO_PROVIDERS.find((p) => p.name === persistedProviderName);
    taskId = persistedTaskId;
    console.info('[VideoStudio] ► video: resume polling', { provider: persistedProviderName, taskId });
  }

  // Fresh submit: walk the provider chain
  if (!activeProvider || !taskId) {
    commit('setStepStatus', { id: 'video', status: 'running' });
    const tried: { name: string; reason: string }[] = [];

    for (const provider of VIDEO_PROVIDERS) {
      try {
        console.info('[VideoStudio] ► video: trying', provider.name);
        const res = await submitVideoProvider(provider, prompt, VIDEO_STUDIO_LUMA_CALLBACK, state.apiKey);

        const apiErr = res.data?.error?.message;
        if (apiErr) {
          tried.push({ name: provider.name, reason: apiErr });
          continue;
        }

        const immediateUrl = res.data?.video_url;
        const newTaskId = res.data?.task_id;

        // Some providers return the URL directly, no polling needed.
        if (immediateUrl) {
          console.info(`[VideoStudio] ✓ video: done immediate via ${provider.name}`);
          commit('setStepOutput', {
            id: 'video',
            output: {
              video_url: immediateUrl,
              task_id: newTaskId,
              provider: provider.name,
              provider_label: provider.label
            }
          });
          commit('setFinalUrls', { videoUrl: immediateUrl });
          commit('setStepStatus', { id: 'video', status: 'done' });
          return;
        }

        if (!newTaskId) {
          tried.push({ name: provider.name, reason: 'no task_id returned' });
          continue;
        }

        // Got a task_id — this is our provider. Persist + break.
        activeProvider = provider;
        taskId = newTaskId;
        commit('setStepTaskId', { id: 'video', taskId });
        commit('setStepOutput', {
          id: 'video',
          output: { provider: provider.name, provider_label: provider.label, task_id: taskId }
        });
        console.info(`[VideoStudio] ► video: submitted via ${provider.name}`, { taskId });
        break;
      } catch (err: unknown) {
        const status = (err as AxiosError)?.response?.status;
        const msg = extractApiError(err, 'Submit failed');
        tried.push({ name: provider.name, reason: `${status ?? '?'}: ${msg.slice(0, 80)}` });

        if (status === 403 || status === 401) {
          console.warn(`[VideoStudio] ${provider.name} not enabled (${status}), trying next provider`);
          continue;
        }
        // Real error (4xx invalid input, 5xx server) — surface it instead of masking.
        commit('setStepStatus', { id: 'video', status: 'error', error: msg });
        throw err;
      }
    }

    if (!activeProvider || !taskId) {
      const summary = tried.map((p) => `${p.name}(${p.reason})`).join(' · ');
      const message =
        `No video model accepted this key. Tried: ${summary}. ` +
        `Top up balance or enable a video model at platform.acedata.cloud.`;
      commit('setStepStatus', { id: 'video', status: 'error', error: message });
      throw new Error(message);
    }
  }

  // Poll the chosen provider until completion
  commit('setStepStatus', { id: 'video', status: 'polling' });

  try {
    const finalVideoUrl = await pollUntil(async () => {
      let response: { video_url?: string; state?: string; error?: { message?: string } } | undefined;
      try {
        const taskRes = await pollVideoProvider(activeProvider as IVideoProvider, taskId as string, state.apiKey);
        response = taskRes.data?.response as typeof response;
      } catch (e) {
        // Transient poll error — read calls are cheap, keep polling.
        console.warn(`[VideoStudio] video: poll error on ${activeProvider!.name} (continuing)`, e);
        return null;
      }
      const url = response?.video_url;
      const taskState = response?.state;
      console.info(`[VideoStudio] video: poll ${activeProvider!.name}`, { state: taskState, hasUrl: !!url });

      if (taskState === 'failed') {
        throw new Error(response?.error?.message || `${activeProvider!.label} reported state=failed`);
      }
      return url || null;
    }, VIDEO_STUDIO_VIDEO_POLL_MAX_ATTEMPTS);

    console.info(`[VideoStudio] ✓ video: done via ${activeProvider!.name}`);
    commit('setStepOutput', {
      id: 'video',
      output: {
        video_url: finalVideoUrl,
        task_id: taskId,
        provider: activeProvider!.name,
        provider_label: activeProvider!.label
      }
    });
    commit('setFinalUrls', { videoUrl: finalVideoUrl });
    commit('setStepStatus', { id: 'video', status: 'done' });
  } catch (err: unknown) {
    const msg = extractApiError(err, 'Video generation failed');
    console.error('[VideoStudio] ✕ video: poll failed', err);
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
