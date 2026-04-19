<template>
  <div class="studio-page">
    <header class="studio-header">
      <h1>AI Content Studio</h1>
      <p>Turn any idea into a ready-to-post video</p>
    </header>

    <div class="studio-container">
      <!-- Step progress indicator -->
      <div class="step-indicator">
         <div v-for="i in 5" :key="i" :class="['dot', { active: step >= i - 1, current: step === i - 1 }]"></div>
      </div>

      <!-- Step 0: Input Configuration -->
      <div v-if="step === 0" class="studio-step step-input">
        <div class="form-section">
          <label>Video Topic</label>
          <el-input
            v-model="config.topic"
            type="textarea"
            :rows="3"
            placeholder="What is your video about? (e.g. 'How to start a small business in 2024')"
          />
        </div>
        <div class="form-row">
          <div class="form-section">
            <label>Platform</label>
            <el-select v-model="config.platform" class="w-full">
              <el-option label="TikTok" value="TikTok" />
              <el-option label="Instagram Reels" value="Instagram" />
              <el-option label="YouTube Shorts" value="YouTube" />
            </el-select>
          </div>
          <div class="form-section">
            <label>Tone</label>
            <el-select v-model="config.tone" class="w-full">
              <el-option label="Educational" value="Educational" />
              <el-option label="Sales/Marketing" value="Sales" />
              <el-option label="Entertaining" value="Entertaining" />
              <el-option label="Inspirational" value="Inspirational" />
            </el-select>
          </div>
        </div>
        <div class="actions">
          <el-button type="primary" size="large" round :disabled="!config.topic" @click="startGeneration">
            Generate Content Pipeline
          </el-button>
        </div>
      </div>

      <!-- Step 1: Script Generation -->
      <div v-if="step === 1" class="studio-step step-script">
        <div class="step-header">
          <h2>Step 1: Script Generation</h2>
          <div class="model-picker">
            <span>Model:</span>
            <el-select v-model="models.script" size="small" style="width: 150px">
              <el-option label="Gemini 2.0 Pro" value="gemini-2.0-pro" />
              <el-option label="Claude 3.5 Sonnet" value="claude-3-5-sonnet" />
              <el-option label="GPT-4o" value="gpt-4o" />
            </el-select>
          </div>
        </div>

        <div v-if="loading.script" class="loading-state">
          <font-awesome-icon icon="fa-solid fa-spinner" spin />
          <p>Writing your script...</p>
        </div>

        <div v-else-if="outputs.script" class="output-content script-output">
          <div class="script-section">
            <h3>HOOK</h3>
            <p>{{ outputs.script.hook }}</p>
          </div>
          <div class="script-section">
            <h3>BODY</h3>
            <p>{{ outputs.script.body }}</p>
          </div>
          <div class="script-section">
            <h3>CTA</h3>
            <p>{{ outputs.script.cta }}</p>
          </div>
        </div>

        <div class="actions mt-6">
          <el-button round @click="step = 0">Back</el-button>
          <el-button v-if="!outputs.script" type="primary" round @click="generateScript">Generate Script</el-button>
          <el-button v-else type="primary" round @click="goToVoice">Next: Generate Voice</el-button>
        </div>
      </div>

      <!-- Step 2: Voice Generation -->
      <div v-if="step === 2" class="studio-step step-voice">
        <div class="step-header">
          <h2>Step 2: Voice & Music</h2>
        </div>

        <div v-if="loading.audio" class="loading-state">
          <font-awesome-icon icon="fa-solid fa-spinner" spin />
          <p>Generating voiceover and music...</p>
        </div>

        <div v-else-if="outputs.audioUrl" class="output-content audio-output">
           <div class="audio-label">Generated Voiceover:</div>
           <audio controls :src="outputs.audioUrl" class="w-full mt-2"></audio>
        </div>

        <div v-else class="empty-state text-center py-10">
          <p>Ready to turn this script into audio?</p>
          <el-button type="primary" round @click="generateAudio">Generate Voiceover</el-button>
        </div>

        <div class="actions mt-6">
          <el-button round @click="step = 1">Back</el-button>
          <el-button type="primary" round :disabled="!outputs.audioUrl" @click="step = 3">Next: Visuals</el-button>
        </div>
      </div>

      <!-- Step 3: Visual Generation -->
      <div v-if="step === 3" class="studio-step step-visual">
         <div class="step-header">
          <h2>Step 3: Visual Generation</h2>
          <div class="model-picker">
            <span>Model:</span>
            <el-select v-model="models.visual" size="small" style="width: 150px">
              <el-option label="Nano Banana (Image)" value="nano-banana" />
              <el-option label="Seedance (Video)" value="seedance" />
            </el-select>
          </div>
        </div>

        <div v-if="loading.visual" class="loading-state">
          <font-awesome-icon icon="fa-solid fa-spinner" spin />
          <p>Generating your visuals...</p>
        </div>

        <div v-else-if="outputs.visualUrl" class="output-content visual-output">
          <img v-if="outputs.visualType === 'image'" :src="outputs.visualUrl" class="result-media" />
          <video v-else :src="outputs.visualUrl" controls class="result-media"></video>
        </div>

        <div v-else class="empty-state text-center py-10">
          <p>Let's create the visuals for your video.</p>
          <el-button type="primary" round @click="generateVisual">Generate Visuals</el-button>
        </div>

        <div class="actions mt-6">
          <el-button round @click="step = 2">Back</el-button>
          <el-button type="primary" round :disabled="!outputs.visualUrl" @click="step = 4">Final Preview</el-button>
        </div>
      </div>

      <!-- Step 4: Final Preview -->
      <div v-if="step === 4" class="studio-step step-preview">
        <div class="step-header">
          <h2>Final Preview</h2>
        </div>
        
        <div class="preview-layout">
           <div class="preview-media">
              <img v-if="outputs.visualType === 'image'" :src="outputs.visualUrl" />
              <video v-else :src="outputs.visualUrl" controls></video>
              <audio :src="outputs.audioUrl" class="mt-4 w-full" controls></audio>
           </div>
           <div class="preview-details">
              <h3>Script</h3>
              <p><strong>HOOK:</strong> {{ outputs.script?.hook }}</p>
              <p><strong>BODY:</strong> {{ outputs.script?.body }}</p>
              <p><strong>CTA:</strong> {{ outputs.script?.cta }}</p>
           </div>
        </div>

        <div class="actions mt-10">
          <el-button round @click="step = 3">Back</el-button>
          <el-button type="success" round size="large" @click="resetStudio">Start New Creation</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElInput, ElSelect, ElOption, ElButton, ElMessage } from 'element-plus';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { chatOperator, sunoOperator } from '@/operators';
import { SUNO_DEFAULT_MODEL } from '@/constants';
import { getCookie } from 'typescript-cookie';

interface StudioState {
  step: number;
  config: {
    topic: string;
    platform: string;
    tone: string;
  };
  models: {
    script: string;
    audio: string;
    visual: string;
  };
  loading: {
    script: boolean;
    audio: boolean;
    visual: boolean;
  };
  outputs: {
    script: { hook: string; body: string; cta: string } | null;
    audioUrl: string;
    visualUrl: string;
    visualType: 'image' | 'video';
  };
  pollingJob: number;
}

export default defineComponent({
  name: 'StudioIndex',
  components: {
    ElInput,
    ElSelect,
    ElOption,
    ElButton,
    FontAwesomeIcon
  },
  data(): StudioState {
    return {
      step: 0,
      config: {
        topic: '',
        platform: 'TikTok',
        tone: 'Educational'
      },
      models: {
        script: 'gemini-2.0-pro',
        audio: 'suno-v3-5',
        visual: 'nano-banana'
      },
      loading: {
        script: false,
        audio: false,
        visual: false
      },
      outputs: {
        script: null,
        audioUrl: '',
        visualUrl: '',
        visualType: 'image'
      },
      pollingJob: 0
    };
  },
  beforeUnmount() {
    if (this.pollingJob) {
      window.clearInterval(this.pollingJob);
    }
  },
  methods: {
    startGeneration() {
      this.step = 1;
      this.generateScript();
    },
    async generateScript() {
      this.loading.script = true;
      this.outputs.script = null;

      const systemPrompt = `You are a short-form video content creator.
Given a topic, generate a script for a 30–60 second video.
Strictly use this format:
HOOK: [opening line]
BODY: [key points]
CTA: [call to action]
Platform: ${this.config.platform}
Tone: ${this.config.tone}`;

      const userPrompt = `Topic: ${this.config.topic}`;

      try {
        const token = getCookie('token');
        if (!token) throw new Error('Auth token missing. Please refresh.');

        const res = await chatOperator.chatConversation({
            messages: [{
                role: 'system',
                content: systemPrompt
            }, {
                role: 'user',
                content: userPrompt
            }],
            model: this.models.script,
            stream: false
        }, { token });

        const content = res.answer;
        this.outputs.script = this.parseScript(content);
      } catch (err: any) {
        ElMessage.error(err.message || 'Failed to generate script');
      } finally {
        this.loading.script = false;
      }
    },
    parseScript(content: string) {
       const hookMatch = content.match(/HOOK:([\s\S]*?)BODY:/i);
       const bodyMatch = content.match(/BODY:([\s\S]*?)CTA:/i);
       const ctaMatch = content.match(/CTA:([\s\S]*?)$/i);
       return {
         hook: hookMatch ? hookMatch[1].trim() : content.substring(0, 50),
         body: bodyMatch ? bodyMatch[1].trim() : '...',
         cta: ctaMatch ? ctaMatch[1].trim() : '...'
       };
    },
    async generateAudio() {
      if (!this.outputs.script) return;
      this.loading.audio = true;
      
      const scriptText = `${this.outputs.script.hook} ${this.outputs.script.body} ${this.outputs.script.cta}`;
      const token = getCookie('token');
      
      try {
        const res = await sunoOperator.audio({
          prompt: scriptText,
          model: SUNO_DEFAULT_MODEL,
          custom: true,
          lyric: scriptText,
          style: 'Narrative Voiceover, Background Background Music',
          instrumental: false
        }, { token });

        this.startPolling(res.data.task_id as string, token);
      } catch (err: any) {
        this.loading.audio = false;
        ElMessage.error('Audio generation failed');
      }
    },
    async generateVisual() {
      this.loading.visual = true;
      this.outputs.visualType = this.models.visual === 'seedance' ? 'video' : 'image';
      
      // Simulating visual generation for now as we'd need specific operators for nano-banana/seedance
      // In a real implementation, we'd call seedanceOperator or imageOperator.
      setTimeout(() => {
        this.outputs.visualUrl = 'https://cdn.acedata.cloud/l3ffw7.jpg'; // Placeholder
        this.loading.visual = false;
        ElMessage.success('Visuals generated (Demo Placeholder)');
      }, 3000);
    },
    startPolling(taskId: string, token: string) {
      this.pollingJob = window.setInterval(async () => {
        try {
          const res = await sunoOperator.task(taskId, { token });
          const audios = (res.data.response as any)?.data;
          if (audios && audios[0]?.audio_url) {
            this.outputs.audioUrl = audios[0].audio_url;
            this.loading.audio = false;
            window.clearInterval(this.pollingJob);
          }
        } catch (e) {
          console.error(e);
        }
      }, 5000);
    },
    goToVoice() { this.step = 2; },
    resetStudio() {
      this.step = 0;
      this.outputs.script = null;
      this.outputs.audioUrl = '';
      this.outputs.visualUrl = '';
    }
  }
});
</script>

<style lang="scss" scoped>
.studio-page {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;

  .studio-header {
    text-align: center;
    margin-bottom: 40px;
    h1 {
      font-size: 42px;
      font-weight: 800;
      letter-spacing: -1px;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-fill-color: transparent;
    }
    p { font-size: 16px; color: var(--el-text-color-secondary); }
  }

  .step-indicator {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 30px;
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--el-border-color-lighter);
      transition: all 0.3s;
      &.active { background: var(--el-color-primary-light-5); }
      &.current { background: var(--el-color-primary); transform: scale(1.3); }
    }
  }

  .studio-container {
    background: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 28px;
    padding: 40px;
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
  }

  .studio-step { animation: slideUp 0.5s ease-out; }

  .form-section {
    margin-bottom: 24px;
    label { display: block; font-weight: 600; margin-bottom: 10px; font-size: 13px; color: var(--el-text-color-regular); }
  }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

  .step-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    h2 { font-size: 20px; font-weight: 700; }
    .model-picker { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--el-text-color-secondary); }
  }

  .loading-state {
    text-align: center;
    padding: 60px 0;
    font-size: 32px;
    color: var(--el-color-primary);
    p { font-size: 14px; margin-top: 16px; color: var(--el-text-color-secondary); }
  }

  .script-section {
    margin-bottom: 16px;
    padding: 20px;
    background: var(--el-fill-color-lighter);
    border-radius: 16px;
    h3 { font-size: 11px; font-weight: 900; color: var(--el-color-primary); margin-bottom: 8px; text-transform: uppercase; }
    p { line-height: 1.6; font-size: 15px; }
  }

  .result-media {
    width: 100%;
    border-radius: 20px;
    max-height: 400px;
    object-fit: cover;
    box-shadow: var(--app-shadow-lg);
  }

  .preview-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    .preview-media img, .preview-media video { width: 100%; border-radius: 20px; }
    .preview-details h3 { margin-bottom: 15px; font-size: 18px; }
    .preview-details p { margin-bottom: 10px; font-size: 14px; line-height: 1.5; }
  }

  .actions { display: flex; justify-content: center; gap: 16px; margin-top: 32px; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Glassmorphism for dark mode */
html.dark .studio-container {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
}
</style>
