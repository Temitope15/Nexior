<template>
  <layout @change-conversation="onChangeConversation($event)">
    <template #chat>
      <div class="agent-studio">
        <!-- Background Decor -->
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>

        <div class="studio-content" v-motion-fade>
          <header class="studio-header">
            <div class="agent-badge">
              <font-awesome-icon icon="fa-solid fa-robot" class="mr-2" />
              AI CONTENT AGENT v2.5
            </div>
            <h1>Nexior <span class="gradient-text">Studio</span></h1>
            <p>Turning thoughts into cinematic short-form content</p>
          </header>

          <!-- Main Agent Interface -->
          <div class="agent-card glass">
            <!-- Step 0: Input Configuration -->
            <div v-if="workflowState === 'IDLE'" class="workflow-step" v-motion-slide-up>
              <div class="input-section">
                <h2 class="section-title">What's the concept?</h2>
                <el-input
                  v-model="config.topic"
                  type="textarea"
                  :rows="4"
                  placeholder="E.g. Create a 60-second viral TikTok script about why consistency is better than talent in business, with a high-energy tone and a clear call to action."
                  class="premium-input"
                />
                
                <div class="config-grid mt-8">
                  <div class="config-item">
                    <label>Platform Optimization</label>
                    <el-select v-model="config.platform" class="w-full premium-select">
                      <el-option label="TikTok (9:16)" value="TikTok" />
                      <el-option label="Instagram Reels" value="Instagram" />
                      <el-option label="YouTube Shorts" value="YouTube" />
                    </el-select>
                  </div>
                  <div class="config-item">
                    <label>Narrative Tone</label>
                    <el-select v-model="config.tone" class="w-full premium-select">
                      <el-option label="Educational / Informative" value="Educational" />
                      <el-option label="Sales / Persuasive" value="Sales" />
                      <el-option label="Entertaining / Dynamic" value="Entertaining" />
                      <el-option label="Inspirational / Deep" value="Inspirational" />
                    </el-select>
                  </div>
                </div>

                <div class="actions center mt-12">
                  <el-button 
                    type="primary" 
                    size="large" 
                    class="generate-btn"
                    :disabled="!config.topic"
                    @click="generateScript"
                  >
                    Initiate Generation Agent
                    <font-awesome-icon icon="fa-solid fa-wand-magic-sparkles" class="ml-2" />
                  </el-button>
                </div>
              </div>
            </div>

            <!-- Step 1: Script Generation / Loading -->
            <div v-if="workflowState === 'GENERATING_SCRIPT'" class="workflow-step text-center py-24" v-motion-fade>
              <div class="agent-animation">
                <div class="pulse-ring"></div>
                <div class="pulse-ring-slow"></div>
                <font-awesome-icon icon="fa-solid fa-brain" class="agent-icon" />
              </div>
              <h3 class="mt-10 text-2xl font-black letter-spacing-tight">Drafting Scripting Agent...</h3>
              <p class="text-secondary mt-2">Economizing tokens via Gemini 2.5 Flash architecture.</p>
              
              <div class="agent-logs mt-10 glass-dark">
                 <div v-for="(log, i) in activeLogs" :key="i" class="log-entry" v-motion-slide-left>
                    <font-awesome-icon icon="fa-solid fa-terminal" class="mr-2 text-xs opacity-50" />
                    {{ log }}
                 </div>
              </div>
            </div>

            <!-- Step 2: Script Review & Approval -->
            <div v-if="workflowState === 'REVIEW_SCRIPT'" class="workflow-step" v-motion-slide-up>
              <div class="flex justify-between items-center mb-6">
                <h2 class="section-title mb-0">Agent Proposal: Script</h2>
                <div class="token-saver-badge">TOKEN OPTIMIZED</div>
              </div>
              
              <div class="script-editor glass-dark">
                <div class="script-block">
                  <div class="block-header">
                    <font-awesome-icon icon="fa-solid fa-anchor" class="mr-2" />
                    HOOK
                  </div>
                  <el-input v-model="outputs.script.hook" type="textarea" :rows="2" autosize />
                </div>
                <div class="script-block mt-6">
                  <div class="block-header">
                    <font-awesome-icon icon="fa-solid fa-align-left" class="mr-2" />
                    BODY
                  </div>
                  <el-input v-model="outputs.script.body" type="textarea" :rows="5" autosize />
                </div>
                <div class="script-block mt-6">
                  <div class="block-header">
                    <font-awesome-icon icon="fa-solid fa-bullhorn" class="mr-2" />
                    CTA
                  </div>
                  <el-input v-model="outputs.script.cta" type="textarea" :rows="2" autosize />
                </div>
              </div>

              <div class="actions space-between mt-10">
                <el-button round class="glass-btn" @click="workflowState = 'IDLE'">
                  <font-awesome-icon icon="fa-solid fa-chevron-left" class="mr-2" />
                  Adjust Concept
                </el-button>
                <el-button type="success" size="large" class="approve-btn premium-shadow" @click="startMediaGeneration">
                  Deploy Production Agent
                  <font-awesome-icon icon="fa-solid fa-play" class="ml-2" />
                </el-button>
              </div>
            </div>

            <!-- Step 3: Media Generation (Audio & Video) -->
            <div v-if="workflowState === 'GENERATING_MEDIA'" class="workflow-step" v-motion-fade>
              <h2 class="section-title mb-8">Production Pipeline</h2>
              
              <div class="generation-status py-6">
                 <div class="media-track glass-dark p-6 mb-6">
                    <div class="track-info">
                      <div class="flex items-center">
                        <font-awesome-icon icon="fa-solid fa-microphone-lines" class="mr-3 text-primary" />
                        <span>Vocal & Audio Synthesis</span>
                      </div>
                      <div class="status-indicator">
                        <font-awesome-icon v-if="loading.audio" icon="fa-solid fa-spinner" spin />
                        <font-awesome-icon v-else icon="fa-solid fa-circle-check" class="text-success" />
                        <span class="ml-2 text-xs font-bold">{{ loading.audio ? 'SYNTHESIZING' : 'READY' }}</span>
                      </div>
                    </div>
                    <el-progress 
                      :percentage="loading.audio ? 70 : 100" 
                      :status="loading.audio ? 'exception' : 'success'" 
                      :show-text="false"
                      class="premium-progress"
                    />
                 </div>

                 <div class="media-track glass-dark p-6">
                    <div class="track-info">
                      <div class="flex items-center">
                        <font-awesome-icon icon="fa-solid fa-film" class="mr-3 text-purple" />
                        <span>Visual Orchestration & Packaging</span>
                      </div>
                      <div class="status-indicator">
                        <font-awesome-icon v-if="loading.visual" icon="fa-solid fa-spinner" spin />
                        <font-awesome-icon v-else icon="fa-solid fa-circle-check" class="text-success" />
                        <span class="ml-2 text-xs font-bold">{{ loading.visual ? 'RENDERING' : 'READY' }}</span>
                      </div>
                    </div>
                    <el-progress 
                      :percentage="loading.visual ? 35 : 100" 
                      :status="loading.visual ? 'exception' : 'success'" 
                      :show-text="false"
                      class="premium-progress purple"
                    />
                 </div>
                 
                 <div class="pipeline-logs mt-10">
                    <p class="text-center text-secondary text-sm italic">
                      <font-awesome-icon icon="fa-solid fa-circle-notch" spin class="mr-2" />
                      {{ pipelineStatus }}
                    </p>
                 </div>
              </div>
            </div>

            <!-- Step 4: Final Preview & Download -->
            <div v-if="workflowState === 'FINAL_RESULT'" class="workflow-step" v-motion-slide-up>
               <h2 class="section-title mb-6">Mastering Complete</h2>
               
               <div class="preview-container glass-dark relative">
                  <video 
                    v-if="outputs.videoUrl" 
                    :src="outputs.videoUrl" 
                    controls 
                    class="main-video premium-shadow"
                    autoplay
                  ></video>
                  <div class="video-overlay-badge">PREVIEW READY</div>
               </div>

               <div class="actions center mt-10">
                 <el-button size="large" round class="glass-btn" @click="resetWorkflow">
                    New Project
                 </el-button>
                 <el-button 
                    type="primary" 
                    size="large" 
                    class="download-btn premium-shadow"
                    :disabled="!outputs.videoUrl"
                    @click="downloadVideo"
                 >
                    Download Master File (.mp4)
                    <font-awesome-icon icon="fa-solid fa-cloud-arrow-down" class="ml-2" />
                 </el-button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElInput, ElSelect, ElOption, ElButton, ElMessage, ElProgress } from 'element-plus';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { chatOperator, sunoOperator, producerOperator } from '@/operators';
import { IChatModelName } from '@/models';
import { 
  CHAT_MODEL_NAME_GEMINI_2_5_FLASH, 
  SUNO_DEFAULT_MODEL 
} from '@/constants';
import Layout from '@/layouts/Chat.vue';

type WorkflowState = 'IDLE' | 'GENERATING_SCRIPT' | 'REVIEW_SCRIPT' | 'GENERATING_MEDIA' | 'FINAL_RESULT';

interface AgentState {
  workflowState: WorkflowState;
  config: {
    topic: string;
    platform: string;
    tone: string;
  };
  loading: {
    script: boolean;
    audio: boolean;
    visual: boolean;
  };
  outputs: {
    script: { hook: string; body: string; cta: string };
    audioUrl: string;
    audioId: string;
    videoUrl: string;
  };
  pollingJob: number;
  activeLogs: string[];
  pipelineStatus: string;
}

export default defineComponent({
  name: 'AgentStudio',
  components: {
    Layout,
    ElInput,
    ElSelect,
    ElOption,
    ElButton,
    ElProgress,
    FontAwesomeIcon
  },
  data(): AgentState {
    return {
      workflowState: 'IDLE',
      config: {
        topic: '',
        platform: 'TikTok',
        tone: 'Educational'
      },
      loading: {
        script: false,
        audio: false,
        visual: false
      },
      outputs: {
        script: { hook: '', body: '', cta: '' },
        audioUrl: '',
        audioId: '',
        videoUrl: ''
      },
      pollingJob: 0,
      activeLogs: [],
      pipelineStatus: 'Initializing production assets...'
    };
  },
  computed: {
    authenticated() {
       return !!this.$store.state.token.access;
    }
  },
  beforeUnmount() {
    this.stopPolling();
  },
  methods: {
    onChangeConversation(id?: string) {
       console.debug('onChangeConversation in studio', id);
       if (id) {
          this.$router.push(`/chatgpt/conversations/${id}`);
       }
    },

    addLog(msg: string) {
       this.activeLogs.push(msg);
       if (this.activeLogs.length > 5) this.activeLogs.shift();
    },

    async generateScript() {
      if (!this.authenticated) {
        this.$store.dispatch('login');
        return;
      }

      this.workflowState = 'GENERATING_SCRIPT';
      this.loading.script = true;
      this.activeLogs = [];
      
      this.addLog('Analyzing intent...');
      setTimeout(() => this.addLog('Retrieving model context...'), 800);
      setTimeout(() => this.addLog('Optimizing token allocation...'), 1500);

      const systemPrompt = `You are an elite short-form video content strategist.
Given a topic, generate a highly engaging script.
Strictly use this format:
HOOK: [attention-grabbing opening]
BODY: [3-4 value-packed points]
CTA: [strong call to action]
Target Platform: ${this.config.platform}
Tone: ${this.config.tone}`;

      const userPrompt = `Video Topic: ${this.config.topic}`;

      try {
        const token = this.$store.state.token.access;
        if (!token) throw new Error('Authentication required.');

        const res = await chatOperator.chatConversation({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          model: CHAT_MODEL_NAME_GEMINI_2_5_FLASH as IChatModelName
        }, { token });

        this.addLog('Script drafted successfully.');
        setTimeout(() => {
          this.outputs.script = this.parseScript(res.answer);
          this.workflowState = 'REVIEW_SCRIPT';
        }, 500);
      } catch (err: any) {
        ElMessage.error(err.message || 'Script generation failed');
        this.workflowState = 'IDLE';
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

    async startMediaGeneration() {
      if (!this.authenticated) {
        this.$store.dispatch('login');
        return;
      }
      this.workflowState = 'GENERATING_MEDIA';
      this.loading.audio = true;
      this.loading.visual = true;
      this.pipelineStatus = 'Synthesizing voiceover and background score...';
      
      try {
        await this.generateVoiceover();
      } catch (err) {
        this.workflowState = 'REVIEW_SCRIPT';
      }
    },

    async generateVoiceover() {
      const scriptText = `${this.outputs.script.hook}. ${this.outputs.script.body}. ${this.outputs.script.cta}`;
      const token = this.$store.state.token.access as string | undefined;

      try {
        if (!token) throw new Error('Authentication required.');

        const res = await sunoOperator.audio({
          prompt: scriptText,
          model: SUNO_DEFAULT_MODEL,
          custom: true,
          lyric: scriptText,
          style: 'Narrative Voiceover, Professional Background Music',
          instrumental: false
        }, { token });

        this.startPolling(res.data.task_id, token, 'audio');
      } catch (err: any) {
        this.loading.audio = false;
        ElMessage.error('Audio asset generation failed');
        throw err;
      }
    },

    async generateFinalVideo(audioId: string) {
      this.loading.visual = true;
      this.pipelineStatus = 'Orchestrating context-aware visuals and packaging...';
      const token = this.$store.state.token.access as string | undefined;

      try {
        if (!token) throw new Error('Authentication required.');

        const res = await producerOperator.video({
          audio_id: audioId
        }, { token });

        this.startPolling(res.data.task_id, token, 'video');
      } catch (err: any) {
        this.loading.visual = false;
        ElMessage.error('Video assembly failed');
      }
    },

    startPolling(taskId: string, token: string, type: 'audio' | 'video') {
      this.stopPolling();
      
      this.pollingJob = window.setInterval(async () => {
        try {
          if (type === 'audio') {
            const res = await sunoOperator.task(taskId, { token });
            const data = (res.data.response as any)?.data;
            if (data && data[0]?.audio_url) {
              this.outputs.audioUrl = data[0].audio_url;
              this.outputs.audioId = data[0].id;
              this.loading.audio = false;
              this.stopPolling();
              this.generateFinalVideo(this.outputs.audioId);
            }
          } else {
            const res = await producerOperator.task(taskId, { token });
            const data = (res.data.response as any)?.data;
            if (data && data.video_url) {
              this.outputs.videoUrl = data.video_url;
              this.loading.visual = false;
              this.stopPolling();
              this.workflowState = 'FINAL_RESULT';
            }
          }
        } catch (e) {
          console.error('Polling error:', e);
        }
      }, 5000);
    },

    stopPolling() {
      if (this.pollingJob) {
        window.clearInterval(this.pollingJob);
        this.pollingJob = 0;
      }
    },

    downloadVideo() {
      if (!this.outputs.videoUrl) return;
      const link = document.createElement('a');
      link.href = this.outputs.videoUrl;
      link.setAttribute('download', `nexior-video-${Date.now()}.mp4`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    resetWorkflow() {
      this.workflowState = 'IDLE';
      this.outputs.script = { hook: '', body: '', cta: '' };
      this.outputs.audioUrl = '';
      this.outputs.videoUrl = '';
      this.outputs.audioId = '';
      this.activeLogs = [];
    }
  }
});
</script>

<style lang="scss" scoped>
.agent-studio {
  height: 100%;
  width: 100%;
  padding: 40px 20px;
  background: #020617;
  color: #f8fafc;
  position: relative;
  overflow-y: auto;
  font-family: 'Outfit', sans-serif;

  .blob {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    z-index: 0;
    filter: blur(120px);
    opacity: 0.1;
  }
  .blob-1 { top: -100px; right: -50px; background: #6366f1; }
  .blob-2 { bottom: -100px; left: -50px; background: #a855f7; }
  .blob-3 { top: 30%; left: 20%; width: 300px; height: 300px; background: #3b82f6; }

  .studio-content {
    position: relative;
    z-index: 1;
    max-width: 860px;
    margin: 0 auto;
  }

  .studio-header {
    text-align: center;
    margin-bottom: 50px;
    .agent-badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.2);
      color: #818cf8;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.5px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 48px;
      font-weight: 900;
      letter-spacing: -2px;
      margin-bottom: 12px;
    }
    p {
      font-size: 16px;
      color: #94a3b8;
    }
  }

  .gradient-text {
    background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .agent-card {
    padding: 40px;
    border-radius: 32px;
    background: rgba(15, 23, 42, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(20px);
  }

  .glass-dark {
    background: rgba(2, 6, 23, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 20px;
  }

  .section-title {
    font-size: 20px;
    font-weight: 800;
    color: #f1f5f9;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      width: 4px;
      height: 24px;
      background: #6366f1;
      margin-right: 12px;
      border-radius: 10px;
    }
  }

  .premium-input {
    :deep(.el-textarea__inner) {
      background: rgba(2, 6, 23, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #f1f5f9;
      border-radius: 16px;
      font-size: 16px;
      padding: 16px;
      &:focus {
        border-color: #6366f1;
      }
    }
  }

  .config-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  .premium-select {
    :deep(.el-input__wrapper) {
      background: rgba(2, 6, 23, 0.3) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 12px;
      height: 48px;
    }
  }

  .generate-btn {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    border: none;
    height: 56px;
    padding: 0 40px;
    font-size: 17px;
    font-weight: 800;
    border-radius: 100px;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
    }
  }

  .agent-animation {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    .agent-icon {
      font-size: 54px;
      color: #818cf8;
    }
    .pulse-ring, .pulse-ring-slow {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 2px solid rgba(99, 102, 241, 0.3);
      border-radius: 50%;
    }
    .pulse-ring { animation: pulse 2s infinite; }
    .pulse-ring-slow { animation: pulse 3s infinite 0.5s; }
  }

  .agent-logs {
    padding: 16px;
    max-width: 360px;
    margin: 0 auto;
    .log-entry {
      font-family: monospace;
      font-size: 11px;
      color: #64748b;
      text-align: left;
      margin-bottom: 6px;
    }
  }

  .token-saver-badge {
    font-size: 10px;
    font-weight: 800;
    background: rgba(14, 165, 233, 0.2);
    color: #0ea5e9;
    padding: 3px 8px;
    border-radius: 4px;
  }

  .script-editor {
    padding: 24px;
  }

  .block-header {
    font-size: 10px;
    font-weight: 800;
    color: #6366f1;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .script-block :deep(.el-textarea__inner) {
    background: transparent;
    border: none;
    box-shadow: none;
    color: #f1f5f9;
    padding: 0;
    font-size: 16px;
  }

  .approve-btn {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border: none;
    height: 54px;
    font-weight: 800;
    border-radius: 14px;
  }

  .glass-btn {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #94a3b8;
    height: 54px;
    border-radius: 14px;
  }

  .track-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    span { font-weight: 700; font-size: 14px; }
  }

  .premium-progress {
    :deep(.el-progress-bar__outer) {
       background: rgba(255, 255, 255, 0.04);
       height: 6px !important;
    }
    :deep(.el-progress-bar__inner) {
       background: #6366f1;
    }
    &.purple :deep(.el-progress-bar__inner) {
       background: #a855f7;
    }
  }

  .preview-container {
    padding: 12px;
    .main-video {
      width: 100%;
      border-radius: 16px;
      max-height: 480px;
      background: #000;
    }
    .video-overlay-badge {
      position: absolute;
      top: 30px;
      right: 30px;
      background: rgba(0,0,0,0.5);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 9px;
      font-weight: 800;
      color: #6366f1;
    }
  }

  .download-btn {
    background: #3b82f6;
    border: none;
    height: 56px;
    font-weight: 800;
    border-radius: 100px;
    &:hover { transform: scale(1.02); }
  }

  .text-secondary { color: #64748b; }
  .text-success { color: #10b981; }
  .text-primary { color: #6366f1; }
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}
</style>
