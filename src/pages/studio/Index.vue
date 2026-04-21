<template>
  <div class="studio">
    <!-- Top bar -->
    <header class="studio-header">
      <div class="header-left">
        <span class="header-logo">🎬</span>
        <div>
          <div class="header-title">Video Studio</div>
          <div class="header-sub">Convert any idea into a ready-to-post short-form video</div>
        </div>
      </div>
      <div v-if="isRunning" class="header-status">
        <span class="pulse-dot" />
        <span>Generating…</span>
      </div>
    </header>

    <div class="studio-layout">
      <!-- ── LEFT PANEL: config + pipeline ── -->
      <aside class="studio-sidebar">
        <!-- Idea input -->
        <div class="card">
          <label class="field-label">Your Idea</label>
          <textarea
            v-model="idea"
            class="idea-input"
            placeholder="e.g. The one habit that separates top 1% founders from everyone else"
            rows="4"
          />
        </div>

        <!-- Options -->
        <div class="card options-card">
          <div class="options-row">
            <div class="option-col">
              <label class="field-label">Music Style</label>
              <input v-model="musicStyle" class="text-input" placeholder="upbeat lo-fi, motivational" />
            </div>
            <div class="option-col">
              <label class="field-label">Voice Gender</label>
              <select v-model="voiceGender" class="select-input">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <label class="toggle-row" @click="instrumental = !instrumental">
            <span class="toggle-text">Instrumental (no lyrics)</span>
            <span class="toggle" :class="{ 'toggle--on': instrumental }">
              <span class="toggle-thumb" />
            </span>
          </label>
        </div>

        <!-- API credentials -->
        <div class="card">
          <div class="card-header-row" @click="credOpen = !credOpen">
            <span class="field-label" style="margin:0">API Credentials</span>
            <span class="chevron" :class="{ 'chevron--open': credOpen }">›</span>
          </div>
          <div v-if="credOpen" class="cred-body">
            <label class="field-label">Ace Data Cloud API Key</label>
            <div class="key-row">
              <input
                v-model="apiKey"
                :type="keyVisible ? 'text' : 'password'"
                class="text-input key-input"
                placeholder="sk-…"
                autocomplete="off"
              />
              <button class="icon-btn" @click="keyVisible = !keyVisible">{{ keyVisible ? '🙈' : '👁' }}</button>
            </div>
            <p class="hint-text">Your key is used only for API calls. It is never sent to our servers.</p>
            <label class="remember-row">
              <input type="checkbox" v-model="rememberKey" @change="onRememberChange" />
              <span>Remember in this browser</span>
            </label>

            <!-- Solana wallet -->
            <div class="wallet-section">
              <div class="field-label" style="margin-bottom:6px">PAY WITH SOLANA (X402)</div>
              <div v-if="!walletAddress" class="hint-text">Connect a wallet to pay per-generation via x402 protocol instead of using an API key.</div>
              <wallet-multi-button dark />
              <div v-if="walletAddress" class="wallet-addr">{{ walletAddress.slice(0, 6) }}…{{ walletAddress.slice(-4) }}</div>
            </div>
          </div>
        </div>

        <!-- Pipeline tracker -->
        <div class="card pipeline-card">
          <div class="section-label">Pipeline</div>
          <div
            v-for="step in steps"
            :key="step.id"
            class="step-row"
          >
            <div class="step-icon-wrap">
              <span v-if="step.status === 'idle'" class="step-icon step-icon--idle">{{ stepIndex(step.id) }}</span>
              <span v-else-if="step.status === 'running' || step.status === 'polling'" class="step-icon step-icon--running">
                <span class="step-spinner" />
              </span>
              <span v-else-if="step.status === 'done'" class="step-icon step-icon--done">✓</span>
              <span v-else class="step-icon step-icon--error">✕</span>
              <span v-if="stepIndex(step.id) < 4" class="step-line" :class="`step-line--${step.status}`" />
            </div>
            <div class="step-info">
              <div class="step-label" :class="`step-label--${step.status}`">{{ step.label }}</div>
              <div class="step-desc">{{ step.description }}</div>
              <div v-if="step.status === 'error'" class="step-error">{{ step.error }}</div>
            </div>
            <div class="step-cost">${{ step.costUsd.toFixed(3) }}</div>
          </div>
        </div>

        <!-- Cost summary -->
        <div class="card cost-card">
          <div class="cost-row" v-for="step in steps" :key="step.id + '-cost'">
            <span class="cost-name">{{ step.label }}</span>
            <span class="cost-val">${{ step.costUsd.toFixed(3) }}</span>
          </div>
          <div class="cost-total-row">
            <span>This generation</span>
            <span class="cost-total" :class="{ 'cost-total--cheap': totalCostUsd < 1 }">${{ totalCostUsd.toFixed(3) }}</span>
          </div>
          <div class="cost-compare">
            VS $30/MO SUBSCRIPTION — Pay only ${{ totalCostUsd.toFixed(3) }} instead of $1.00/day —
            <span class="cost-savings">{{ savings }}% cheaper per generation</span>
          </div>
        </div>

        <!-- Actions -->
        <button class="btn-generate" :disabled="!canGenerate || isRunning" @click="onGenerate">
          <span v-if="isRunning" class="btn-spinner" />
          {{ isRunning ? 'Generating…' : 'Generate Video' }}
        </button>

        <button v-if="walletAddress" class="btn-solana" :disabled="isRunning || isPaying" @click="onPayWithSolana">
          <span v-if="isPaying" class="btn-spinner" />
          {{ isPaying ? 'Paying…' : '◎ Pay with Solana' }}
        </button>

        <div v-if="paymentTx" class="status-pill status-pill--ok">
          ✓ Payment confirmed ·
          <a :href="`https://solscan.io/tx/${paymentTx}`" target="_blank" rel="noopener" class="tx-link">
            {{ paymentTx.slice(0, 8) }}…
          </a>
        </div>

        <div v-if="pipelineError" class="status-pill status-pill--err">
          {{ pipelineError }}
        </div>
      </aside>

      <!-- ── RIGHT PANEL: live results ── -->
      <main class="studio-output">
        <div class="output-empty" v-if="!hasAnyOutput">
          <div class="empty-icon">🎬</div>
          <div class="empty-title">Your video will appear here</div>
          <div class="empty-sub">Configure your idea on the left and click Generate Video to start the pipeline.</div>
        </div>

        <template v-else>
          <!-- Final video -->
          <div v-if="finalVideoUrl" class="output-card output-card--video">
            <div class="output-card-header">
              <span class="output-badge output-badge--done">✓ Final Video</span>
              <a :href="finalVideoUrl" download class="download-btn">↓ Download</a>
            </div>
            <video :src="finalVideoUrl" controls playsinline class="video-player" />
          </div>

          <!-- Script -->
          <div v-if="scriptOutput" class="output-card">
            <div class="output-card-header">
              <span class="output-badge" :class="scriptStep?.status === 'done' ? 'output-badge--done' : 'output-badge--run'">
                {{ scriptStep?.status === 'done' ? '✓ Generated Script' : '⬤ Script' }}
              </span>
            </div>
            <div class="script-hook">"{{ scriptOutput.hook }}"</div>
            <div class="script-body">{{ scriptOutput.body }}</div>
            <div class="script-cta">→ {{ scriptOutput.cta }}</div>
            <div class="script-voiceover">
              <span class="script-vo-label">Voiceover text:</span>
              {{ scriptOutput.voiceoverText }}
            </div>
          </div>

          <!-- Background music -->
          <div v-if="finalAudioUrl" class="output-card">
            <div class="output-card-header">
              <span class="output-badge output-badge--done">✓ Background Music</span>
              <span class="output-meta">Suno · {{ musicStyle || 'auto style' }}</span>
            </div>
            <audio :src="finalAudioUrl" controls class="audio-player" />
          </div>

          <!-- Voiceover -->
          <div v-if="voiceoverAudioUrl" class="output-card">
            <div class="output-card-header">
              <span class="output-badge output-badge--done">✓ Voiceover</span>
              <span class="output-meta">Producer · {{ voiceGender }} voice</span>
            </div>
            <audio :src="voiceoverAudioUrl" controls class="audio-player" />
          </div>

          <!-- Running steps — show animated placeholder -->
          <div v-for="step in runningSteps" :key="step.id + '-running'" class="output-card output-card--loading">
            <div class="output-card-header">
              <span class="output-badge output-badge--run">
                <span class="badge-spinner" />
                {{ step.label }}…
              </span>
            </div>
            <div class="loading-bars">
              <span /><span /><span /><span />
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useWallet } from 'solana-wallets-vue';
import { WalletMultiButton } from 'solana-wallets-vue';
import { Connection, Transaction } from '@solana/web3.js';
import { executeSolanaPayment } from '@/utils/x402/solana';
import { ElMessage } from 'element-plus';
import { IVideoStudioConfig } from '@/models';
import { SUBSCRIPTION_MONTHLY_USD } from '@/constants/videoStudio';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const ACEDATA_TREASURY = 'AcEDATAVAULT1111111111111111111111111111111';
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const LS_KEY = 'video_studio_api_key';

export default defineComponent({
  name: 'StudioIndex',
  components: { WalletMultiButton },
  setup() {
    const { publicKey, sendTransaction } = useWallet();
    return { walletPublicKey: publicKey, walletSendTransaction: sendTransaction };
  },
  data() {
    return {
      walletAddress: null as string | null,
      isPaying: false,
      paymentTx: null as string | null,
      pipelineError: null as string | null,
      credOpen: true,
      keyVisible: false,
      rememberKey: !!localStorage.getItem(LS_KEY)
    };
  },
  computed: {
    vs(): any { return (this.$store.state as any).videoStudio; },
    idea: {
      get(): string { return this.vs.config.idea; },
      set(v: string) { this.$store.dispatch('videoStudio/setConfig', { idea: v }); }
    },
    musicStyle: {
      get(): string { return this.vs.config.musicStyle; },
      set(v: string) { this.$store.dispatch('videoStudio/setConfig', { musicStyle: v }); }
    },
    voiceGender: {
      get(): string { return this.vs.config.voiceGender; },
      set(v: string) { this.$store.dispatch('videoStudio/setConfig', { voiceGender: v as IVideoStudioConfig['voiceGender'] }); }
    },
    instrumental: {
      get(): boolean { return this.vs.config.instrumental; },
      set(v: boolean) { this.$store.dispatch('videoStudio/setConfig', { instrumental: v }); }
    },
    apiKey: {
      get(): string { return this.vs.apiKey; },
      set(v: string) {
        this.$store.dispatch('videoStudio/setApiKey', v);
        if (this.rememberKey) localStorage.setItem(LS_KEY, v);
      }
    },
    steps(): any[] { return this.vs.steps; },
    totalCostUsd(): number { return this.vs.totalCostUsd; },
    finalAudioUrl(): string | undefined { return this.vs.finalAudioUrl; },
    finalVideoUrl(): string | undefined { return this.vs.finalVideoUrl; },
    scriptOutput(): any { return this.vs.scriptOutput; },
    voiceoverAudioUrl(): string | undefined {
      const step = this.steps.find((s: any) => s.id === 'voiceover');
      return step?.output?.audio_url as string | undefined;
    },
    scriptStep(): any { return this.steps.find((s: any) => s.id === 'script'); },
    isRunning(): boolean {
      return this.steps.some((s: any) => s.status === 'running' || s.status === 'polling');
    },
    runningSteps(): any[] {
      return this.steps.filter((s: any) => s.status === 'running' || s.status === 'polling');
    },
    canGenerate(): boolean {
      return !!this.idea.trim() && !!this.apiKey.trim();
    },
    hasAnyOutput(): boolean {
      return !!(this.scriptOutput || this.finalAudioUrl || this.voiceoverAudioUrl || this.finalVideoUrl || this.isRunning);
    },
    savings(): string {
      const dailyCost = SUBSCRIPTION_MONTHLY_USD / 30;
      const pct = Math.round((1 - this.totalCostUsd / dailyCost) * 100);
      return Math.max(0, pct).toString();
    }
  },
  mounted() {
    const saved = localStorage.getItem(LS_KEY);
    if (saved && !this.apiKey) {
      this.$store.dispatch('videoStudio/setApiKey', saved);
    }
  },
  methods: {
    stepIndex(id: string): number {
      return this.steps.findIndex((s: any) => s.id === id) + 1;
    },
    onRememberChange() {
      if (this.rememberKey) {
        localStorage.setItem(LS_KEY, this.apiKey);
      } else {
        localStorage.removeItem(LS_KEY);
      }
    },
    onWalletAddress(addr: string | null) {
      this.walletAddress = addr;
    },
    async onGenerate() {
      if (!this.canGenerate) {
        ElMessage.warning('Please enter your idea and API key.');
        return;
      }
      this.pipelineError = null;
      try {
        await this.$store.dispatch('videoStudio/runPipeline');
        ElMessage.success('Video generated successfully!');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'An error occurred during generation.';
        this.pipelineError = msg;
        ElMessage.error(msg);
      }
    },
    async onPayWithSolana() {
      if (!this.walletPublicKey) {
        ElMessage.warning('Please connect your Solana wallet first.');
        return;
      }
      const totalCost = this.vs.totalCostUsd;
      if (totalCost <= 0) {
        ElMessage.warning('Run a generation first to calculate cost.');
        return;
      }
      this.isPaying = true;
      this.paymentTx = null;
      try {
        const connection = new Connection(SOLANA_RPC, 'confirmed');
        const sendTx = this.walletSendTransaction;
        const signAndSendAdapter = async (tx: Transaction): Promise<string> => {
          return await sendTx(tx, connection);
        };
        const amountLamports = BigInt(Math.ceil(totalCost * 1_000_000));
        const result = await executeSolanaPayment({
          requirements: {
            payTo: ACEDATA_TREASURY,
            asset: USDC_MINT,
            maxAmountRequired: amountLamports.toString(),
            scheme: 'exact',
            network: 'solana',
            extra: { decimals: 6, computeUnitLimit: 200_000, computeUnitPriceMicroLamports: 1 }
          },
          payerAddress: this.walletPublicKey.toBase58(),
          signAndSendTransaction: signAndSendAdapter
        });
        this.paymentTx = result.signature;
        ElMessage.success('Payment confirmed on Solana!');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Payment failed.';
        ElMessage.error(msg);
      } finally {
        this.isPaying = false;
      }
    }
  }
});
</script>

<style scoped lang="scss">
$bg: #0a0a0a;
$surface: #111;
$border: #1e1e1e;
$border2: #2a2a2a;
$text: #e5e5e5;
$muted: #666;
$muted2: #888;
$accent: #0070f3;
$green: #00d084;
$red: #ff4444;
$yellow: #f5a623;

* { box-sizing: border-box; }

.studio {
  min-height: 100vh;
  background: $bg;
  color: $text;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  font-size: 13px;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.studio-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  border-bottom: 1px solid $border;
  background: rgba(255,255,255,0.02);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-logo {
  font-size: 18px;
}

.header-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}

.header-sub {
  font-size: 11px;
  color: $muted;
  margin-top: 1px;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: $accent;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  background: $accent;
  border-radius: 50%;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* ── Main layout ── */
.studio-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 360px 1fr;
  min-height: 0;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
}

/* ── Sidebar ── */
.studio-sidebar {
  border-right: 1px solid $border;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: calc(100vh - 57px);
}

.card {
  background: $surface;
  border: 1px solid $border;
  border-radius: 8px;
  padding: 14px;
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.chevron {
  font-size: 16px;
  color: $muted;
  transition: transform 0.2s;
  transform: rotate(90deg);
  display: inline-block;

  &--open { transform: rotate(-90deg); }
}

.field-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: $muted;
  margin-bottom: 7px;
}

.idea-input {
  width: 100%;
  background: $bg;
  border: 1px solid $border2;
  border-radius: 6px;
  padding: 9px 11px;
  font-size: 12px;
  color: $text;
  resize: vertical;
  outline: none;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 0.15s;

  &::placeholder { color: #3a3a3a; }
  &:focus { border-color: $accent; }
}

.options-card { display: flex; flex-direction: column; gap: 12px; }

.options-row {
  display: flex;
  gap: 10px;
}

.option-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.text-input {
  background: $bg;
  border: 1px solid $border2;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 12px;
  color: $text;
  outline: none;
  width: 100%;
  transition: border-color 0.15s;

  &::placeholder { color: #3a3a3a; }
  &:focus { border-color: $accent; }
}

.select-input {
  background: $bg;
  border: 1px solid $border2;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 12px;
  color: $text;
  outline: none;
  cursor: pointer;
  width: 100%;

  option { background: $surface; }
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.toggle-text {
  font-size: 12px;
  color: $muted2;
}

.toggle {
  width: 36px;
  height: 20px;
  background: $border2;
  border-radius: 10px;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;

  &--on { background: $accent; }
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  background: #555;
  border-radius: 50%;
  transition: transform 0.2s, background 0.2s;

  .toggle--on & {
    transform: translateX(16px);
    background: #fff;
  }
}

/* Credentials */
.cred-body {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.key-row {
  display: flex;
  gap: 6px;
}

.key-input { flex: 1; }

.icon-btn {
  background: $bg;
  border: 1px solid $border2;
  border-radius: 6px;
  padding: 0 8px;
  cursor: pointer;
  font-size: 13px;
  color: $muted2;
}

.hint-text {
  font-size: 11px;
  color: $muted;
  line-height: 1.4;
}

.remember-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: $muted2;
  cursor: pointer;
}

.wallet-section {
  border-top: 1px solid $border;
  padding-top: 12px;
}

.wallet-addr {
  margin-top: 8px;
  font-size: 11px;
  color: $green;
  font-family: monospace;
}

/* Pipeline */
.pipeline-card { padding: 14px; }

.section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $muted;
  margin-bottom: 14px;
}

.step-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 2px;
}

.step-icon-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;

  &--idle { background: $border2; color: $muted; }
  &--running { background: rgba(0, 112, 243, 0.15); border: 1px solid $accent; }
  &--done { background: rgba(0, 208, 132, 0.15); color: $green; border: 1px solid rgba(0, 208, 132, 0.3); }
  &--error { background: rgba(255, 68, 68, 0.15); color: $red; border: 1px solid rgba(255, 68, 68, 0.3); }
}

.step-spinner {
  width: 10px;
  height: 10px;
  border: 1.5px solid $accent;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: block;
}

.step-line {
  width: 1px;
  height: 20px;
  background: $border2;
  margin: 2px 0;

  &--running { background: $accent; }
  &--done { background: $green; }
}

.step-info {
  flex: 1;
  padding-bottom: 14px;
}

.step-label {
  font-size: 12px;
  font-weight: 500;
  color: $muted2;
  line-height: 1.4;

  &--running { color: $accent; }
  &--done { color: #fff; }
  &--error { color: $red; }
}

.step-desc {
  font-size: 10px;
  color: $muted;
  margin-top: 1px;
}

.step-error {
  font-size: 10px;
  color: $red;
  margin-top: 3px;
}

.step-cost {
  font-size: 10px;
  color: $muted;
  white-space: nowrap;
  padding-top: 4px;
}

/* Cost card */
.cost-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: $muted2;
}

.cost-val { font-variant-numeric: tabular-nums; }

.cost-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  border-top: 1px solid $border2;
  padding-top: 8px;
  margin-top: 2px;
}

.cost-total {
  color: $text;
  &--cheap { color: $green; }
}

.cost-compare {
  font-size: 10px;
  color: $muted;
  border-top: 1px solid $border;
  padding-top: 8px;
  line-height: 1.5;
}

.cost-savings {
  color: $green;
  font-weight: 600;
}

/* Action buttons */
.btn-generate {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 7px;
  padding: 11px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;

  &:hover:not(:disabled) { opacity: 0.88; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
}

.btn-solana {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  color: $text;
  border: 1px solid $border2;
  border-radius: 7px;
  padding: 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s;

  &:hover:not(:disabled) { border-color: #555; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
}

.btn-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.status-pill {
  font-size: 11px;
  border-radius: 6px;
  padding: 8px 12px;
  line-height: 1.4;

  &--ok { color: $green; background: rgba(0, 208, 132, 0.06); border: 1px solid rgba(0, 208, 132, 0.2); }
  &--err { color: $red; background: rgba(255, 68, 68, 0.06); border: 1px solid rgba(255, 68, 68, 0.2); }
}

.tx-link {
  color: $green;
  font-family: monospace;
  font-size: 10px;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

/* ── Output panel ── */
.studio-output {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(100vh - 57px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.output-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: $muted;
  gap: 10px;
  padding: 60px 20px;
}

.empty-icon { font-size: 40px; opacity: 0.3; }
.empty-title { font-size: 15px; font-weight: 500; color: #333; }
.empty-sub { font-size: 12px; color: $muted; max-width: 300px; line-height: 1.5; }

.output-card {
  background: $surface;
  border: 1px solid $border;
  border-radius: 10px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &--video { border-color: rgba(0, 208, 132, 0.3); }
  &--loading { opacity: 0.7; }
}

.output-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.output-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;

  &--done { color: $green; background: rgba(0, 208, 132, 0.1); }
  &--run { color: $accent; background: rgba(0, 112, 243, 0.1); }
}

.badge-spinner {
  display: inline-block;
  width: 8px;
  height: 8px;
  border: 1.5px solid $accent;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.output-meta {
  font-size: 10px;
  color: $muted;
}

.download-btn {
  font-size: 11px;
  color: $accent;
  text-decoration: none;
  border: 1px solid rgba(0, 112, 243, 0.3);
  border-radius: 5px;
  padding: 4px 10px;
  font-weight: 500;
  transition: background 0.15s;

  &:hover { background: rgba(0, 112, 243, 0.1); }
}

.video-player {
  width: 100%;
  max-width: 480px;
  border-radius: 8px;
  background: #000;
  border: 1px solid $border2;
}

.audio-player {
  width: 100%;
  height: 36px;
}

.script-hook {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.script-body {
  font-size: 13px;
  color: #aaa;
  line-height: 1.65;
}

.script-cta {
  font-size: 13px;
  font-weight: 600;
  color: $accent;
}

.script-voiceover {
  font-size: 11px;
  color: $muted;
  line-height: 1.55;
  border-top: 1px solid $border;
  padding-top: 10px;
}

.script-vo-label {
  font-weight: 600;
  color: $muted2;
  margin-right: 4px;
}

/* Loading shimmer bars */
.loading-bars {
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    height: 10px;
    border-radius: 5px;
    background: linear-gradient(90deg, $border 25%, $border2 50%, $border 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;

    &:nth-child(1) { width: 80%; }
    &:nth-child(2) { width: 60%; }
    &:nth-child(3) { width: 70%; }
    &:nth-child(4) { width: 40%; }
  }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
