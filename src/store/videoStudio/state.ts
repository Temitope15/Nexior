import { IVideoStudioState } from './models';
import { PIPELINE_COST_TABLE } from '@/constants/videoStudio';

export default (): IVideoStudioState => {
  return {
    apiKey: '',
    config: {
      idea: '',
      musicStyle: 'cinematic, upbeat, motivational',
      voiceGender: 'male',
      instrumental: true
    },
    steps: [
      {
        id: 'script',
        label: 'Script Generation',
        description: 'AI writes your hook, body, and CTA',
        status: 'idle',
        costUsd: PIPELINE_COST_TABLE.script
      },
      {
        id: 'music',
        label: 'Background Music',
        description: 'Suno generates your soundtrack',
        status: 'idle',
        costUsd: PIPELINE_COST_TABLE.music
      },
      {
        id: 'voiceover',
        label: 'Voiceover',
        description: 'AI narrator delivers your script',
        status: 'idle',
        costUsd: PIPELINE_COST_TABLE.voiceover
      },
      {
        id: 'video',
        label: 'Video Assembly',
        description: 'Final video is composited and rendered',
        status: 'idle',
        costUsd: PIPELINE_COST_TABLE.video
      }
    ],
    totalCostUsd: 0,
    finalAudioUrl: undefined,
    finalVideoUrl: undefined,
    scriptOutput: undefined,
    history: []
  };
};
