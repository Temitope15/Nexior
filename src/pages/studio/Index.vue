<template>
  <div class="studio-chat">
    <!-- Sidebar -->
    <aside class="studio-sidebar">
      <div class="sidebar-brand">
        <span class="brand-mark">VRX</span>
        <span class="brand-rule" />
        <span class="brand-name">Voirax</span>
      </div>

      <div class="sidebar-content">
        <button class="new-chat-btn" @click="startNewGeneration">
          <span class="btn-icon">+</span>
          <span>New take</span>
        </button>

        <div v-if="userToken" class="history-section">
          <h3>Recent reels</h3>
          <div v-if="history.length === 0" class="empty-history">
            <p>No takes yet.</p>
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
              <span class="history-preview">{{ record.idea.substring(0, 40) }}…</span>
              <span class="history-time">{{ formatTime(record.createdAt) }}</span>
            </button>
          </div>
        </div>

        <div v-else class="signin-section">
          <p>Sign in to keep your reels.</p>
          <button class="signin-btn" @click="$store.dispatch('login')">
            Sign in
          </button>
        </div>
      </div>

      <div class="sidebar-footer">
        <button class="settings-btn" @click="showSettings = !showSettings">
          <span class="settings-dot" /> Settings
        </button>
      </div>
    </aside>

    <!-- Main Chat Area -->
    <main class="studio-main">
      <!-- API Key Gate -->
      <div v-if="!hasApiKey" class="api-key-gate">
        <div class="gate-card">
          <div class="gate-head">
            <span class="gate-num">00</span>
            <span class="gate-tag">First take</span>
          </div>
          <h2>Bring your own <em>key.</em></h2>
          <p>Paste your Ace Data Cloud token. It never leaves your browser.</p>

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
              :aria-label="showApiKeyInputValue ? 'Hide key' : 'Show key'"
            >
              {{ showApiKeyInputValue ? '◐' : '○' }}
            </button>
          </div>

          <button class="btn btn-primary" @click="saveApiKey" :disabled="!apiKeyInput.trim()">
            Continue to studio →
          </button>

          <p class="gate-help">
            No key yet? Request one at
            <a href="https://platform.acedata.cloud" target="_blank" rel="noopener">platform.acedata.cloud</a>.
          </p>
        </div>
      </div>

      <!-- Empty State with Templates -->
      <div v-else-if="!currentGeneration && !selectedHistory" class="empty-state">
        <div class="empty-meta">
          <span class="empty-num">VRX-001</span>
          <span class="empty-tag">Today's take</span>
        </div>
        <h1 class="empty-title">What's the <em>idea?</em></h1>
        <p class="empty-lede">Write a sentence. We'll bring the crew.</p>

        <div class="templates-list">
          <div class="templates-head">
            <span class="templates-tag">↳ Or borrow one</span>
          </div>
          <button
            v-for="(template, idx) in templates"
            :key="idx"
            class="template-row"
            @click="useTemplate(template)"
          >
            <span class="template-num">{{ String(idx + 1).padStart(2, '0') }}</span>
            <span class="template-text">{{ template }}</span>
            <span class="template-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <!-- Conversation View -->
      <div v-else class="conversation">
        <div class="messages-container">
          <!-- User message -->
          <div v-if="displayIdea" class="message user-message">
            <div class="message-meta">
              <span class="message-num">▶</span>
              <span class="message-tag">Idea</span>
            </div>
            <div class="message-content">
              {{ displayIdea }}
            </div>
          </div>

          <!-- Pipeline steps as animated messages -->
          <div
            v-for="(step, idx) in steps"
            :key="step.id"
            class="message pipeline-message"
            :class="`pipeline-${step.status}`"
          >
            <div class="pipeline-step-card">
              <div class="step-header">
                <div class="step-status-icon">
                  <span v-if="step.status === 'idle'" class="idle">{{ String(idx + 1).padStart(2, '0') }}</span>
                  <span v-else-if="step.status === 'running' || step.status === 'polling'" class="running">⊙</span>
                  <span v-else-if="step.status === 'done'" class="done">✓</span>
                  <span v-else class="error">✕</span>
                </div>
                <div class="step-info">
                  <h4>{{ step.label }}</h4>
                  <p>
                    {{ step.description }}<template v-if="step.output && step.output.provider_label">
                      <span class="step-provider"> · via {{ step.output.provider_label }}</span>
                    </template>
                  </p>
                </div>
                <div class="step-cost">${{ step.costUsd.toFixed(3) }}</div>
              </div>

              <!-- Script output -->
              <div v-if="step.id === 'script' && scriptOutput" class="step-content">
                <div class="script-hook">"{{ scriptOutput.hook }}"</div>
                <div class="script-body">{{ scriptOutput.body }}</div>
                <div class="script-cta">— {{ scriptOutput.cta }}</div>
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
                <span class="loader-text">Rolling…</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area (always at bottom) -->
      <div v-if="hasApiKey" class="input-area">
        <div class="input-container">
          <div class="input-meta">
            <span class="input-num">▶</span>
            <span class="input-tag">The idea</span>
          </div>
          <textarea
            v-model="inputIdea"
            placeholder="A line, a paragraph, a feeling…"
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
              <span v-if="!isRunning">Begin a take →</span>
              <span v-else>Rolling…</span>
            </button>
          </div>

          <!-- Advanced options (collapsible) -->
          <div v-if="showAdvanced" class="advanced-options">
            <div class="option-row">
              <label>Score · style</label>
              <input v-model="musicStyle" placeholder="cinematic, motivational, 120bpm" />
            </div>
            <div class="option-row">
              <label>Voice</label>
              <select v-model="voiceGender">
                <option value="male">Male narrator</option>
                <option value="female">Female narrator</option>
              </select>
            </div>
            <div class="option-row">
              <label class="checkbox-label">
                <input type="checkbox" v-model="instrumental" />
                <span>Instrumental score (no lyrics)</span>
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
          <div class="settings-meta">
            <span class="settings-num">↳</span>
            <span class="settings-tag">Settings</span>
          </div>
          <button class="close-btn" @click="showSettings = false" aria-label="Close">×</button>
        </div>

        <div class="settings-content">
          <div class="setting-group">
            <label>Ace Data Cloud · API key</label>
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
                :aria-label="showSettingsApiKeyValue ? 'Hide key' : 'Show key'"
              >
                {{ showSettingsApiKeyValue ? '◐' : '○' }}
              </button>
            </div>
            <button class="btn btn-small btn-secondary" @click="updateApiKeySetting">
              Update key
            </button>
          </div>

          <div class="setting-group">
            <label>Credits</label>
            <a href="https://platform.acedata.cloud" target="_blank" rel="noopener" class="topup-link">
              <span class="topup-icon">$</span>
              <span class="topup-label">Top up on platform</span>
              <span class="topup-arrow">↗</span>
            </a>
          </div>

          <div class="setting-group">
            <label>Cost per take</label>
            <p class="setting-value"><span class="setting-currency">$</span>{{ totalCostUsd.toFixed(3) }}</p>
          </div>

          <button class="btn btn-small btn-danger" @click="logout">
            Clear history
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue';
import { ElNotification, ElMessage } from 'element-plus';
import { proxyMediaUrl } from '@/utils/videoStudioProxy';
import { IGenerationRecord } from '@/models';

// Sanitize the typo in AceData's own error messages.
const cleanMessage = (msg: string) => msg.replace(/platfrom\.acedata\.cloud/gi, 'platform.acedata.cloud');

const isBalanceError = (msg: string) =>
  /\b(used.?up|balance|insufficient|out of credit|exhausted)\b/i.test(msg);
const isAuthError = (msg: string) =>
  /\b(unauthorized|invalid.*(key|token)|authentication failed)\b/i.test(msg);

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
        const raw = err instanceof Error ? err.message : 'Generation failed.';
        this.surfaceError(cleanMessage(raw));
      }
    },

    surfaceError(message: string) {
      if (isBalanceError(message)) {
        ElNotification({
          title: 'Balance exhausted',
          duration: 0,
          customClass: 'vx-notify vx-notify--balance',
          message: h('div', { class: 'vx-notify__body' }, [
            h('p', { class: 'vx-notify__lede' },
              'Your Ace Data Cloud credits ran out before the take could finish.'
            ),
            h('a', {
              href: 'https://platform.acedata.cloud',
              target: '_blank',
              rel: 'noopener',
              class: 'vx-notify__cta'
            }, [
              h('span', { class: 'vx-notify__cta-icon' }, '$'),
              h('span', { class: 'vx-notify__cta-label' }, 'Top up on platform'),
              h('span', { class: 'vx-notify__cta-arrow', 'aria-hidden': 'true' }, '↗')
            ])
          ])
        });
        return;
      }
      if (isAuthError(message)) {
        ElNotification({
          title: 'API key invalid',
          duration: 6000,
          customClass: 'vx-notify vx-notify--auth',
          message: h('div', { class: 'vx-notify__body' }, [
            h('p', { class: 'vx-notify__lede' }, 'Your Ace Data Cloud key looks invalid or expired.'),
            h('a', {
              href: 'https://platform.acedata.cloud',
              target: '_blank',
              rel: 'noopener',
              class: 'vx-notify__cta vx-notify__cta--ghost'
            }, [
              h('span', { class: 'vx-notify__cta-label' }, 'Get a new key'),
              h('span', { class: 'vx-notify__cta-arrow', 'aria-hidden': 'true' }, '↗')
            ])
          ])
        });
        return;
      }
      ElMessage({
        type: 'error',
        message,
        duration: 6000,
        customClass: 'vx-notify vx-notify--inline'
      });
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
/* ============================================================================
 * VOIRAX · Studio (chat surface) — Editorial Cinema
 * Tokens come from src/assets/scss/_tokens.scss applied at :root.
 * ========================================================================== */

* { box-sizing: border-box; }

.studio-chat {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100vh;
  background: var(--vx-ink);
  color: var(--vx-bone);
  font-family: var(--vx-font-sans);
  font-feature-settings: 'ss01', 'ss02';
  position: relative;
  overflow: hidden;

  /* fixed grain + vignette atmosphere */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.05;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.93  0 0 0 0 0.89  0 0 0 0 0.83  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    background-size: 160px 160px;
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at 50% 0%, transparent 0%, rgba(0,0,0,0.55) 80%);
  }
  > * { position: relative; z-index: 1; }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

/* ── SIDEBAR ─────────────────────────────────────────────────────── */
.studio-sidebar {
  background: var(--vx-ink-soft);
  border-right: 1px solid var(--vx-rule);
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;

  @media (max-width: 768px) { display: none; }
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--vx-rule);
}
.brand-mark {
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--vx-ember);
  padding: 3px 7px;
  border: 1px solid var(--vx-ember);
  border-radius: 2px;
  line-height: 1;
}
.brand-rule { width: 18px; height: 1px; background: var(--vx-rule-strong); }
.brand-name {
  font-family: var(--vx-font-display);
  font-style: italic;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: -0.01em;
  font-variation-settings: 'opsz' 14;
  color: var(--vx-bone);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 22px 20px;
}

.new-chat-btn {
  background: var(--vx-bone);
  color: var(--vx-ink);
  border: none;
  border-radius: 2px;
  padding: 12px 16px;
  font-family: var(--vx-font-sans);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.005em;
  transition: background 220ms ease, transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1);

  &:hover {
    background: var(--vx-ember);
    transform: translateY(-1px);
  }

  .btn-icon {
    font-family: var(--vx-font-mono);
    font-size: 14px;
    border-right: 1px solid rgba(0, 0, 0, 0.18);
    padding-right: 10px;
    line-height: 1;
    color: var(--vx-ember-deep);
  }
}

.history-section h3 {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vx-ash);
  margin: 0 0 12px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vx-rule);
}

.empty-history {
  text-align: left;
  padding: 8px 0 0;
  font-family: var(--vx-font-sans);
  font-size: 12px;
  color: var(--vx-ash);
  font-style: italic;
}

.history-list {
  display: flex;
  flex-direction: column;
}

.history-item {
  background: transparent;
  border: 0;
  border-bottom: 1px dotted var(--vx-rule);
  padding: 12px 0;
  text-align: left;
  cursor: pointer;
  transition: padding 220ms ease, color 220ms ease;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:last-child { border-bottom: 0; }
  &:hover {
    padding-left: 6px;
    .history-preview { color: var(--vx-ember); }
  }
  &.active {
    .history-preview { color: var(--vx-ember); }
    .history-time::before { background: var(--vx-ember); }
  }

  .history-preview {
    font-family: var(--vx-font-display);
    font-weight: 400;
    font-size: 14px;
    color: var(--vx-bone);
    letter-spacing: -0.005em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 220ms ease;
    font-variation-settings: 'opsz' 14;
  }
  .history-time {
    font-family: var(--vx-font-mono);
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--vx-ash);
    display: inline-flex;
    align-items: center;
    gap: 6px;

    &::before {
      content: '';
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--vx-rule-strong);
      transition: background 220ms ease;
    }
  }
}

.signin-section {
  border: 1px solid var(--vx-rule);
  border-radius: 2px;
  padding: 16px;

  p {
    font-family: var(--vx-font-sans);
    font-size: 12px;
    color: var(--vx-bone-soft);
    margin: 0 0 12px 0;
    line-height: 1.55;
  }

  .signin-btn {
    background: transparent;
    color: var(--vx-bone);
    border: 1px solid var(--vx-rule-strong);
    border-radius: 2px;
    padding: 9px 14px;
    font-family: var(--vx-font-sans);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    transition: color 220ms ease, border-color 220ms ease;

    &:hover { color: var(--vx-ember); border-color: var(--vx-ember); }
  }
}

.sidebar-footer {
  border-top: 1px solid var(--vx-rule);
  padding: 14px 20px;

  .settings-btn {
    background: transparent;
    border: 0;
    color: var(--vx-bone-soft);
    font-family: var(--vx-font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    width: 100%;
    text-align: left;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    transition: color 220ms ease;

    &:hover { color: var(--vx-ember); .settings-dot { background: var(--vx-ember); } }
  }
}
.settings-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--vx-rule-strong);
  transition: background 220ms ease;
}

/* ── MAIN AREA ───────────────────────────────────────────────────── */
.studio-main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* ── API Key Gate ────────────────────────────────────────────────── */
.api-key-gate {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
}
.gate-card {
  position: relative;
  background: var(--vx-ink-soft);
  border: 1px solid var(--vx-rule-strong);
  border-radius: 4px;
  padding: 40px 36px;
  max-width: 460px;
  width: 100%;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);

  &::before {
    content: '';
    position: absolute;
    inset: 6px;
    border: 1px solid rgba(255, 122, 69, 0.18);
    border-radius: 2px;
    pointer-events: none;
  }
  .gate-head {
    display: flex;
    gap: 14px;
    margin-bottom: 20px;
    font-family: var(--vx-font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .gate-num { color: var(--vx-ember); }
  .gate-tag { color: var(--vx-ash); }

  h2 {
    font-family: var(--vx-font-display);
    font-weight: 350;
    font-size: 36px;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0 0 12px 0;
    font-variation-settings: 'opsz' 48;
    em { font-style: italic; color: var(--vx-ember); font-weight: 400; }
  }

  > p {
    font-family: var(--vx-font-sans);
    font-size: 14px;
    color: var(--vx-bone-soft);
    margin: 0 0 26px 0;
    line-height: 1.6;
  }

  .form-group {
    margin-bottom: 18px;
    display: flex;
    gap: 8px;
  }

  .gate-input {
    flex: 1;
    background: var(--vx-ink);
    border: 1px solid var(--vx-rule-strong);
    border-radius: 2px;
    padding: 12px 14px;
    color: var(--vx-bone);
    font-family: var(--vx-font-mono);
    font-size: 13px;
    outline: none;
    letter-spacing: 0.02em;
    transition: border-color 220ms ease;

    &::placeholder { color: var(--vx-ash-deep); }
    &:focus { border-color: var(--vx-ember); }
  }

  .visibility-btn {
    background: var(--vx-ink);
    border: 1px solid var(--vx-rule-strong);
    border-radius: 2px;
    width: 44px;
    color: var(--vx-bone-soft);
    cursor: pointer;
    transition: color 220ms ease, border-color 220ms ease;
    &:hover { color: var(--vx-ember); border-color: var(--vx-ember); }
  }

  .gate-help {
    font-family: var(--vx-font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    color: var(--vx-ash);
    margin-top: 18px;

    a {
      color: var(--vx-ember);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 200ms ease;
      &:hover { border-bottom-color: var(--vx-ember); }
    }
  }
}

/* ── Empty State ─────────────────────────────────────────────────── */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 56px 64px;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}
.empty-meta {
  display: inline-flex;
  gap: 14px;
  margin-bottom: 20px;
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.empty-num { color: var(--vx-ember); }
.empty-tag { color: var(--vx-ash); }
.empty-title {
  font-family: var(--vx-font-display);
  font-weight: 350;
  font-size: clamp(48px, 7vw, 88px);
  line-height: 0.96;
  letter-spacing: -0.03em;
  margin: 0 0 14px 0;
  color: var(--vx-bone);
  font-variation-settings: 'opsz' 96;
  em { font-style: italic; color: var(--vx-ember); font-weight: 400; }
}
.empty-lede {
  font-family: var(--vx-font-sans);
  font-size: 16px;
  line-height: 1.6;
  color: var(--vx-bone-soft);
  margin: 0 0 56px 0;
  max-width: 480px;
}

.templates-list {
  border-top: 1px solid var(--vx-rule-strong);
}
.templates-head {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vx-ash);
  padding: 14px 0 6px;
}
.template-row {
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--vx-rule);
  padding: 18px 0;
  text-align: left;
  cursor: pointer;
  display: grid;
  grid-template-columns: 56px 1fr 24px;
  align-items: baseline;
  gap: 16px;
  width: 100%;
  font-family: var(--vx-font-display);
  font-weight: 400;
  font-size: 19px;
  color: var(--vx-bone);
  letter-spacing: -0.01em;
  font-variation-settings: 'opsz' 24;
  transition: padding 220ms ease, color 220ms ease, background 220ms ease;

  &:hover {
    padding-left: 16px;
    color: var(--vx-ember);
    background: linear-gradient(90deg, rgba(255, 122, 69, 0.04), transparent 60%);
    .template-num { color: var(--vx-ember); }
    .template-arrow { transform: translateX(4px); color: var(--vx-ember); }
  }
}
.template-num {
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--vx-ash);
  font-style: normal;
  transition: color 220ms ease;
}
.template-text { line-height: 1.3; }
.template-arrow {
  font-family: var(--vx-font-mono);
  font-size: 14px;
  color: var(--vx-ash-deep);
  transition: transform 220ms ease, color 220ms ease;
  text-align: right;
}

/* ── Conversation ────────────────────────────────────────────────── */
.conversation {
  flex: 1;
  overflow-y: auto;
  padding: 32px 64px;
}
.messages-container {
  max-width: 920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message { animation: msg-in 600ms cubic-bezier(0.2, 0.7, 0.2, 1); }
@keyframes msg-in {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}

.user-message {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;

  .message-meta {
    display: inline-flex;
    gap: 12px;
    font-family: var(--vx-font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--vx-ash);
    .message-num { color: var(--vx-ember); }
  }
  .message-content {
    background: transparent;
    color: var(--vx-bone);
    border-left: 1px solid var(--vx-ember);
    padding: 6px 0 6px 18px;
    font-family: var(--vx-font-display);
    font-style: italic;
    font-weight: 400;
    font-size: 22px;
    line-height: 1.35;
    letter-spacing: -0.01em;
    font-variation-settings: 'opsz' 24;
    max-width: 80%;
  }
}

.pipeline-message {
  &.pipeline-idle { opacity: 0.55; }
  &.pipeline-error .pipeline-step-card { border-color: rgba(217, 106, 91, 0.4); }
  &.pipeline-done .pipeline-step-card { border-color: rgba(255, 122, 69, 0.25); }
}

.pipeline-step-card {
  background: var(--vx-ink-soft);
  border: 1px solid var(--vx-rule);
  border-radius: 2px;
  padding: 18px 20px;
  transition: border-color 220ms ease;
}

.step-header {
  display: grid;
  grid-template-columns: 36px 1fr auto;
  align-items: baseline;
  gap: 16px;

  .step-status-icon {
    font-family: var(--vx-font-mono);
    font-size: 13px;
    flex-shrink: 0;
    line-height: 1;

    .idle {
      color: var(--vx-ash-deep);
      font-size: 11px;
      letter-spacing: 0.06em;
    }
    .running {
      color: var(--vx-ember);
      font-size: 16px;
      animation: vx-pulse 1.4s ease-in-out infinite;
    }
    .done {
      color: var(--vx-ember);
      font-size: 14px;
    }
    .error {
      color: var(--vx-err);
      font-size: 14px;
    }
  }

  .step-info {
    flex: 1;
    min-width: 0;

    h4 {
      font-family: var(--vx-font-display);
      font-weight: 400;
      font-size: 18px;
      letter-spacing: -0.01em;
      color: var(--vx-bone);
      margin: 0 0 3px 0;
      font-variation-settings: 'opsz' 18;
    }

    p {
      font-family: var(--vx-font-sans);
      font-size: 12px;
      color: var(--vx-bone-soft);
      margin: 0;
      line-height: 1.5;
    }
    .step-provider {
      font-family: var(--vx-font-mono);
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--vx-ember);
    }
  }

  .step-cost {
    font-family: var(--vx-font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    color: var(--vx-ash);
    flex-shrink: 0;
  }
}

@keyframes vx-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(0.92); }
}

.step-content {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--vx-rule);
}

.script-hook {
  font-family: var(--vx-font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 22px;
  line-height: 1.25;
  color: var(--vx-bone);
  letter-spacing: -0.015em;
  margin-bottom: 14px;
  font-variation-settings: 'opsz' 24;
}

.script-body {
  font-family: var(--vx-font-sans);
  font-size: 14px;
  color: var(--vx-bone-soft);
  line-height: 1.7;
  margin-bottom: 14px;
}

.script-cta {
  font-family: var(--vx-font-display);
  font-style: italic;
  font-size: 14px;
  color: var(--vx-ember);
  margin-top: 8px;
  letter-spacing: -0.005em;
}

.media-player {
  width: 100%;
  height: 36px;
  filter: invert(0.92) hue-rotate(180deg);
}

.video-player {
  width: 100%;
  max-width: 320px;
  aspect-ratio: 9 / 16;
  background: var(--vx-ink);
  border: 1px solid var(--vx-rule-strong);
  border-radius: 2px;
  outline: none;
  object-fit: cover;
}

.step-loader {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid var(--vx-rule);
}

.loader-bars {
  display: flex;
  gap: 4px;
  align-items: flex-end;

  span {
    width: 2px;
    background: var(--vx-ember);
    border-radius: 1px;
    animation: vx-loader 1.2s ease-in-out infinite;

    &:nth-child(1) { animation-delay: 0s; height: 8px; }
    &:nth-child(2) { animation-delay: 0.2s; height: 14px; }
    &:nth-child(3) { animation-delay: 0.4s; height: 8px; }
  }
}

.loader-text {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vx-ember);
}

@keyframes vx-loader {
  0%, 100% { transform: scaleY(0.5); opacity: 0.6; }
  50% { transform: scaleY(1.4); opacity: 1; }
}

/* ── INPUT AREA ──────────────────────────────────────────────────── */
.input-area {
  border-top: 1px solid var(--vx-rule);
  background: var(--vx-ink-soft);
  padding: 22px 64px 28px;
}

.input-container {
  max-width: 920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-meta {
  display: inline-flex;
  gap: 12px;
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  .input-num { color: var(--vx-ember); }
  .input-tag { color: var(--vx-ash); }
}

.idea-textarea {
  width: 100%;
  background: var(--vx-ink);
  border: 1px solid var(--vx-rule-strong);
  border-radius: 2px;
  padding: 16px 18px;
  color: var(--vx-bone);
  font-family: var(--vx-font-display);
  font-style: italic;
  font-weight: 350;
  font-size: 18px;
  line-height: 1.45;
  letter-spacing: -0.005em;
  font-variation-settings: 'opsz' 18;
  resize: none;
  min-height: 80px;
  max-height: 140px;
  outline: none;
  transition: border-color 220ms ease, background 220ms ease;

  &:focus {
    border-color: var(--vx-ember);
    background: var(--vx-ink-up);
  }

  &:disabled { opacity: 0.55; }

  &::placeholder { color: var(--vx-ash-deep); font-style: italic; }
}

.input-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.options-toggle .toggle-label {
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--vx-ash);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  input { cursor: pointer; accent-color: var(--vx-ember); }
}

.advanced-options {
  margin-top: 4px;
  padding: 16px;
  background: var(--vx-ink);
  border: 1px solid var(--vx-rule);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-row {
  display: grid;
  grid-template-columns: 130px 1fr;
  align-items: center;
  gap: 14px;

  label {
    font-family: var(--vx-font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--vx-ash);
  }

  input[type="text"],
  input:not([type]),
  select {
    background: var(--vx-ink-soft);
    border: 1px solid var(--vx-rule-strong);
    border-radius: 2px;
    padding: 9px 12px;
    color: var(--vx-bone);
    font-family: var(--vx-font-sans);
    font-size: 13px;
    outline: none;
    transition: border-color 220ms ease;
    width: 100%;
    &:focus { border-color: var(--vx-ember); }
  }

  &.checkbox-label, .checkbox-label {
    label {
      display: flex;
      align-items: center;
      gap: 8px;
      letter-spacing: 0.06em;
      input { accent-color: var(--vx-ember); cursor: pointer; }
    }
  }
}

/* ── BUTTONS ─────────────────────────────────────────────────────── */
.btn {
  border: none;
  border-radius: 2px;
  font-family: var(--vx-font-sans);
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
              background 220ms ease,
              color 220ms ease,
              border-color 220ms ease;

  &.btn-primary {
    background: var(--vx-bone);
    color: var(--vx-ink);
    padding: 12px 22px;
    font-size: 13px;
    letter-spacing: 0.005em;

    &:hover:not(:disabled) {
      background: var(--vx-ember);
      transform: translateY(-1px);
    }

    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }

  &.btn-secondary {
    background: transparent;
    border: 1px solid var(--vx-rule-strong);
    color: var(--vx-bone-soft);
    padding: 10px 18px;
    font-size: 12px;

    &:hover { color: var(--vx-ember); border-color: var(--vx-ember); }
  }

  &.btn-small {
    padding: 8px 14px;
    font-size: 12px;
  }

  &.btn-danger {
    background: transparent;
    color: var(--vx-err);
    border: 1px solid rgba(217, 106, 91, 0.35);
    padding: 9px 14px;
    font-size: 12px;

    &:hover { background: rgba(217, 106, 91, 0.06); border-color: var(--vx-err); }
  }
}

/* ── SETTINGS DRAWER ─────────────────────────────────────────────── */
.settings-drawer {
  position: fixed;
  inset: 0;
  background: rgba(10, 9, 8, 0.6);
  backdrop-filter: blur(8px);
  z-index: 100;
  animation: drawer-fade 240ms ease;
}
@keyframes drawer-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.settings-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  background: var(--vx-ink-soft);
  border-left: 1px solid var(--vx-rule-strong);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: drawer-slide 280ms cubic-bezier(0.2, 0.7, 0.2, 1);

  @media (max-width: 600px) { width: 100%; }
}
@keyframes drawer-slide {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--vx-rule);
}
.settings-meta {
  display: inline-flex;
  gap: 12px;
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  .settings-num { color: var(--vx-ember); }
  .settings-tag { color: var(--vx-ash); }
}
.close-btn {
  background: transparent;
  border: 0;
  color: var(--vx-ash);
  font-size: 22px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: color 200ms ease;
  &:hover { color: var(--vx-ember); }
}

.settings-content {
  flex: 1;
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 10px;

  > label {
    font-family: var(--vx-font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--vx-ash);
    margin-bottom: 0;
  }

  .setting-input-row {
    display: flex;
    gap: 8px;
  }

  .settings-input {
    flex: 1;
    background: var(--vx-ink);
    border: 1px solid var(--vx-rule-strong);
    border-radius: 2px;
    padding: 10px 12px;
    color: var(--vx-bone);
    font-family: var(--vx-font-mono);
    font-size: 12px;
    letter-spacing: 0.02em;
    outline: none;
    transition: border-color 220ms ease;
    &:focus { border-color: var(--vx-ember); }
  }

  .visibility-btn {
    background: var(--vx-ink);
    border: 1px solid var(--vx-rule-strong);
    border-radius: 2px;
    width: 40px;
    color: var(--vx-bone-soft);
    cursor: pointer;
    transition: color 220ms ease, border-color 220ms ease;
    &:hover { color: var(--vx-ember); border-color: var(--vx-ember); }
  }

  .setting-value {
    font-family: var(--vx-font-display);
    font-weight: 400;
    font-size: 28px;
    color: var(--vx-bone);
    margin: 0;
    letter-spacing: -0.02em;
    font-variation-settings: 'opsz' 36;
    .setting-currency {
      font-style: italic;
      color: var(--vx-ember);
      font-size: 18px;
      margin-right: 1px;
    }
  }
}

.topup-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(255, 122, 69, 0.06);
  border: 1px solid rgba(255, 122, 69, 0.4);
  border-radius: 2px;
  text-decoration: none;
  color: var(--vx-ember);
  font-family: var(--vx-font-sans);
  font-size: 12px;
  transition: background 220ms ease, color 220ms ease, border-color 220ms ease;

  &:hover { background: var(--vx-ember); color: var(--vx-ink); border-color: var(--vx-ember); }

  .topup-icon {
    font-family: var(--vx-font-mono);
    font-size: 11px;
    width: 16px;
    height: 16px;
    line-height: 14px;
    text-align: center;
    border: 1px solid currentColor;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .topup-label { flex: 1; }
  .topup-arrow { font-family: var(--vx-font-mono); font-size: 11px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

<!--
  Non-scoped: Element Plus notifications/messages are teleported into <body>,
  so scoped selectors can't reach them. Override the chrome to match the
  editorial cinema theme defined in src/assets/scss/_tokens.scss.
-->
<style lang="scss">
.el-notification.vx-notify {
  background: var(--vx-ink-soft) !important;
  border: 1px solid var(--vx-rule-strong) !important;
  border-left: 2px solid var(--vx-ember) !important;
  border-radius: 2px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
  padding: 18px 18px 16px !important;
  width: 360px;
  max-width: 92vw;

  /* Inset double-frame, matches the API key gate */
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 6px;
    pointer-events: none;
    border: 1px solid rgba(255, 122, 69, 0.18);
    border-radius: 2px;
  }

  .el-notification__icon {
    color: var(--vx-ember) !important;
    font-size: 16px !important;
  }
  .el-notification__title {
    font-family: var(--vx-font-display) !important;
    font-style: italic;
    font-weight: 400 !important;
    font-size: 22px !important;
    letter-spacing: -0.015em !important;
    color: var(--vx-bone) !important;
    line-height: 1.15 !important;
    margin-bottom: 6px !important;
    font-variation-settings: 'opsz' 24;
  }
  .el-notification__content {
    margin: 0 !important;
    color: var(--vx-bone-soft) !important;
  }
  .el-notification__closeBtn {
    color: var(--vx-ash) !important;
    font-size: 16px !important;
    transition: color 200ms ease;
    &:hover { color: var(--vx-ember) !important; }
  }

  .vx-notify__body { display: flex; flex-direction: column; gap: 12px; }
  .vx-notify__lede {
    font-family: var(--vx-font-sans);
    font-size: 13px;
    line-height: 1.55;
    color: var(--vx-bone-soft);
    margin: 0;
  }
  .vx-notify__cta {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 9px 13px;
    background: var(--vx-ember);
    color: var(--vx-ink);
    text-decoration: none;
    border-radius: 2px;
    font-family: var(--vx-font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 500;
    transition: background 200ms ease, transform 200ms ease;
    &:hover { background: var(--vx-bone); transform: translateY(-1px); }

    &--ghost {
      background: transparent;
      color: var(--vx-bone);
      border: 1px solid var(--vx-rule-strong);
      &:hover { color: var(--vx-ember); border-color: var(--vx-ember); background: transparent; transform: translateY(-1px); }
    }
  }
  .vx-notify__cta-icon {
    width: 16px;
    height: 16px;
    line-height: 14px;
    text-align: center;
    border: 1px solid currentColor;
    border-radius: 50%;
    font-size: 10px;
  }
  .vx-notify__cta-arrow { font-size: 11px; opacity: 0.85; }
}

/* ElMessage (inline error toast) — match the editorial palette */
.el-message.vx-notify--inline {
  background: var(--vx-ink-soft) !important;
  border: 1px solid rgba(217, 106, 91, 0.4) !important;
  border-radius: 2px !important;
  padding: 11px 14px !important;
  min-width: 320px;
  max-width: 480px;

  .el-message__content {
    font-family: var(--vx-font-sans) !important;
    font-size: 13px !important;
    color: var(--vx-bone) !important;
    line-height: 1.5;
  }
  .el-message__icon { color: var(--vx-err) !important; }
  .el-message__closeBtn { color: var(--vx-ash) !important; &:hover { color: var(--vx-bone) !important; } }
}
</style>

