import axios, { AxiosResponse } from 'axios';
import { IGeminiCompletionResponse, IScriptOutput } from '@/models';
import { BASE_URL_API } from '@/constants';
import { VIDEO_STUDIO_SCRIPT_MODEL, VIDEO_STUDIO_SYSTEM_PROMPT } from '@/constants/videoStudio';

class ScriptGeneratorOperator {
  async generate(
    idea: string,
    options: { token: string }
  ): Promise<AxiosResponse<IGeminiCompletionResponse>> {
    return await axios.post(
      '/gemini/chat/completions',
      {
        model: VIDEO_STUDIO_SCRIPT_MODEL,
        messages: [
          { role: 'system', content: VIDEO_STUDIO_SYSTEM_PROMPT },
          { role: 'user', content: idea }
        ]
      },
      {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${options.token}`
        },
        baseURL: BASE_URL_API
      }
    );
  }

  parseScriptOutput(content: string): IScriptOutput {
    const cleaned = content.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      hook: String(parsed.hook || ''),
      body: String(parsed.body || ''),
      cta: String(parsed.cta || ''),
      musicPrompt: String(parsed.musicPrompt || ''),
      voiceoverText: String(parsed.voiceoverText || '')
    };
  }
}

export const scriptGeneratorOperator = new ScriptGeneratorOperator();
