<template>
  <div class="video-studio">
    <div class="studio-header">
      <div class="studio-title">
        <span class="studio-icon">⬛</span>
        <span>Video Studio</span>
      </div>
      <div class="studio-subtitle">Convert any idea into a ready-to-post short-form video</div>
    </div>

    <div class="studio-body">
      <!-- Left column: config -->
      <div class="studio-left">
        <div class="config-card">
          <div class="card-section">
            <label class="field-label">Your Idea</label>
            <textarea
              v-model="idea"
              class="idea-textarea"
              placeholder="e.g. The one habit that separates top 1% founders from everyone else"
              rows="4"
            />
          </div>

          <div class="card-section config-row">
            <div class="config-col">
              <label class="field-label">Music Style</label>
              <input v-model="musicStyle" class="text-input" placeholder="upbeat lo-fi, motivational" />
            </div>
            <div class="config-col">
              <label class="field-label">Voice Gender</label>
              <select v-model="voiceGender" class="select-input">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div class="card-section">
            <label class="toggle-label">
              <span class="toggle-text">Instrumental music</span>
              <input type="checkbox" v-model="instrumental" class="toggle-check" />
              <span class="toggle-slider" :class="{ 'toggle-slider--on': instrumental }" />
            </label>
          </div>
        </div>

        <api-key-panel v-model="apiKey" @wallet-address="onWalletAddress" class="mt-3" />

        <div class="action-row">
          <button
            class="btn-primary"
            :disabled="!canGenerate || isRunning"
            @click="onGenerate"
          >
            <span v-if="isRunning" class="btn-spinner" />
            <span>{{ isRunning ? 'Generating…' : 'Generate Video' }}</span>
          </button>
          <button
            v-if="walletAddress"
            class="btn-secondary"
            :disabled="isRunning || isPaying"
            @click="onPayWithSolana"
          >
            <span v-if="isPaying" class="btn-spinner" />
            <span>{{ isPaying ? 'Paying…' : '⬛ Pay with Solana' }}</span>
          </button>
        </div>

        <div v-if="paymentTx" class="payment-success">
          <span class="payment-icon">✓</span>
          <span>Payment confirmed</span>
          <a
            :href="`https://solscan.io/tx/${paymentTx}`"
            target="_blank"
            rel="noopener"
            class="tx-link"
          >{{ paymentTx.slice(0, 8) }}…</a>
        </div>

        <div v-if="pipelineError" class="pipeline-error">
          {{ pipelineError }}
        </div>
      </div>

      <!-- Right column: pipeline + costs -->
      <div class="studio-right">
        <div class="panel-card">
          <div class="panel-card-title">Pipeline</div>
          <pipeline-tracker :steps="steps" />
        </div>

        <cost-breakdown :steps="steps" :total-cost-usd="totalCostUsd" class="mt-3" />
      </div>
    </div>

    <!-- Result section -->
    <div v-if="finalVideoUrl || finalAudioUrl || scriptOutput" class="result-section">
      <div class="result-title">Output</div>

      <div class="result-body">
        <div v-if="finalVideoUrl" class="result-video-col">
          <video
            :src="finalVideoUrl"
            controls
            class="result-video"
            playsinline
          />
          <a :href="finalVideoUrl" download class="download-link">Download video &darr;</a>
        </div>

        <div class="result-content-col">
          <div v-if="finalAudioUrl" class="audio-section">
            <div class="result-label">Background Music</div>
            <audio :src="finalAudioUrl" controls class="result-audio" />
          </div>

          <div v-if="scriptOutput" class="script-section">
            <div class="result-label">Generated Script</div>
            <div class="script-hook">{{ scriptOutput.hook }}</div>
            <div class="script-body">{{ scriptOutput.body }}</div>
            <div class="script-cta">{{ scriptOutput.cta }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useWallet } from 'solana-wallets-vue';
import { executeSolanaPayment } from '@/utils/x402/solana';
import { ElMessage } from 'element-plus';
import PipelineTracker from '@/components/video-studio/PipelineTracker.vue';
import CostBreakdown from '@/components/video-studio/CostBreakdown.vue';
import ApiKeyPanel from '@/components/video-studio/ApiKeyPanel.vue';
import { IVideoStudioConfig } from '@/models';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const ACEDATA_TREASURY = 'AcEDATAVAULT1111111111111111111111111111111';

export default defineComponent({
  name: 'VideoStudioIndex',
  components: { PipelineTracker, CostBreakdown, ApiKeyPanel },
  setup() {
    const { publicKey, signAndSendTransaction } = useWallet();
    return { walletPublicKey: publicKey, signAndSendTransaction };
  },
  data() {
    return {
      walletAddress: null as string | null,
      isPaying: false,
      paymentTx: null as string | null,
      pipelineError: null as string | null
    };
  },
  computed: {
    idea: {
      get(): string { return this.$store.state.videoStudio.config.idea; },
      set(v: string) { this.$store.dispatch('videoStudio/setConfig', { idea: v }); }
    },
    musicStyle: {
      get(): string { return this.$store.state.videoStudio.config.musicStyle; },
      set(v: string) { this.$store.dispatch('videoStudio/setConfig', { musicStyle: v }); }
    },
    voiceGender: {
      get(): string { return this.$store.state.videoStudio.config.voiceGender; },
      set(v: string) { this.$store.dispatch('videoStudio/setConfig', { voiceGender: v as IVideoStudioConfig['voiceGender'] }); }
    },
    instrumental: {
      get(): boolean { return this.$store.state.videoStudio.config.instrumental; },
      set(v: boolean) { this.$store.dispatch('videoStudio/setConfig', { instrumental: v }); }
    },
    apiKey: {
      get(): string { return this.$store.state.videoStudio.apiKey; },
      set(v: string) { this.$store.dispatch('videoStudio/setApiKey', v); }
    },
    steps() { return this.$store.state.videoStudio.steps; },
    totalCostUsd() { return this.$store.state.videoStudio.totalCostUsd; },
    finalAudioUrl() { return this.$store.state.videoStudio.finalAudioUrl; },
    finalVideoUrl() { return this.$store.state.videoStudio.finalVideoUrl; },
    scriptOutput() { return this.$store.state.videoStudio.scriptOutput; },
    isRunning(): boolean {
      return this.steps.some((s: any) => s.status === 'running' || s.status === 'polling');
    },
    canGenerate(): boolean {
      return !!this.idea.trim() && !!this.apiKey.trim();
    }
  },
  methods: {
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
      if (!this.walletPublicKey || !this.signAndSendTransaction) {
        ElMessage.warning('Please connect your Solana wallet first.');
        return;
      }
      const totalCents = this.$store.state.videoStudio.totalCostUsd;
      if (totalCents <= 0) {
        ElMessage.warning('Run a generation first to calculate cost.');
        return;
      }
      this.isPaying = true;
      this.paymentTx = null;
      try {
        const amountLamports = BigInt(Math.ceil(totalCents * 1_000_000));
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
          signAndSendTransaction: this.signAndSendTransaction as any
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
.video-studio {
  min-height: 100vh;
  background: #0a0a0a;
  color: #e5e5e5;
  padding: 32px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
}

.studio-header {
  margin-bottom: 28px;
}

.studio-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.studio-icon {
  font-size: 16px;
}

.studio-subtitle {
  font-size: 13px;
  color: #666;
}

.studio-body {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.studio-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.studio-right {
  display: flex;
  flex-direction: column;
}

.config-card {
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-section {
  display: flex;
  flex-direction: column;
}

.config-row {
  flex-direction: row;
  gap: 12px;
}

.config-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 11px;
  font-weight: 500;
  color: #666;
  margin-bottom: 6px;
  letter-spacing: 0.04em;
}

.idea-textarea {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 13px;
  color: #e5e5e5;
  resize: vertical;
  outline: none;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 0.15s;

  &::placeholder { color: #444; }
  &:focus { border-color: #0070f3; }
}

.text-input {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 12px;
  color: #e5e5e5;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: #444; }
  &:focus { border-color: #0070f3; }
}

.select-input {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 12px;
  color: #e5e5e5;
  outline: none;
  cursor: pointer;

  option { background: #111; }
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.toggle-check { display: none; }

.toggle-text {
  font-size: 12px;
  color: #888;
  flex: 1;
}

.toggle-slider {
  width: 36px;
  height: 20px;
  background: #2a2a2a;
  border-radius: 10px;
  position: relative;
  transition: background 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 14px;
    height: 14px;
    background: #555;
    border-radius: 50%;
    transition: transform 0.2s, background 0.2s;
  }

  &--on {
    background: #0070f3;

    &::after {
      transform: translateX(16px);
      background: #fff;
    }
  }
}

.mt-3 { margin-top: 0; }

.action-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, background 0.15s;
  font-family: inherit;

  &:hover:not(:disabled) { opacity: 0.88; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  color: #e5e5e5;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  font-family: inherit;
  white-space: nowrap;

  &:hover:not(:disabled) { border-color: #555; color: #fff; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
}

.btn-spinner {
  display: block;
  width: 12px;
  height: 12px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.payment-success {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #00d084;
  background: rgba(0, 208, 132, 0.06);
  border: 1px solid rgba(0, 208, 132, 0.2);
  border-radius: 6px;
  padding: 8px 12px;
}

.payment-icon { font-style: normal; }

.tx-link {
  color: #00d084;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

.pipeline-error {
  font-size: 12px;
  color: #ff4444;
  background: rgba(255, 68, 68, 0.06);
  border: 1px solid rgba(255, 68, 68, 0.2);
  border-radius: 6px;
  padding: 8px 12px;
}

.panel-card {
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 16px;
}

.panel-card-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 14px;
}

/* Result section */
.result-section {
  border-top: 1px solid #1a1a1a;
  padding-top: 24px;
}

.result-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 16px;
}

.result-body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
}

.result-video-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-video {
  width: 240px;
  max-width: 100%;
  border-radius: 8px;
  background: #111;
  border: 1px solid #222;
}

.download-link {
  font-size: 11px;
  color: #0070f3;
  text-decoration: none;
  text-align: center;
  &:hover { text-decoration: underline; }
}

.result-content-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.audio-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.result-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 4px;
}

.result-audio {
  width: 100%;
  max-width: 380px;
  height: 36px;
}

.script-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.script-hook {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
}

.script-body {
  font-size: 13px;
  color: #aaa;
  line-height: 1.6;
}

.script-cta {
  font-size: 12px;
  font-weight: 600;
  color: #0070f3;
  letter-spacing: 0.02em;
}
</style>
