<template>
  <div class="studio-chat">
    <!-- Sidebar -->
    <aside class="studio-sidebar">
      <div class="sidebar-content">
        <button class="new-chat-btn" @click="startNewGeneration">
          <span class="btn-icon">+</span>
          New Video
        </button>

        <div v-if="userToken" class="history-section">
          <h3>Recent Videos</h3>
          <div v-if="history.length === 0" class="empty-history">
            <p>No videos yet</p>
          </div>
          <div v-else class="history-list">
            <button
              v-for="record in history"
              :key="record.id"
              class="history-item"
              :class="{ active: selectedHistoryId === record.id }"
              @click="selectHistory(record)"
              :title="record.idea"
            >
              <span class="history-preview">{{ record.idea.substring(0, 40) }}...</span>
              <span class="history-time">{{ formatTime(record.createdAt) }}</span>
            </button>
          </div>
        </div>

        <div v-else class="signin-section">
          <p>Sign in to save your video history</p>
          <button class="signin-btn" @click="$store.dispatch('login')">
            Sign In
          </button>
        </div>
      </div>

      <div class="sidebar-footer">
        <button class="settings-btn" @click="showSettings = !showSettings">⚙️ Settings</button>
      </div>
    </aside>

    <!-- Main Chat Area -->
    <main class="studio-main">
      <!-- API Key Gate -->
      <div v-if="!hasApiKey" class="api-key-gate">
        <div class="gate-card">
          <div class="gate-icon">🔑</div>
          <h2>Enter Your API Key</h2>
          <p>You need an Ace Data Cloud API key to create videos</p>

          <div class="form-group">
            <input
              v-model="apiKeyInput"
              :type="showApiKeyInputValue ? 'text' : 'password'"
              placeholder="sk-…"
              class="gate-input"
              @keyup.enter="saveApiKey"
            />
            <button
              class="visibility-btn"
              @click="showApiKeyInputValue = !showApiKeyInputValue"
            >
              {{ showApiKeyInputValue ? '🙈' : '👁' }}
            </button>
          </div>

          <button class="btn btn-primary" @click="saveApiKey" :disabled="!apiKeyInput.trim()">
            Save & Continue
          </button>

          <p class="gate-help">
            Get a free API key at
            <a href="https://hub.acedata.cloud" target="_blank" rel="noopener">hub.acedata.cloud</a>
          </p>
        </div>
      </div>

      <!-- Empty State with Templates -->
      <div v-else-if="!currentGeneration && !selectedHistory" class="empty-state">
        <div class="empty-header">
          <h1>What do you want to create today?</h1>
          <p>Write your idea and we'll turn it into a polished short-form video</p>
        </div>

        <div class="templates-grid">
          <button
            v-for="(template, idx) in templates"
            :key="idx"
            class="template-card"
            @click="useTemplate(template)"
          >
            {{ template }}
          </button>
        </div>
      </div>

      <!-- Conversation View -->
      <div v-else class="conversation">
        <div class="messages-container">
          <!-- User message -->
          <div v-if="displayIdea" class="message user-message">
            <div class="message-content">
              {{ displayIdea }}
            </div>
          </div>

          <!-- Pipeline steps as animated messages -->
          <div
            v-for="step in steps"
            :key="step.id"
            class="message pipeline-message"
            :class="`pipeline-${step.status}`"
          >
            <div class="pipeline-step-card">
              <div class="step-header">
                <div class="step-status-icon">
                  <span v-if="step.status === 'idle'" class="idle">○</span>
                  <span v-else-if="step.status === 'running' || step.status === 'polling'" class="running">⊙</span>
                  <span v-else-if="step.status === 'done'" class="done">✓</span>
                  <span v-else class="error">✕</span>
                </div>
                <div class="step-info">
                  <h4>{{ step.label }}</h4>
                  <p>{{ step.description }}</p>
                </div>
                <div class="step-cost">${{ step.costUsd.toFixed(3) }}</div>
              </div>

              <!-- Script output -->
              <div v-if="step.id === 'script' && scriptOutput" class="step-content">
                <div class="script-hook">"{{ scriptOutput.hook }}"</div>
                <div class="script-body">{{ scriptOutput.body }}</div>
                <div class="script-cta">→ {{ scriptOutput.cta }}</div>
              </div>

              <!-- Music/Voiceover/Video outputs -->
              <div v-if="step.id === 'music' && finalAudioUrl" class="step-content">
                <audio :src="finalAudioUrl" controls class="media-player" />
              </div>

              <div v-if="step.id === 'voiceover' && voiceoverUrl" class="step-content">
                <audio :src="voiceoverUrl" controls class="media-player" />
              </div>

              <div v-if="step.id === 'video' && finalVideoUrl" class="step-content">
                <video :src="finalVideoUrl" controls class="video-player" />
              </div>

              <!-- Loading state -->
              <div v-if="step.status === 'running' || step.status === 'polling'" class="step-loader">
                <div class="loader-bars">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area (always at bottom) -->
      <div v-if="hasApiKey" class="input-area">
        <div class="input-container">
          <textarea
            v-model="inputIdea"
            placeholder="Describe your video idea..."
            class="idea-textarea"
            :disabled="isRunning"
            @keydown.enter.ctrl="generate"
            @keydown.enter.meta="generate"
          />
          <div class="input-actions">
            <div class="options-toggle">
              <label class="toggle-label">
                <input type="checkbox" v-model="showAdvanced" />
                <span>Advanced</span>
              </label>
            </div>
            <button
              class="btn btn-primary"
              @click="generate"
              :disabled="!inputIdea.trim() || isRunning"
            >
              <span v-if="!isRunning">Generate</span>
              <span v-else class="spinner">...</span>
            </button>
          </div>

          <!-- Advanced options (collapsible) -->
          <div v-if="showAdvanced" class="advanced-options">
            <div class="option-row">
              <label>Music Style</label>
              <input v-model="musicStyle" placeholder="e.g., upbeat, cinematic" />
            </div>
            <div class="option-row">
              <label>Voice</label>
              <select v-model="voiceGender">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div class="option-row">
              <label class="checkbox-label">
                <input type="checkbox" v-model="instrumental" />
                <span>Instrumental (no lyrics)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Settings Drawer -->
    <div v-if="showSettings" class="settings-drawer" @click.self="showSettings = false">
      <div class="settings-panel">
        <div class="settings-header">
          <h3>Settings</h3>
          <button class="close-btn" @click="showSettings = false">✕</button>
        </div>

        <div class="settings-content">
          <div class="setting-group">
            <label>API Key</label>
            <div class="setting-input-row">
              <input
                v-model="settingsApiKey"
                :type="showSettingsApiKeyValue ? 'text' : 'password'"
                placeholder="sk-…"
                class="settings-input"
              />
              <button
                class="visibility-btn"
                @click="showSettingsApiKeyValue = !showSettingsApiKeyValue"
              >
                {{ showSettingsApiKeyValue ? '🙈' : '👁' }}
              </button>
            </div>
            <button class="btn btn-small btn-secondary" @click="updateApiKeySetting">
              Update
            </button>
          </div>

          <div class="setting-group">
            <label>Cost per video</label>
            <p class="setting-value">${{ totalCostUsd.toFixed(3) }}</p>
          </div>

          <button class="btn btn-small btn-danger" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { proxyMediaUrl } from '@/utils/videoStudioProxy';
import { IGenerationRecord } from '@/models';

export default defineComponent({
  name: 'StudioChatIndex',
  data() {
    return {
      apiKeyInput: '',
      settingsApiKey: '',
      showApiKeyInputValue: false,
      showSettingsApiKeyValue: false,
      inputIdea: '',
      musicStyle: 'cinematic, upbeat, motivational',
      voiceGender: 'male' as 'male' | 'female',
      instrumental: true,
      showAdvanced: false,
      showSettings: false,
      selectedHistoryId: null as string | null,
      selectedHistory: null as IGenerationRecord | null,

      templates: [
        'The one habit that separates top 1% founders from everyone else',
        'Why most people fail at building habits (and how to fix it)',
        '5 signs you\'re more productive than you think',
        'The morning routine that changed my life'
      ]
    };
  },

  computed: {
    vs(): any { return (this.$store.state as any).videoStudio; },
    userToken(): string { return (this.$store.state as any).token?.access || ''; },
    hasApiKey(): boolean {
      return !!this.vs.apiKey || !!this.apiKeyInput.trim();
    },
    history(): IGenerationRecord[] {
      return this.vs.history || [];
    },
    steps(): any[] { return this.vs.steps; },
    isRunning(): boolean {
      return this.steps.some((s: any) => s.status === 'running' || s.status === 'polling');
    },
    scriptOutput(): any { return this.vs.scriptOutput; },
    finalAudioUrl(): string { return proxyMediaUrl(this.vs.finalAudioUrl); },
    finalVideoUrl(): string { return proxyMediaUrl(this.vs.finalVideoUrl); },
    voiceoverUrl(): string {
      const step = this.steps.find((s: any) => s.id === 'voiceover');
      return proxyMediaUrl(step?.output?.audio_url as string | undefined);
    },
    totalCostUsd(): number { return this.vs.totalCostUsd; },
    currentGeneration(): boolean {
      return !!(this.inputIdea || this.isRunning || this.finalVideoUrl);
    },
    displayIdea(): string {
      return this.selectedHistory?.idea || this.inputIdea;
    }
  },

  mounted() {
    const saved = localStorage.getItem('video_studio_api_key');
    if (saved && !this.vs.apiKey) {
      this.$store.dispatch('videoStudio/setApiKey', saved);
    }
    this.settingsApiKey = this.vs.apiKey;
  },

  methods: {
    saveApiKey() {
      if (!this.apiKeyInput.trim()) return;
      this.$store.dispatch('videoStudio/setApiKey', this.apiKeyInput);
      localStorage.setItem('video_studio_api_key', this.apiKeyInput);
      this.apiKeyInput = '';
    },

    updateApiKeySetting() {
      if (!this.settingsApiKey.trim()) return;
      this.$store.dispatch('videoStudio/setApiKey', this.settingsApiKey);
      localStorage.setItem('video_studio_api_key', this.settingsApiKey);
      this.showSettings = false;
    },

    useTemplate(template: string) {
      this.inputIdea = template;
      this.$nextTick(() => {
        const textarea = document.querySelector('.idea-textarea') as HTMLTextAreaElement;
        if (textarea) {
          textarea.focus();
        }
      });
    },

    async generate() {
      if (!this.inputIdea.trim() || !this.vs.apiKey) return;

      this.$store.dispatch('videoStudio/setConfig', {
        idea: this.inputIdea,
        musicStyle: this.musicStyle,
        voiceGender: this.voiceGender,
        instrumental: this.instrumental
      });

      try {
        await this.$store.dispatch('videoStudio/runPipeline');

        const record: IGenerationRecord = {
          id: Date.now().toString(),
          idea: this.inputIdea,
          createdAt: new Date().toISOString(),
          status: 'done',
          scriptOutput: this.vs.scriptOutput,
          finalVideoUrl: this.vs.finalVideoUrl,
          finalAudioUrl: this.vs.finalAudioUrl,
          totalCostUsd: this.vs.totalCostUsd
        };

        this.$store.commit('videoStudio/addHistoryEntry', record);
      } catch (err: unknown) {
        console.error('Generation error:', err);
      }
    },

    selectHistory(record: IGenerationRecord) {
      this.selectedHistoryId = record.id;
      this.selectedHistory = record;
      this.inputIdea = '';
      this.$store.commit('videoStudio/resetPipeline');
      // Load the record's output into steps
      if (record.scriptOutput) {
        this.$store.commit('videoStudio/setScriptOutput', record.scriptOutput);
      }
      if (record.finalVideoUrl) {
        this.$store.commit('videoStudio/setFinalUrls', {
          videoUrl: record.finalVideoUrl,
          audioUrl: record.finalAudioUrl
        });
      }
      this.steps.forEach((step: any) => {
        if (
          (step.id === 'script' && record.scriptOutput) ||
          (step.id === 'music' && record.finalAudioUrl) ||
          (step.id === 'video' && record.finalVideoUrl)
        ) {
          this.$store.commit('videoStudio/setStepStatus', {
            id: step.id,
            status: 'done'
          });
        }
      });
    },

    startNewGeneration() {
      this.selectedHistoryId = null;
      this.selectedHistory = null;
      this.inputIdea = '';
      this.$store.commit('videoStudio/resetPipeline');
    },

    formatTime(isoString: string): string {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString();
    },

    logout() {
      // Simple logout - could integrate with actual auth
      this.$store.commit('videoStudio/clearHistory');
      this.showSettings = false;
    }
  }
});
</script>

<style scoped lang="scss">
$brand-primary: #8b5cf6;
$brand-primary-dark: #7c3aed;
$bg-dark: #0b0d17;
$bg-darker: #05060c;
$surface: #111427;
$surface-light: #1a1d2e;
$text-primary: #ffffff;
$text-secondary: #a0a0a0;
$text-muted: #666;
$accent-success: #00d084;
$accent-error: #ff4444;
$border-color: #252840;

* { box-sizing: border-box; }

.studio-chat {
  display: grid;
  grid-template-columns: 260px 1fr;
  height: 100vh;
  background: $bg-darker;
  color: $text-primary;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ────────────────────────────────────────────────────────────────────────────

.studio-sidebar {
  background: rgba($surface, 0.7);
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.new-chat-btn {
  background: linear-gradient(135deg, $brand-primary 0%, $brand-primary-dark 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba($brand-primary, 0.3);
  }

  .btn-icon {
    font-size: 18px;
  }
}

.history-section {
  h3 {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $text-secondary;
    margin: 0 0 10px 0;
  }
}

.empty-history {
  text-align: center;
  padding: 16px 0;
  font-size: 12px;
  color: $text-muted;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history-item {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:hover {
    background: rgba($brand-primary, 0.05);
    border-color: rgba($brand-primary, 0.1);
  }

  &.active {
    background: rgba($brand-primary, 0.1);
    border-color: rgba($brand-primary, 0.3);
  }

  .history-preview {
    font-size: 12px;
    color: $text-primary;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .history-time {
    font-size: 10px;
    color: $text-muted;
  }
}

.signin-section {
  background: rgba($brand-primary, 0.08);
  border: 1px solid rgba($brand-primary, 0.15);
  border-radius: 8px;
  padding: 16px;
  text-align: center;

  p {
    font-size: 12px;
    margin: 0 0 12px 0;
    line-height: 1.5;
  }

  .signin-btn {
    background: $brand-primary;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;

    &:hover {
      background: $brand-primary-dark;
    }
  }
}

.sidebar-footer {
  border-top: 1px solid $border-color;
  padding-top: 16px;

  .settings-btn {
    background: transparent;
    border: 1px solid $border-color;
    border-radius: 6px;
    padding: 8px 12px;
    color: $text-secondary;
    font-size: 12px;
    width: 100%;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: $brand-primary;
      color: $brand-primary;
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN AREA
// ────────────────────────────────────────────────────────────────────────────

.studio-main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

// ── API Key Gate ──

.api-key-gate {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba($brand-primary, 0.02) 0%, transparent 100%);
}

.gate-card {
  background: $surface;
  border: 1px solid rgba($brand-primary, 0.15);
  border-radius: 12px;
  padding: 40px;
  max-width: 400px;
  text-align: center;

  .gate-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  h2 {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: $text-secondary;
    margin: 0 0 24px 0;
  }

  .form-group {
    margin-bottom: 20px;
    display: flex;
    gap: 8px;
  }

  .gate-input {
    flex: 1;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba($brand-primary, 0.2);
    border-radius: 8px;
    padding: 11px 14px;
    color: $text-primary;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
    font-family: monospace;

    &:focus {
      border-color: $brand-primary;
      background: rgba(0, 0, 0, 0.3);
    }
  }

  .visibility-btn {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba($brand-primary, 0.2);
    border-radius: 8px;
    width: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;

    &:hover {
      border-color: $brand-primary;
    }
  }

  .gate-help {
    font-size: 12px;
    color: $text-muted;
    margin-top: 16px;

    a {
      color: $brand-primary;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// ── Empty State ──

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-header {
  margin-bottom: 60px;

  h1 {
    font-size: 42px;
    font-weight: 800;
    margin: 0 0 12px 0;
    background: linear-gradient(135deg, $text-primary 0%, $brand-primary 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    font-size: 16px;
    color: $text-secondary;
    margin: 0;
    max-width: 400px;
  }
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 1000px;
}

.template-card {
  background: rgba($surface, 0.6);
  border: 1px solid rgba($brand-primary, 0.1);
  border-radius: 10px;
  padding: 20px;
  text-align: left;
  font-size: 14px;
  line-height: 1.6;
  color: $text-primary;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba($surface, 0.8);
    border-color: rgba($brand-primary, 0.3);
    transform: translateY(-2px);
  }
}

// ── Conversation ──

.conversation {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  animation: slideUp 0.4s ease-out;
}

.user-message {
  margin-bottom: 20px;

  .message-content {
    background: $brand-primary;
    color: white;
    border-radius: 10px;
    padding: 14px 18px;
    max-width: 60%;
    font-size: 14px;
    line-height: 1.6;
    margin-left: auto;
  }
}

.pipeline-message {
  &.pipeline-idle {
    opacity: 0.5;
  }
}

.pipeline-step-card {
  background: rgba($surface, 0.6);
  border: 1px solid rgba($brand-primary, 0.1);
  border-radius: 10px;
  padding: 16px;
  overflow: hidden;
}

.step-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;

  .step-status-icon {
    font-size: 20px;
    margin-top: 2px;
    flex-shrink: 0;

    .idle {
      color: $text-muted;
    }

    .running {
      color: $brand-primary;
      animation: pulse 1s ease-in-out infinite;
    }

    .done {
      color: $accent-success;
    }

    .error {
      color: $accent-error;
    }
  }

  .step-info {
    flex: 1;
    min-width: 0;

    h4 {
      font-size: 13px;
      font-weight: 700;
      margin: 0 0 2px 0;
      color: $text-primary;
    }

    p {
      font-size: 11px;
      color: $text-muted;
      margin: 0;
    }
  }

  .step-cost {
    font-size: 11px;
    color: $brand-primary;
    font-weight: 600;
    flex-shrink: 0;
  }
}

.step-content {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid $border-color;
}

.script-hook {
  font-size: 15px;
  font-weight: 700;
  color: $brand-primary;
  margin-bottom: 8px;
  line-height: 1.4;
}

.script-body {
  font-size: 13px;
  color: $text-primary;
  line-height: 1.6;
  margin-bottom: 8px;
}

.script-cta {
  font-size: 12px;
  font-weight: 600;
  color: $brand-primary;
  margin-top: 8px;
}

.media-player {
  width: 100%;
  height: 32px;
  border-radius: 4px;
}

.video-player {
  width: 100%;
  max-width: 300px;
  border-radius: 6px;
  background: #000;
}

.step-loader {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
}

.loader-bars {
  display: flex;
  gap: 4px;
  align-items: flex-end;

  span {
    width: 3px;
    background: $brand-primary;
    border-radius: 2px;
    animation: loader 1.2s ease-in-out infinite;

    &:nth-child(1) { animation-delay: 0s; height: 8px; }
    &:nth-child(2) { animation-delay: 0.2s; height: 12px; }
    &:nth-child(3) { animation-delay: 0.4s; height: 8px; }
  }
}

@keyframes loader {
  0%, 100% { transform: scaleY(0.8); opacity: 0.5; }
  50% { transform: scaleY(1.2); opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

// ────────────────────────────────────────────────────────────────────────────
// INPUT AREA
// ────────────────────────────────────────────────────────────────────────────

.input-area {
  border-top: 1px solid $border-color;
  background: rgba($surface, 0.4);
  padding: 16px 24px 24px;
}

.input-container {
  max-width: 900px;
  margin: 0 auto;
}

.idea-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba($brand-primary, 0.1);
  border-radius: 10px;
  padding: 12px 14px;
  color: $text-primary;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  resize: none;
  max-height: 100px;
  margin-bottom: 12px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: rgba($brand-primary, 0.3);
    background: rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
  }

  &::placeholder {
    color: $text-muted;
  }
}

.input-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.options-toggle {
  .toggle-label {
    font-size: 12px;
    color: $text-secondary;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;

    input {
      cursor: pointer;
    }
  }
}

.advanced-options {
  margin-top: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 12px;

  label {
    font-size: 12px;
    color: $text-secondary;
    min-width: 100px;
  }

  input[type="text"],
  select {
    flex: 1;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba($brand-primary, 0.1);
    border-radius: 6px;
    padding: 6px 10px;
    color: $text-primary;
    font-size: 12px;
    outline: none;

    &:focus {
      border-color: rgba($brand-primary, 0.3);
    }
  }

  &.checkbox-label {
    label {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
      min-width: auto;

      input {
        cursor: pointer;
      }
    }
  }
}

.spinner {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// ────────────────────────────────────────────────────────────────────────────
// BUTTONS
// ────────────────────────────────────────────────────────────────────────────

.btn {
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;

  &.btn-primary {
    background: linear-gradient(135deg, $brand-primary 0%, $brand-primary-dark 100%);
    color: white;
    padding: 10px 20px;
    font-size: 13px;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba($brand-primary, 0.3);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &.btn-secondary {
    background: transparent;
    border: 1px solid $border-color;
    color: $text-secondary;
    padding: 10px 20px;
    font-size: 13px;

    &:hover {
      border-color: $brand-primary;
      color: $brand-primary;
    }
  }

  &.btn-small {
    padding: 6px 12px;
    font-size: 12px;
  }

  &.btn-danger {
    background: rgba($accent-error, 0.1);
    color: $accent-error;
    border: 1px solid rgba($accent-error, 0.2);

    &:hover {
      background: rgba($accent-error, 0.2);
      border-color: $accent-error;
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// SETTINGS DRAWER
// ────────────────────────────────────────────────────────────────────────────

.settings-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 360px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  animation: slideFromRight 0.3s ease-out;
}

@keyframes slideFromRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.settings-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 360px;
  background: $bg-dark;
  border-left: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 600px) {
    width: 100%;
  }
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid $border-color;

  h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 20px;
    color: $text-secondary;
    cursor: pointer;
  }
}

.settings-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-group {
  label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $text-secondary;
    margin-bottom: 8px;
  }

  .setting-input-row {
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
  }

  .settings-input {
    flex: 1;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid $border-color;
    border-radius: 6px;
    padding: 8px 10px;
    color: $text-primary;
    font-size: 12px;
    outline: none;

    &:focus {
      border-color: $brand-primary;
    }
  }

  .visibility-btn {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid $border-color;
    border-radius: 6px;
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;

    &:hover {
      border-color: $brand-primary;
    }
  }

  .setting-value {
    font-size: 14px;
    color: $text-primary;
    font-weight: 600;
    margin: 0;
  }
}
</style>
