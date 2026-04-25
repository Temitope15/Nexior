<template>
  <div class="studio">
    <div class="grain" aria-hidden="true" />
    <div class="vignette" aria-hidden="true" />

    <!-- ─────────────── NAV ─────────────── -->
    <nav class="studio-nav">
      <div class="nav-inner">
        <router-link to="/landing" class="brand">
          <span class="brand-mark">VRX</span>
          <span class="brand-rule" />
          <span class="brand-name">Voirax</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/landing" class="nav-link"><span class="nav-num">←</span> Back to landing</router-link>
          <a href="https://platform.acedata.cloud" target="_blank" rel="noopener" class="nav-link">
            <span class="nav-num">↗</span> Ace Data Cloud
          </a>
        </div>
      </div>
    </nav>

    <!-- ─────────────── PAGE HEAD ─────────────── -->
    <header class="studio-head">
      <div class="head-inner">
        <aside class="head-meta">
          <span class="meta-num">VRX-001</span>
          <span class="meta-tag">Studio</span>
        </aside>
        <div class="head-title-block">
          <h1 class="head-title">Today's <em>take.</em></h1>
          <p class="head-lede">Write the idea. We'll handle the crew.</p>
        </div>
      </div>
    </header>

    <!-- ─────────────── MAIN BENCH ─────────────── -->
    <main class="bench">
      <!-- LEFT — Composition box -->
      <section class="bench-col bench-col--left">
        <div class="col-head">
          <span class="col-num">A</span>
          <span class="col-tag">Composition</span>
        </div>

        <div class="field field--idea">
          <label class="field-label" for="idea">The idea</label>
          <textarea
            id="idea"
            v-model="idea"
            class="idea-input"
            placeholder="The one habit that separates top 1% founders from everyone else…"
            rows="4"
          />
          <div class="field-hint">A paragraph is plenty. Hook, thesis, feeling — Voirax reads intent.</div>
        </div>

        <div class="field-row">
          <div class="field">
            <label class="field-label" for="music">Score · style</label>
            <input
              id="music"
              v-model="musicStyle"
              class="text-input"
              placeholder="cinematic, motivational, 120bpm"
            />
          </div>
          <div class="field">
            <label class="field-label" for="voice">Voice</label>
            <div class="select-wrap">
              <select id="voice" v-model="voiceGender" class="text-input">
                <option value="male">Male narrator</option>
                <option value="female">Female narrator</option>
              </select>
              <span class="select-caret" aria-hidden="true">▾</span>
            </div>
          </div>
        </div>

        <label class="toggle">
          <span class="toggle-text">Instrumental score (no vocals)</span>
          <input type="checkbox" v-model="instrumental" class="toggle-input" />
          <span class="toggle-track" :class="{ 'toggle-track--on': instrumental }">
            <span class="toggle-thumb" />
          </span>
        </label>

        <div class="rule" />

        <ApiKeyPanel v-model="apiKey" @wallet-address="onWalletAddress" />

        <div class="action-stack">
          <button
            class="btn btn--solid btn--block"
            :disabled="!canGenerate || isRunning"
            @click="onGenerate"
          >
            <span class="btn-num">{{ isRunning ? '··' : '▶' }}</span>
            <span>{{ isRunning ? 'Rolling…' : generateButtonLabel }}</span>
          </button>
          <div class="action-row">
            <button
              v-if="canResetPipeline"
              class="btn btn--ghost"
              :disabled="isRunning"
              @click="onResetPipeline"
            >
              Start over
            </button>
            <button
              v-if="walletAddress"
              class="btn btn--ghost"
              :disabled="isRunning || isPaying"
              @click="onPayWithSolana"
            >
              <span>{{ isPaying ? 'Settling…' : 'Settle with Solana' }}</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <transition name="fade-row">
          <div v-if="paymentTx" class="payment-success">
            <span class="success-mark">✓</span>
            <span>Settled on chain</span>
            <a
              :href="`https://solscan.io/tx/${paymentTx}`"
              target="_blank"
              rel="noopener"
              class="tx-link"
            >{{ paymentTx.slice(0, 8) }}…</a>
          </div>
        </transition>

        <transition name="fade-row">
          <div v-if="pipelineError" class="pipeline-error">
            <span class="err-tag">Error</span>
            <span>{{ pipelineError }}</span>
          </div>
        </transition>
      </section>

      <!-- RIGHT — Shot list + ledger -->
      <aside class="bench-col bench-col--right">
        <div class="col-head">
          <span class="col-num">B</span>
          <span class="col-tag">Shot list</span>
        </div>

        <div class="panel panel--tracker">
          <PipelineTracker :steps="steps" />
        </div>

        <div class="col-head col-head--sub">
          <span class="col-num">C</span>
          <span class="col-tag">Ledger</span>
        </div>

        <div class="panel panel--ledger">
          <CostBreakdown :steps="steps" :total-cost-usd="totalCostUsd" />
        </div>
      </aside>
    </main>

    <!-- ─────────────── OUTPUT ─────────────── -->
    <transition name="fade-section">
      <section v-if="finalVideoUrl || finalAudioUrl || scriptOutput" class="output">
        <header class="output-head">
          <aside class="head-meta">
            <span class="meta-num">CUT</span>
            <span class="meta-tag">Final</span>
          </aside>
          <h2 class="output-title">The <em>final cut.</em></h2>
        </header>

        <div class="output-grid">
          <div v-if="finalVideoUrl" class="output-still">
            <video :src="finalVideoUrl" controls playsinline class="output-video" />
            <div class="still-foot">
              <span class="still-tag">VRX-001 / Take 1</span>
              <a :href="finalVideoUrl" download class="still-download">Download <span aria-hidden="true">↓</span></a>
            </div>
          </div>

          <div class="output-aside">
            <div v-if="finalAudioUrl" class="audio-block">
              <div class="block-tag">Score · Suno</div>
              <audio :src="finalAudioUrl" controls class="output-audio" />
            </div>

            <div v-if="scriptOutput" class="script-block">
              <div class="block-tag">Script · Gemini</div>
              <p class="script-hook">{{ scriptOutput.hook }}</p>
              <p class="script-body">{{ scriptOutput.body }}</p>
              <p class="script-cta">{{ scriptOutput.cta }}</p>
            </div>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useWallet } from 'solana-wallets-vue';
import { Connection, Transaction } from '@solana/web3.js';
import { executeSolanaPayment } from '@/utils/x402/solana';
import { ElMessage } from 'element-plus';
import PipelineTracker from '@/components/video-studio/PipelineTracker.vue';
import CostBreakdown from '@/components/video-studio/CostBreakdown.vue';
import ApiKeyPanel from '@/components/video-studio/ApiKeyPanel.vue';
import { IVideoStudioConfig } from '@/models';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const ACEDATA_TREASURY = 'AcEDATAVAULT1111111111111111111111111111111';
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

export default defineComponent({
  name: 'VideoStudioIndex',
  components: { PipelineTracker, CostBreakdown, ApiKeyPanel },
  setup() {
    const { publicKey, sendTransaction } = useWallet();
    return { walletPublicKey: publicKey, walletSendTransaction: sendTransaction };
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
      set(v: string) { this.$store.dispatch('videoStudio/setApiKey', v); }
    },
    steps() { return this.vs.steps; },
    totalCostUsd() { return this.vs.totalCostUsd; },
    finalAudioUrl() { return this.vs.finalAudioUrl; },
    finalVideoUrl() { return this.vs.finalVideoUrl; },
    scriptOutput() { return this.vs.scriptOutput; },
    isRunning(): boolean {
      return this.steps.some((s: any) => s.status === 'running' || s.status === 'polling');
    },
    canGenerate(): boolean {
      return !!this.idea.trim() && !!this.apiKey.trim();
    },
    canResetPipeline(): boolean {
      return this.steps.some((s: any) => s.status === 'done' || s.status === 'error');
    },
    hasResumableProgress(): boolean {
      return this.steps.some((s: any) => s.status === 'done')
        && this.steps.some((s: any) => s.status !== 'done');
    },
    generateButtonLabel(): string {
      return this.hasResumableProgress ? 'Resume the take' : 'Begin a take';
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
    onResetPipeline() {
      this.$store.dispatch('videoStudio/resetPipeline');
      this.pipelineError = null;
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
/* ============================================================================
 * VOIRAX · Studio — Editorial Cinema bench
 * Tokens come from src/assets/scss/_tokens.scss applied at :root.
 * ========================================================================== */

* { box-sizing: border-box; }

.studio {
  position: relative;
  min-height: 100vh;
  background: var(--vx-ink);
  color: var(--vx-bone);
  font-family: var(--vx-font-sans);
  font-feature-settings: 'ss01', 'ss02';
  isolation: isolate;
  overflow-x: hidden;
}

/* ── atmosphere ──────────────────────────────────────────────────── */
.grain {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.93  0 0 0 0 0.89  0 0 0 0 0.83  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  background-size: 160px 160px;
}
.vignette {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 0%, transparent 0%, rgba(0,0,0,0.55) 80%);
}

/* ── nav ─────────────────────────────────────────────────────────── */
.studio-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(14px) saturate(120%);
  background: linear-gradient(to bottom, rgba(10, 9, 8, 0.85), rgba(10, 9, 8, 0.6));
  border-bottom: 1px solid var(--vx-rule);
}
.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 18px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--vx-bone);
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
.brand-rule {
  width: 18px;
  height: 1px;
  background: var(--vx-rule-strong);
}
.brand-name {
  font-family: var(--vx-font-display);
  font-style: italic;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: -0.01em;
  font-variation-settings: 'opsz' 14;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-link {
  font-size: 12px;
  color: var(--vx-bone-soft);
  text-decoration: none;
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  transition: color 200ms ease;
  &:hover { color: var(--vx-bone); }
}
.nav-num {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  color: var(--vx-ember);
  letter-spacing: 0.1em;
}
@media (max-width: 720px) {
  .nav-inner { padding: 14px 20px; }
  .nav-links { gap: 14px; }
}

/* ── page head ───────────────────────────────────────────────────── */
.studio-head {
  position: relative;
  z-index: 2;
  padding: 56px 32px 32px;
  border-bottom: 1px solid var(--vx-rule);
}
.head-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 48px;
  align-items: end;
}
.head-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-right: 1px solid var(--vx-rule);
  padding-right: 24px;
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  align-self: stretch;
  justify-content: flex-end;
  padding-bottom: 6px;
  .meta-num { color: var(--vx-ember); }
  .meta-tag { color: var(--vx-ash); }
}
.head-title {
  font-family: var(--vx-font-display);
  font-weight: 350;
  font-size: clamp(40px, 6vw, 72px);
  line-height: 0.98;
  letter-spacing: -0.03em;
  color: var(--vx-bone);
  margin: 0 0 12px 0;
  font-variation-settings: 'opsz' 96;
  em { font-style: italic; color: var(--vx-ember); font-weight: 400; }
}
.head-lede {
  font-family: var(--vx-font-sans);
  font-size: 15px;
  line-height: 1.5;
  color: var(--vx-bone-soft);
  margin: 0;
  max-width: 480px;
}
@media (max-width: 720px) {
  .studio-head { padding: 36px 20px 24px; }
  .head-inner { grid-template-columns: 1fr; gap: 16px; }
  .head-meta {
    flex-direction: row;
    border-right: 0;
    padding: 0;
    gap: 16px;
    align-self: flex-start;
  }
}

/* ── bench (main grid) ───────────────────────────────────────────── */
.bench {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 32px 64px;
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 48px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 32px 20px;
    gap: 32px;
  }
}

.bench-col {
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
}
.col-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vx-rule);
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.col-head--sub { margin-top: 12px; }
.col-num { color: var(--vx-ember); }
.col-tag { color: var(--vx-ash); }

/* ── form fields ─────────────────────────────────────────────────── */
.field { display: flex; flex-direction: column; gap: 8px; }
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  @media (max-width: 540px) { grid-template-columns: 1fr; }
}
.field-label {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vx-ash);
}
.field-hint {
  font-size: 11px;
  font-family: var(--vx-font-sans);
  color: var(--vx-ash);
  line-height: 1.5;
}

/* idea-input is the centerpiece — set in Fraunces, italic, large */
.idea-input {
  background: var(--vx-ink-soft);
  border: 1px solid var(--vx-rule-strong);
  border-radius: 2px;
  padding: 18px 20px;
  font-family: var(--vx-font-display);
  font-style: italic;
  font-weight: 350;
  font-size: 22px;
  line-height: 1.4;
  color: var(--vx-bone);
  outline: none;
  resize: vertical;
  min-height: 110px;
  letter-spacing: -0.01em;
  font-variation-settings: 'opsz' 24;
  transition: border-color 200ms ease, background 200ms ease;
  &::placeholder {
    color: var(--vx-ash-deep);
    font-style: italic;
  }
  &:focus {
    border-color: var(--vx-ember);
    background: var(--vx-ink-up);
  }
}

.text-input {
  background: var(--vx-ink-soft);
  border: 1px solid var(--vx-rule-strong);
  border-radius: 2px;
  padding: 12px 14px;
  font-family: var(--vx-font-sans);
  font-size: 13px;
  color: var(--vx-bone);
  outline: none;
  width: 100%;
  transition: border-color 200ms ease;
  &:focus { border-color: var(--vx-ember); }
  &::placeholder { color: var(--vx-ash-deep); }
}

/* select with custom caret */
.select-wrap {
  position: relative;
  .text-input {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 34px;
    cursor: pointer;
  }
  option {
    background: var(--vx-ink-soft);
    color: var(--vx-bone);
  }
}
.select-caret {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--vx-font-mono);
  font-size: 10px;
  color: var(--vx-ember);
  pointer-events: none;
}

/* toggle */
.toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  background: var(--vx-ink-soft);
  border: 1px solid var(--vx-rule);
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  transition: border-color 200ms ease;
  &:hover { border-color: var(--vx-rule-strong); }
}
.toggle-text {
  font-family: var(--vx-font-sans);
  font-size: 13px;
  color: var(--vx-bone-soft);
}
.toggle-input { display: none; }
.toggle-track {
  width: 36px;
  height: 18px;
  border: 1px solid var(--vx-rule-strong);
  border-radius: 10px;
  position: relative;
  transition: background 220ms ease, border-color 220ms ease;
  flex-shrink: 0;
}
.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vx-ash);
  transition: transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1), background 220ms ease;
}
.toggle-track--on {
  background: var(--vx-ember);
  border-color: var(--vx-ember);
  .toggle-thumb {
    transform: translateX(18px);
    background: var(--vx-ink);
  }
}

.rule {
  height: 1px;
  background: var(--vx-rule);
}

/* ── buttons (mirror landing) ────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 22px;
  border-radius: 2px;
  font-family: var(--vx-font-sans);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  letter-spacing: 0.005em;
  transition: transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
              background 220ms ease,
              border-color 220ms ease,
              color 220ms ease;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}
.btn--solid {
  background: var(--vx-bone);
  color: var(--vx-ink);
  &:hover:not(:disabled) {
    background: var(--vx-ember);
    transform: translateY(-2px);
  }
  .btn-num {
    font-family: var(--vx-font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    color: var(--vx-ember-deep);
    border-right: 1px solid rgba(0,0,0,0.18);
    padding-right: 10px;
  }
}
.btn--ghost {
  background: transparent;
  color: var(--vx-bone-soft);
  border: 1px solid var(--vx-rule-strong);
  &:hover:not(:disabled) {
    color: var(--vx-ember);
    border-color: var(--vx-ember);
  }
  .btn-arrow { font-family: var(--vx-font-mono); transition: transform 220ms ease; }
  &:hover .btn-arrow { transform: translateX(4px); }
}
.btn--block {
  width: 100%;
  justify-content: center;
}

.action-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.action-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  & > .btn { flex: 1; min-width: 0; }
}

/* ── inline status rows ──────────────────────────────────────────── */
.payment-success {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(184, 201, 124, 0.06);
  border: 1px solid rgba(184, 201, 124, 0.3);
  border-radius: 2px;
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--vx-ok);
  text-transform: uppercase;
}
.success-mark {
  width: 16px;
  height: 16px;
  border: 1px solid var(--vx-ok);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
}
.tx-link {
  margin-left: auto;
  color: var(--vx-ok);
  text-decoration: none;
  border-bottom: 1px solid rgba(184, 201, 124, 0.3);
  &:hover { border-bottom-color: var(--vx-ok); }
}
.pipeline-error {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(217, 106, 91, 0.06);
  border: 1px solid rgba(217, 106, 91, 0.3);
  border-radius: 2px;
  font-family: var(--vx-font-sans);
  font-size: 12px;
  color: var(--vx-err);
  line-height: 1.5;
}
.err-tag {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  flex-shrink: 0;
  border: 1px solid var(--vx-err);
  padding: 2px 6px;
  border-radius: 2px;
  line-height: 1.2;
}

.fade-row-enter-active, .fade-row-leave-active { transition: opacity 200ms ease, transform 200ms ease; }
.fade-row-enter-from, .fade-row-leave-to { opacity: 0; transform: translateY(-4px); }

/* ── right column panels ─────────────────────────────────────────── */
.panel {
  background: var(--vx-ink-soft);
  border: 1px solid var(--vx-rule);
  border-radius: 2px;
  padding: 22px 22px;
}
.panel--tracker { padding: 8px 22px; }
.panel--ledger { padding: 0; }

/* ── output (final cut) ──────────────────────────────────────────── */
.output {
  position: relative;
  z-index: 2;
  border-top: 1px solid var(--vx-rule);
  padding: 80px 32px;
  background: radial-gradient(ellipse at center top, rgba(255, 122, 69, 0.05), transparent 70%);
}
.output-head {
  max-width: 1280px;
  margin: 0 auto 48px;
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 48px;
  align-items: end;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
.output-title {
  font-family: var(--vx-font-display);
  font-weight: 350;
  font-size: clamp(48px, 7vw, 96px);
  line-height: 0.96;
  letter-spacing: -0.03em;
  color: var(--vx-bone);
  margin: 0;
  font-variation-settings: 'opsz' 96;
  em { font-style: italic; color: var(--vx-ember); font-weight: 400; }
}

.output-grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(280px, 360px) 1fr;
  gap: 48px;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.output-still {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.output-video {
  width: 100%;
  aspect-ratio: 9 / 16;
  background: var(--vx-ink-soft);
  border: 1px solid var(--vx-rule-strong);
  border-radius: 2px;
  outline: none;
  object-fit: cover;
}
.still-foot {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.still-tag { color: var(--vx-ash); }
.still-download {
  color: var(--vx-ember);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 122, 69, 0.3);
  padding-bottom: 1px;
  &:hover { border-bottom-color: var(--vx-ember); }
}

.output-aside {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 4px;
}
.block-tag {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vx-ash);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vx-rule);
}
.audio-block { display: flex; flex-direction: column; }
.output-audio {
  width: 100%;
  height: 40px;
  filter: invert(0.92) hue-rotate(180deg);
}
.script-block {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.script-hook {
  font-family: var(--vx-font-display);
  font-weight: 400;
  font-size: 28px;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--vx-bone);
  margin: 0;
  font-variation-settings: 'opsz' 36;
}
.script-body {
  font-family: var(--vx-font-sans);
  font-size: 15px;
  line-height: 1.7;
  color: var(--vx-bone-soft);
  margin: 0;
}
.script-cta {
  font-family: var(--vx-font-display);
  font-style: italic;
  font-size: 16px;
  color: var(--vx-ember);
  margin: 0;
  letter-spacing: -0.005em;
  font-variation-settings: 'opsz' 18;
  &::before { content: '— '; color: var(--vx-ash); }
}

.fade-section-enter-active { transition: opacity 500ms ease, transform 500ms ease; }
.fade-section-enter-from { opacity: 0; transform: translateY(20px); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
