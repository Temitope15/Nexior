import { IScriptOutput } from '@/models';
import { CHAT_MODEL_NAME_GEMINI_2_5_FLASH } from '@/constants';
import { VIDEO_STUDIO_SYSTEM_PROMPT } from '@/constants/videoStudio';
import { chatOperator } from './chat';

class ScriptGeneratorOperator {
  async generate(idea: string, options: { token: string }): Promise<string> {
    const question = `${VIDEO_STUDIO_SYSTEM_PROMPT}\n\nIdea: ${idea}`;
    const response = await chatOperator.chatConversation(
      { question, model: CHAT_MODEL_NAME_GEMINI_2_5_FLASH },
      { token: options.token }
    );
    return response.answer;
  }

  parseScriptOutput(content: string): IScriptOutput {
    // Strip markdown code fences if present
    const fenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    const cleaned = fenceMatch ? fenceMatch[1].trim() : content.trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Fall back: find first JSON object in the text
      const objMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!objMatch) throw new Error('No JSON found in script generation response. Please try again.');
      parsed = JSON.parse(objMatch[0]);
    }

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
