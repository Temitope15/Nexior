export const VIDEO_STUDIO_SCRIPT_MODEL = 'gemini-2.5-flash';
export const VIDEO_STUDIO_SUNO_MODEL = 'chirp-v5-5';
export const VIDEO_STUDIO_PRODUCER_MODEL = 'FUZZ-2.0 Pro';

export const VIDEO_STUDIO_SYSTEM_PROMPT = `You are a short-form video scriptwriter specializing in tech insights, success strategies, and personal growth lessons.

Given a raw idea from the user, return ONLY a valid JSON object (no markdown, no extra text) with exactly these keys:
- hook: A compelling opening line (≤15 words) that immediately grabs attention
- body: 3 punchy sentences expanding the core idea with actionable insight
- cta: A clear call-to-action (≤10 words) that drives engagement
- musicPrompt: A style descriptor for background music (e.g. "upbeat lo-fi hip hop, motivational, 120bpm")
- voiceoverText: The full narration script combining hook, body, and cta as one flowing paragraph

Prioritize clarity, energy, and shareability. Every word must earn its place.`;

export const PIPELINE_COST_TABLE: Record<string, number> = {
  script: 0.001,
  music: 0.05,
  voiceover: 0.02,
  video: 0.1
};

export const SUBSCRIPTION_MONTHLY_USD = 30;

export const VIDEO_STUDIO_SUNO_CALLBACK = 'https://webhook.acedata.cloud/suno';
export const VIDEO_STUDIO_PRODUCER_CALLBACK = 'https://webhook.acedata.cloud/producer';
export const VIDEO_STUDIO_LUMA_CALLBACK = 'https://webhook.acedata.cloud/luma';

export const VIDEO_STUDIO_POLL_INTERVAL_MS = 5000;
export const VIDEO_STUDIO_POLL_MAX_ATTEMPTS = 36;
export const VIDEO_STUDIO_VIDEO_POLL_MAX_ATTEMPTS = 60;

export const VIDEO_STUDIO_SKILL_DEFINITION = {
  name: 'video_studio_pipeline',
  display_name: 'Short-Form Video Studio',
  description: 'Convert a text idea into a ready-to-post short-form video with AI-generated script, music, voiceover, and video.',
  icon: '🎬',
  type: 'workflow' as const,
  tags: ['video', 'content', 'social-media', 'ai-pipeline'],
  is_builtin: false,
  is_public: true,
  steps: [
    {
      tool: 'gemini_chat_completions',
      args: { model: VIDEO_STUDIO_SCRIPT_MODEL, idea: '{input.idea}' },
      output: 'script'
    },
    {
      tool: 'suno_generate_music',
      args: { prompt: '{steps.script.musicPrompt}', model: VIDEO_STUDIO_SUNO_MODEL, instrumental: true },
      output: 'music'
    },
    {
      tool: 'producer_generate_audio',
      args: { prompt: '{steps.script.voiceoverText}', model: VIDEO_STUDIO_PRODUCER_MODEL },
      output: 'voiceover'
    },
    {
      tool: 'luma_generate_video',
      args: { prompt: '{steps.script.hook}' },
      output: 'video'
    }
  ]
};
