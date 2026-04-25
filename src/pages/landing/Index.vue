<template>
  <div class="landing">
    <div class="grain" aria-hidden="true" />
    <div class="vignette" aria-hidden="true" />

    <!-- ─────────────── FILM SLATE STRIP ─────────────── -->
    <div class="slate" aria-hidden="true">
      <span class="slate-cell"><em>vrx</em>·001</span>
      <span class="slate-sep">/</span>
      <span class="slate-cell">take 01</span>
      <span class="slate-sep">/</span>
      <span class="slate-cell">9:16</span>
      <span class="slate-sep">/</span>
      <span class="slate-cell">35mm</span>
      <span class="slate-sep">/</span>
      <span class="slate-cell">issue 001</span>
      <span class="slate-cell slate-cell--live">
        <span class="slate-dot" />
        <span>open for production</span>
      </span>
    </div>

    <!-- ─────────────── NAV ─────────────── -->
    <nav class="nav">
      <div class="nav-inner">
        <router-link to="/" class="brand">
          <span class="brand-mark">VRX</span>
          <span class="brand-rule" />
          <span class="brand-name">Voirax</span>
        </router-link>
        <div class="nav-links">
          <a href="#process" class="nav-link"><span class="nav-num">01</span> Process</a>
          <a href="#pipeline" class="nav-link"><span class="nav-num">02</span> Pipeline</a>
          <a href="#pricing" class="nav-link"><span class="nav-num">03</span> Pricing</a>
          <router-link to="/studio" class="nav-cta">
            Open the studio
            <span class="cta-arrow" aria-hidden="true">↗</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- ─────────────── HERO ─────────────── -->
    <section class="hero">
      <div class="hero-grid">
        <aside class="hero-margin">
          <div class="margin-block">
            <div class="margin-label">FILE</div>
            <div class="margin-value">VRX&hairsp;–&hairsp;001</div>
          </div>
          <div class="margin-block">
            <div class="margin-label">RUN&nbsp;TIME</div>
            <div class="margin-value">~&hairsp;3&hairsp;min</div>
          </div>
          <div class="margin-block">
            <div class="margin-label">FORMAT</div>
            <div class="margin-value">9&thinsp;:&thinsp;16</div>
          </div>
        </aside>

        <div class="hero-stage">
          <div class="hero-eyebrow">
            <span class="eyebrow-bullet" />
            <span>A short-form film studio</span>
          </div>

          <h1 class="hero-headline">
            <span class="line line--1">An idea,</span>
            <span class="line line--2"><em>on screen.</em></span>
          </h1>

          <p class="hero-lede">
            Four AI specialists, one continuous take.
            Your idea in, a finished short out — in the time it takes to brew coffee.
          </p>

          <div class="hero-actions">
            <button class="btn btn--solid" @click="showApiKeyModal = true">
              <span class="btn-num">01</span>
              <span>Begin a take</span>
            </button>
            <router-link class="btn btn--ghost" to="/studio">
              <span>Enter the studio</span>
              <span class="btn-arrow">→</span>
            </router-link>
          </div>

          <ul class="hero-stats">
            <li>
              <strong>0.38<span class="stat-unit">$</span></strong>
              <span class="stat-label">per finished short</span>
            </li>
            <li>
              <strong>4<span class="stat-unit">×</span></strong>
              <span class="stat-label">specialists, one take</span>
            </li>
            <li>
              <strong>x402<span class="stat-unit">·</span></strong>
              <span class="stat-label">solana settlement</span>
            </li>
          </ul>
        </div>

        <aside class="hero-side">
          <article class="poster">
            <header class="poster-top">
              <span class="poster-id">VRX-001</span>
              <span class="poster-take">Take&nbsp;01</span>
            </header>

            <div class="poster-center">
              <div class="poster-mark">Voirax</div>
              <div class="poster-rule" />
              <div class="poster-tagline">
                <span>An idea</span>
                <span><em>is enough.</em></span>
              </div>
            </div>

            <footer class="poster-foot">
              <span>2026 · 04</span>
              <span>edn. 001</span>
            </footer>
          </article>
        </aside>
      </div>

      <div class="hero-marquee" aria-hidden="true">
        <div class="marquee-track">
          <span v-for="i in 4" :key="i" class="marquee-group">
            <span>Idea</span><span class="dot">✦</span>
            <span><em>Script</em></span><span class="dot">✦</span>
            <span>Score</span><span class="dot">✦</span>
            <span><em>Voice</em></span><span class="dot">✦</span>
            <span>Picture</span><span class="dot">✦</span>
          </span>
        </div>
      </div>
    </section>

    <!-- ─────────────── 01 PROCESS ─────────────── -->
    <section class="section section--process" id="process">
      <header class="section-head">
        <div class="section-meta">
          <span class="section-num">01</span>
          <span class="section-tag">The process</span>
        </div>
        <h2 class="section-title"><em>From a sentence</em><br />to a short.</h2>
      </header>

      <ol class="process-rail">
        <li class="process-step">
          <div class="step-num">i</div>
          <div class="step-body">
            <h3>Write.</h3>
            <p>A line, a paragraph, a feeling. Voirax reads intent — not keywords.</p>
          </div>
          <div class="step-rule" />
        </li>
        <li class="process-step">
          <div class="step-num">ii</div>
          <div class="step-body">
            <h3>Tune.</h3>
            <p>Pick the score. Pick the voice. Two settings, hundreds of takes.</p>
          </div>
          <div class="step-rule" />
        </li>
        <li class="process-step">
          <div class="step-num">iii</div>
          <div class="step-body">
            <h3>Watch.</h3>
            <p>Four specialists assemble the short. Stay, or grab a coffee.</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- ─────────────── 02 PIPELINE ─────────────── -->
    <section class="section section--specs" id="pipeline">
      <header class="section-head section-head--double">
        <div class="section-meta">
          <span class="section-num">02</span>
          <span class="section-tag">The pipeline</span>
        </div>
        <h2 class="section-title">Four specialists. <em>One take.</em></h2>
        <p class="section-lede">
          A pipeline should feel like a film crew, not a stack diagram. Four roles. Four specialists.
        </p>
      </header>

      <dl class="spec-sheet">
        <div class="spec-row">
          <dt class="spec-role"><span class="spec-num">A</span> The Writer</dt>
          <dd class="spec-name">Gemini · 2.5 Flash</dd>
          <dd class="spec-desc">Hook, body, call-to-action. A scriptwriter trained on what stops a thumb.</dd>
          <dd class="spec-meta">$0.001</dd>
        </div>
        <div class="spec-row">
          <dt class="spec-role"><span class="spec-num">B</span> The Composer</dt>
          <dd class="spec-name">Suno · Chirp v5.5</dd>
          <dd class="spec-desc">Original score, royalty-free, written to your scene's mood and tempo.</dd>
          <dd class="spec-meta">$0.05</dd>
        </div>
        <div class="spec-row">
          <dt class="spec-role"><span class="spec-num">C</span> The Voice</dt>
          <dd class="spec-name">Producer · Fuzz 2.0 Pro</dd>
          <dd class="spec-desc">A narrator with weight. Pick male or female; the read carries the room.</dd>
          <dd class="spec-meta">$0.02</dd>
        </div>
        <div class="spec-row">
          <dt class="spec-role"><span class="spec-num">D</span> The Cinematographer</dt>
          <dd class="spec-name">Luma · Dream Machine</dd>
          <dd class="spec-desc">Picture from prompt. Cuts that match the cadence of your hook.</dd>
          <dd class="spec-meta">$0.10</dd>
        </div>
        <div class="spec-row spec-row--total">
          <dt class="spec-role"><span class="spec-num">∑</span> Total per short</dt>
          <dd class="spec-name">Voirax · 2026.4</dd>
          <dd class="spec-desc">Four specialists. One continuous take. No subscription required.</dd>
          <dd class="spec-meta">$0.38</dd>
        </div>
      </dl>
    </section>

    <!-- ─────────────── 03 PRICING ─────────────── -->
    <section class="section section--pricing" id="pricing">
      <header class="section-head section-head--double">
        <div class="section-meta">
          <span class="section-num">03</span>
          <span class="section-tag">The price of a take</span>
        </div>
        <h2 class="section-title">No subscriptions. <em>No drama.</em></h2>
        <p class="section-lede">
          Three ways to pay for the same finished short. Pick the one that fits.
        </p>
      </header>

      <div class="ledger">
        <article class="ledger-col ledger-col--rejected">
          <div class="ledger-tag">Status quo</div>
          <div class="ledger-name">A monthly platform</div>
          <div class="ledger-rate"><span class="rate-num">30</span><span class="rate-unit">$&hairsp;/&hairsp;mo</span></div>
          <ul class="ledger-list">
            <li><span class="mark mark--no">·</span> Subscription required</li>
            <li><span class="mark mark--no">·</span> Capped generations</li>
            <li><span class="mark mark--no">·</span> Locked into one editor</li>
            <li><span class="mark mark--no">·</span> Manual finishing</li>
          </ul>
          <div class="ledger-foot">Strike-out budget</div>
        </article>

        <article class="ledger-col ledger-col--featured">
          <div class="ledger-tag ledger-tag--accent">Recommended</div>
          <div class="ledger-name"><em>Voirax</em>, on the meter</div>
          <div class="ledger-rate"><span class="rate-num">0.38</span><span class="rate-unit">$&hairsp;/&hairsp;short</span></div>
          <ul class="ledger-list">
            <li><span class="mark mark--yes">✓</span> Pay only when you press record</li>
            <li><span class="mark mark--yes">✓</span> Unlimited creative range</li>
            <li><span class="mark mark--yes">✓</span> Script · score · voice · picture</li>
            <li><span class="mark mark--yes">✓</span> Fully automated finish</li>
          </ul>
          <router-link to="/studio" class="ledger-cta">
            Begin a take <span aria-hidden="true">→</span>
          </router-link>
        </article>

        <article class="ledger-col">
          <div class="ledger-tag">With x402</div>
          <div class="ledger-name">On Solana</div>
          <div class="ledger-rate"><span class="rate-num">0.36</span><span class="rate-unit">$&hairsp;/&hairsp;short</span></div>
          <ul class="ledger-list">
            <li><span class="mark mark--yes">✓</span> 5% off via x402 settlement</li>
            <li><span class="mark mark--yes">✓</span> $ACE holders compound the discount</li>
            <li><span class="mark mark--yes">✓</span> Public, on-chain receipts</li>
            <li><span class="mark mark--yes">✓</span> Hold no platform balance</li>
          </ul>
          <a class="ledger-cta ledger-cta--ghost" href="https://platform.acedata.cloud" target="_blank" rel="noopener">
            Pay with Solana <span aria-hidden="true">→</span>
          </a>
        </article>
      </div>

      <p class="pricing-note">
        New accounts open with five free credits. Top-ups via x402 on Solana or Base earn the 5% discount.
      </p>
    </section>

    <!-- ─────────────── 04 AUDIENCE ─────────────── -->
    <section class="section section--audience">
      <header class="section-head">
        <div class="section-meta">
          <span class="section-num">04</span>
          <span class="section-tag">Made for</span>
        </div>
      </header>
      <h2 class="audience-line">
        For
        <RotatingText
          :texts="audienceWords"
          :rotationInterval="2400"
          mainClass="audience-rotator"
        />
        with stories worth seeing.
      </h2>
      <div class="badges">
        <span class="chip">Dify Workflow</span>
        <span class="chip">Suno · Producer</span>
        <span class="chip">Luma Dream Machine</span>
        <span class="chip">x402 · Solana</span>
        <span class="chip">Ace Data Cloud</span>
      </div>
    </section>

    <!-- ─────────────── 05 BEGIN ─────────────── -->
    <section class="section section--final">
      <div class="final-meta">
        <span class="section-num">05</span>
        <span class="section-tag">Begin</span>
      </div>
      <h2 class="final-headline">
        Roll
        <em>camera.</em>
      </h2>
      <p class="final-lede">Bring the idea. We'll bring the crew.</p>
      <router-link class="btn btn--solid btn--large" to="/studio">
        <span class="btn-num">↻</span>
        <span>Open the studio</span>
      </router-link>
    </section>

    <!-- ─────────────── FOOTER ─────────────── -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-col footer-col--brand">
          <div class="brand brand--footer">
            <span class="brand-mark">VRX</span>
            <span class="brand-rule" />
            <span class="brand-name">Voirax</span>
          </div>
          <p class="footer-blurb">A short-form film studio. Built on Ace Data Cloud. Settled in x402.</p>
        </div>
        <div class="footer-col">
          <div class="footer-title">Stack</div>
          <a href="https://platform.acedata.cloud" target="_blank" rel="noopener">Ace Data Cloud</a>
          <a href="https://platform.acedata.cloud" target="_blank" rel="noopener">x402 Payments</a>
        </div>
        <div class="footer-col">
          <div class="footer-title">Follow</div>
          <a href="https://twitter.com" target="_blank" rel="noopener">X / Twitter</a>
          <a href="https://discord.gg" target="_blank" rel="noopener">Discord</a>
        </div>
        <div class="footer-col footer-col--colophon">
          <div class="footer-title">Colophon</div>
          <p>
            Set in <em>Fraunces</em> &amp; Instrument Sans.<br />
            Spec sheets in JetBrains Mono.<br />
            Composed in 2026.
          </p>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Voirax</span>
        <span class="footer-frame">VRX&hairsp;–&hairsp;001 · Take 1</span>
      </div>
    </footer>

    <!-- ─────────────── API KEY MODAL ─────────────── -->
    <transition name="modal-fade">
      <div v-if="showApiKeyModal" class="modal-overlay" @click.self="showApiKeyModal = false">
        <div class="modal-card">
          <button class="modal-close" @click="showApiKeyModal = false" aria-label="Close">×</button>
          <div class="modal-head">
            <span class="modal-num">00</span>
            <span class="modal-tag">First take</span>
          </div>
          <h2 class="modal-title">Bring your own <em>key.</em></h2>
          <p class="modal-lede">Paste your Ace Data Cloud token. We don't store it on our servers.</p>

          <label class="modal-label" for="apiKey">Ace Data Cloud · API key</label>
          <div class="modal-input-row">
            <input
              id="apiKey"
              v-model="apiKeyInput"
              :type="showApiKeyInputValue ? 'text' : 'password'"
              placeholder="sk-..."
              class="modal-input"
              @keyup.enter="submitApiKey"
            />
            <button
              type="button"
              class="modal-eye"
              @click="showApiKeyInputValue = !showApiKeyInputValue"
              :aria-label="showApiKeyInputValue ? 'Hide key' : 'Show key'"
            >
              {{ showApiKeyInputValue ? '◐' : '○' }}
            </button>
          </div>
          <p class="modal-help">
            No key yet? Request one at
            <a href="https://platform.acedata.cloud" target="_blank" rel="noopener">platform.acedata.cloud</a>.
          </p>

          <button
            class="btn btn--solid btn--block"
            :disabled="!apiKeyInput.trim() || submitting"
            @click="submitApiKey"
          >
            <span v-if="!submitting">Continue to studio →</span>
            <span v-else>Loading…</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RotatingText from '@/components/common/RotatingText.vue';

export default defineComponent({
  name: 'LandingIndex',
  components: { RotatingText },
  data() {
    return {
      showApiKeyModal: false,
      apiKeyInput: '',
      showApiKeyInputValue: false,
      submitting: false,
      audienceWords: [
        'creators',
        'storytellers',
        'founders',
        'editors',
        'marketers',
        'directors'
      ]
    };
  },
  mounted() {
    this.observeElements();
    const existingKey = this.$store.state.videoStudio?.apiKey;
    if (existingKey) this.apiKeyInput = existingKey;
  },
  methods: {
    observeElements() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('in-view');
          });
        },
        { threshold: 0.12 }
      );
      this.$el
        .querySelectorAll('.section, .process-step, .spec-row, .ledger-col, .reel-frame')
        .forEach((el: Element) => observer.observe(el));
    },
    async submitApiKey() {
      if (!this.apiKeyInput.trim()) return;
      this.submitting = true;
      try {
        await this.$store.dispatch('videoStudio/setApiKey', this.apiKeyInput);
        localStorage.setItem('video_studio_api_key', this.apiKeyInput);
        this.$router.push('/studio');
      } catch (err) {
        console.error('Error saving API key:', err);
      } finally {
        this.submitting = false;
      }
    }
  }
});
</script>

<style scoped lang="scss">
/* ============================================================================
 * VOIRAX · LANDING — Editorial Cinema
 * Tokens are scoped to .landing for now; promote to :root in a global stylesheet
 * to inherit them across the studio + other pages.
 * ========================================================================== */

.landing {
  --ink: #0a0908;
  --ink-soft: #15110d;
  --ink-up: #1f1a14;
  --bone: #ede4d3;
  --bone-soft: #d6cab3;
  --ash: #8a8071;
  --ash-deep: #5d5648;
  --ember: #ff7a45;
  --ember-deep: #c64d18;
  --rule: rgba(237, 228, 211, 0.14);
  --rule-strong: rgba(237, 228, 211, 0.28);

  --font-display: 'Fraunces', 'Times New Roman', serif;
  --font-sans: 'Instrument Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;

  position: relative;
  min-height: 100vh;
  background: var(--ink);
  color: var(--bone);
  font-family: var(--font-sans);
  font-feature-settings: 'ss01', 'ss02';
  overflow-x: hidden;
  isolation: isolate;
}

* { box-sizing: border-box; }

/* ── grain + vignette atmosphere ─────────────────────────────────── */
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
  background: radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(0,0,0,0.55) 80%);
}

/* ── FILM SLATE STRIP ────────────────────────────────────────────── */
.slate {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 9px 32px;
  border-bottom: 1px solid var(--rule);
  background: rgba(10, 9, 8, 0.6);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ash);
  overflow: hidden;
  white-space: nowrap;

  em {
    font-family: var(--font-display);
    font-style: italic;
    text-transform: lowercase;
    color: var(--bone);
    font-size: 12px;
    margin-right: 2px;
    letter-spacing: -0.02em;
  }
}
.slate-cell { display: inline-flex; align-items: center; gap: 6px; }
.slate-sep { color: var(--ash-deep); }
.slate-cell--live {
  margin-left: auto;
  color: var(--ember);
}
.slate-dot {
  width: 6px;
  height: 6px;
  background: var(--ember);
  border-radius: 50%;
  animation: slate-pulse 2.4s ease-in-out infinite;
}
@keyframes slate-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 122, 69, 0.5); }
  50% { box-shadow: 0 0 0 5px rgba(255, 122, 69, 0); }
}

@media (max-width: 720px) {
  .slate { padding: 8px 18px; gap: 10px; font-size: 9px; }
  .slate-cell:nth-of-type(4), .slate-cell:nth-of-type(5),
  .slate-sep:nth-of-type(3), .slate-sep:nth-of-type(4) { display: none; }
}

/* ── NAV ─────────────────────────────────────────────────────────── */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(14px) saturate(120%);
  background: linear-gradient(to bottom, rgba(10, 9, 8, 0.85), rgba(10, 9, 8, 0.6));
  border-bottom: 1px solid var(--rule);
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
  color: var(--bone);
}
.brand-mark {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--ember);
  padding: 3px 7px;
  border: 1px solid var(--ember);
  border-radius: 2px;
  line-height: 1;
}
.brand-rule {
  width: 18px;
  height: 1px;
  background: var(--rule-strong);
}
.brand-name {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: -0.01em;
  font-variation-settings: 'opsz' 14;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav-link {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--bone-soft);
  text-decoration: none;
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  position: relative;
  padding: 4px 0;
  transition: color 200ms ease;
  &:hover { color: var(--bone); }
  &:hover .nav-num { color: var(--ember); }
}
.nav-num {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--ash);
  letter-spacing: 0.1em;
  transition: color 200ms ease;
}
.nav-cta {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  text-decoration: none;
  color: var(--ink);
  background: var(--bone);
  padding: 10px 16px;
  border-radius: 2px;
  font-size: 13px;
  font-weight: 500;
  transition: background 200ms ease, transform 200ms ease;
  &:hover { background: var(--ember); transform: translateY(-1px); }
  .cta-arrow { font-family: var(--font-mono); }
}

@media (max-width: 720px) {
  .nav-inner { padding: 14px 18px; }
  .nav-links a:not(.nav-cta) { display: none; }
}

/* ── HERO ────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  z-index: 2;
  padding: 64px 32px 48px;
  border-bottom: 1px solid var(--rule);
}
.hero-grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 140px 1fr 200px;
  gap: 48px;
  align-items: start;
}
@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; gap: 24px; }
}

.hero-margin {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-top: 8px;
  border-right: 1px solid var(--rule);
  padding-right: 24px;

  @media (max-width: 1024px) {
    flex-direction: row;
    border-right: 0;
    border-bottom: 1px solid var(--rule);
    padding: 0 0 16px 0;
    gap: 32px;
  }
}
.margin-block { display: flex; flex-direction: column; gap: 4px; }
.margin-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--ash);
}
.margin-value {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--bone);
  font-variation-settings: 'opsz' 24;
}

/* hero stage */
.hero-stage { padding: 12px 0 0; min-width: 0; }
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--bone-soft);
  text-transform: uppercase;
  margin-bottom: 36px;
  animation: fade-up 800ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.eyebrow-bullet {
  width: 6px;
  height: 6px;
  background: var(--ember);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255, 122, 69, 0.18);
  animation: pulse-bullet 2.4s ease-in-out infinite;
}
@keyframes pulse-bullet {
  0%, 100% { box-shadow: 0 0 0 4px rgba(255, 122, 69, 0.18); }
  50% { box-shadow: 0 0 0 8px rgba(255, 122, 69, 0.04); }
}

.hero-headline {
  font-family: var(--font-display);
  font-weight: 350;
  font-size: clamp(46px, 7vw, 104px);
  line-height: 0.96;
  letter-spacing: -0.035em;
  margin: 0 0 32px 0;
  color: var(--bone);
  font-variation-settings: 'opsz' 144;
  display: flex;
  flex-direction: column;
  gap: 0.04em;

  .line {
    display: block;
    overflow: hidden;
  }
  .line em {
    font-style: italic;
    font-weight: 400;
    color: var(--bone);
    background: linear-gradient(180deg, var(--bone) 60%, var(--ember) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .line--1 { animation: hero-line 900ms cubic-bezier(0.2, 0.7, 0.2, 1) 80ms both; }
  .line--2 { animation: hero-line 900ms cubic-bezier(0.2, 0.7, 0.2, 1) 220ms both; padding-left: 0.6em; }
  .line--3 { animation: hero-line 900ms cubic-bezier(0.2, 0.7, 0.2, 1) 360ms both; padding-left: 1.4em; }
  @media (max-width: 720px) {
    .line--2, .line--3 { padding-left: 0; }
  }
}
@keyframes hero-line {
  from { transform: translateY(105%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.hero-lede {
  font-size: 17px;
  line-height: 1.6;
  color: var(--bone-soft);
  max-width: 580px;
  margin: 0 0 36px 0;
  animation: fade-up 800ms ease 520ms both;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 56px;
  animation: fade-up 800ms ease 640ms both;
}

.hero-stats {
  list-style: none;
  padding: 28px 0 0;
  margin: 0;
  display: flex;
  gap: 56px;
  flex-wrap: wrap;
  border-top: 1px solid var(--rule);
  animation: fade-up 800ms ease 760ms both;

  li {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: relative;
    /* hairline marker dot above each stat — credit-roll feel */
    &::before {
      content: '';
      position: absolute;
      top: -29px;
      left: 0;
      width: 18px;
      height: 1px;
      background: var(--ember);
    }
  }
  strong {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 38px;
    line-height: 1;
    color: var(--bone);
    letter-spacing: -0.025em;
    font-variation-settings: 'opsz' 48;
    display: inline-flex;
    align-items: baseline;
    gap: 1px;
  }
  .stat-unit {
    font-style: italic;
    color: var(--ember);
    font-size: 22px;
    margin-left: 3px;
  }
  .stat-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    color: var(--ash);
    text-transform: uppercase;
  }
}

/* hero side — film poster panel */
.hero-side {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  @media (max-width: 1024px) { display: none; }
}
.poster {
  position: relative;
  width: 200px;
  aspect-ratio: 2 / 3;
  background:
    linear-gradient(180deg, var(--ink-soft) 0%, var(--ink) 100%),
    var(--ink-soft);
  border: 1px solid var(--rule-strong);
  border-radius: 1px;
  padding: 18px 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: poster-in 1100ms cubic-bezier(0.2, 0.7, 0.2, 1) 600ms both;

  /* hairline inset frame, like a film mat */
  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid var(--rule);
    pointer-events: none;
  }
  /* faint diagonal cinema light */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 122, 69, 0.06) 0%, transparent 45%);
    pointer-events: none;
  }
}
@keyframes poster-in {
  from { opacity: 0; transform: translateY(20px) rotate(-1deg); }
  to { opacity: 1; transform: none; }
}
.poster-top, .poster-foot {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ash);
}
.poster-id { color: var(--ember); }
.poster-foot {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--rule);
}
.poster-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 12px 4px;
}
.poster-mark {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 350;
  font-size: 38px;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--bone);
  font-variation-settings: 'opsz' 48;
}
.poster-rule {
  width: 28px;
  height: 1px;
  background: var(--ember);
}
.poster-tagline {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bone-soft);
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.4;
  em {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 13px;
    text-transform: none;
    letter-spacing: -0.005em;
    color: var(--ember);
    font-variation-settings: 'opsz' 14;
  }
}

/* hero marquee */
.hero-marquee {
  margin-top: 48px;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  padding: 22px 0;
  overflow: hidden;
  position: relative;
  animation: fade-up 800ms ease 880ms both;
  &::before, &::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    width: 80px;
    z-index: 2;
    pointer-events: none;
  }
  &::before { left: 0; background: linear-gradient(to right, var(--ink), transparent); }
  &::after { right: 0; background: linear-gradient(to left, var(--ink), transparent); }
}
.marquee-track {
  display: flex;
  white-space: nowrap;
  width: max-content;
  animation: marquee 36s linear infinite;
  font-family: var(--font-display);
  font-size: 38px;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--bone);
  font-variation-settings: 'opsz' 48;
  em { font-style: italic; color: var(--ember); }
  .dot { color: var(--ash-deep); padding: 0 28px; font-style: normal; }
  .marquee-group { display: inline-flex; align-items: center; padding-right: 40px; }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* ── BUTTONS ─────────────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 22px;
  border-radius: 2px;
  font-family: var(--font-sans);
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
  background: var(--bone);
  color: var(--ink);
  &:hover:not(:disabled) {
    background: var(--ember);
    color: var(--ink);
    transform: translateY(-2px);
  }
  .btn-num {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    color: var(--ember-deep);
    border-right: 1px solid rgba(0,0,0,0.18);
    padding-right: 10px;
    margin-right: -2px;
  }
}
.btn--ghost {
  background: transparent;
  color: var(--bone);
  border: 1px solid var(--rule-strong);
  &:hover {
    color: var(--ember);
    border-color: var(--ember);
  }
  .btn-arrow { font-family: var(--font-mono); transition: transform 220ms ease; }
  &:hover .btn-arrow { transform: translateX(4px); }
}
.btn--large { padding: 18px 30px; font-size: 16px; }
.btn--block { width: 100%; justify-content: center; }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── SECTION SCAFFOLDING ─────────────────────────────────────────── */
.section {
  position: relative;
  z-index: 2;
  padding: 130px 32px;
  border-bottom: 1px solid var(--rule);
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 900ms ease, transform 900ms ease;
  &.in-view { opacity: 1; transform: none; }
}
.section-head {
  max-width: 1280px;
  margin: 0 auto 80px;
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 48px;
  align-items: start;
}
.section-head--double { grid-template-columns: 140px 1fr; }
.section-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-right: 1px solid var(--rule);
  padding-right: 24px;
  font-family: var(--font-mono);
}
.section-num {
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--ember);
}
.section-tag {
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--ash);
  text-transform: uppercase;
}
.section-title {
  font-family: var(--font-display);
  font-weight: 350;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  margin: 0;
  font-variation-settings: 'opsz' 96;
  em { font-style: italic; color: var(--ember); font-weight: 400; }
}
.section-lede {
  margin: 24px 0 0 0;
  grid-column: 2;
  max-width: 560px;
  font-size: 16px;
  line-height: 1.65;
  color: var(--bone-soft);
}
.section-head--double .section-lede { grid-column: 2; }

@media (max-width: 720px) {
  .section { padding: 80px 20px; }
  .section-head { grid-template-columns: 1fr; gap: 16px; margin-bottom: 48px; }
  .section-meta { border-right: 0; padding-right: 0; flex-direction: row; gap: 16px; }
  .section-lede { grid-column: 1; }
}

/* ── 01 PROCESS ──────────────────────────────────────────────────── */
.process-rail {
  max-width: 1280px;
  margin: 0 auto;
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
  border-top: 1px solid var(--rule-strong);
  border-bottom: 1px solid var(--rule-strong);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
.process-step {
  position: relative;
  padding: 56px 32px;
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 24px;
  align-items: start;
  border-right: 1px solid var(--rule);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 700ms ease, transform 700ms ease;
  &.in-view { opacity: 1; transform: none; }
  &:last-child { border-right: 0; }

  &:nth-child(2) { transition-delay: 120ms; }
  &:nth-child(3) { transition-delay: 240ms; }

  @media (max-width: 900px) {
    border-right: 0;
    border-bottom: 1px solid var(--rule);
    &:last-child { border-bottom: 0; }
  }
}
.step-num {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 350;
  font-size: 56px;
  line-height: 1;
  color: var(--ember);
  font-variation-settings: 'opsz' 72;
}
.step-body h3 {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 24px;
  letter-spacing: -0.015em;
  margin: 0 0 12px 0;
  color: var(--bone);
}
.step-body p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--bone-soft);
  margin: 0;
}

/* ── 02 SPEC SHEET ───────────────────────────────────────────────── */
.spec-sheet {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--rule-strong);
}
.spec-row {
  display: grid;
  grid-template-columns: 280px 220px 1fr 100px;
  gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid var(--rule);
  align-items: baseline;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 700ms ease, transform 700ms ease, background 220ms ease, padding 220ms ease;
  &.in-view { opacity: 1; transform: none; }
  &:hover {
    background: linear-gradient(90deg, rgba(255, 122, 69, 0.04), transparent 60%);
    padding-left: 16px;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
.spec-row--total {
  border-bottom: 0;
  padding-top: 36px;
  border-top: 1px double var(--rule-strong);
  .spec-name, .spec-desc { color: var(--bone); }
  .spec-meta { color: var(--ember); font-style: italic; }
}
.spec-role {
  font-family: var(--font-display);
  font-weight: 400;
  font-style: italic;
  font-size: 28px;
  letter-spacing: -0.01em;
  color: var(--bone);
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
  font-variation-settings: 'opsz' 36;
}
.spec-num {
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--ember);
  border: 1px solid var(--ember);
  padding: 3px 6px;
  border-radius: 2px;
  line-height: 1;
}
.spec-name {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--bone-soft);
}
.spec-desc {
  font-size: 15px;
  line-height: 1.6;
  color: var(--bone-soft);
  margin: 0;
}
.spec-meta {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  text-align: right;
  color: var(--bone);
  letter-spacing: -0.01em;
  font-variation-settings: 'opsz' 24;
  @media (max-width: 900px) { text-align: left; }
}

/* ── 03 LEDGER ───────────────────────────────────────────────────── */
.ledger {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 0;
  border: 1px solid var(--rule-strong);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}
.ledger-col {
  padding: 40px 32px 36px;
  border-right: 1px solid var(--rule);
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 700ms ease, transform 700ms ease, background 220ms ease;
  &.in-view { opacity: 1; transform: none; }
  &:nth-child(2) { transition-delay: 100ms; }
  &:nth-child(3) { transition-delay: 200ms; }
  &:last-child { border-right: 0; }

  @media (max-width: 900px) {
    border-right: 0;
    border-bottom: 1px solid var(--rule);
    &:last-child { border-bottom: 0; }
  }
}
.ledger-col--rejected {
  background: rgba(0, 0, 0, 0.2);
  .ledger-name, .rate-num, .rate-unit, .ledger-list { color: var(--ash); }
  .ledger-name { text-decoration: line-through; text-decoration-color: var(--ash-deep); }
}
.ledger-col--featured {
  background: linear-gradient(180deg, rgba(255, 122, 69, 0.05), transparent 80%);
  border-left: 1px solid var(--ember);
  border-right: 1px solid var(--ember);
}
.ledger-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--ash);
  text-transform: uppercase;
  margin-bottom: 28px;
  display: inline-block;
}
.ledger-tag--accent {
  color: var(--ember);
  border-bottom: 1px solid var(--ember);
  padding-bottom: 4px;
  align-self: flex-start;
}
.ledger-name {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 30px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--bone);
  margin: 0 0 24px 0;
  font-variation-settings: 'opsz' 36;
  em { font-style: italic; color: var(--ember); }
}
.ledger-rate {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 28px;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  padding: 14px 0;
}
.rate-num {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 56px;
  line-height: 1;
  color: var(--bone);
  letter-spacing: -0.03em;
  font-variation-settings: 'opsz' 96;
}
.rate-unit {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--bone-soft);
}
.ledger-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  li {
    font-size: 14px;
    line-height: 1.5;
    color: var(--bone-soft);
    display: flex;
    align-items: baseline;
    gap: 10px;
  }
}
.mark {
  font-family: var(--font-mono);
  font-size: 12px;
  flex-shrink: 0;
  width: 14px;
  display: inline-block;
}
.mark--yes { color: var(--ember); }
.mark--no { color: var(--ash-deep); }
.ledger-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  background: var(--ember);
  color: var(--ink);
  padding: 12px 18px;
  border-radius: 2px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  align-self: flex-start;
  transition: transform 200ms ease, background 200ms ease;
  &:hover { transform: translateY(-2px); background: var(--bone); }
}
.ledger-cta--ghost {
  background: transparent;
  color: var(--bone);
  border: 1px solid var(--rule-strong);
  &:hover { color: var(--ember); border-color: var(--ember); background: transparent; }
}
.ledger-foot {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--ash-deep);
  text-transform: uppercase;
  margin-top: auto;
}
.pricing-note {
  max-width: 1280px;
  margin: 32px auto 0;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--ash);
}

/* ── 04 AUDIENCE ─────────────────────────────────────────────────── */
.section--audience {
  text-align: center;
  padding-top: 120px;
  padding-bottom: 120px;
  .section-head { display: flex; justify-content: center; margin-bottom: 56px; }
  .section-meta { border-right: 0; padding-right: 0; flex-direction: row; gap: 16px; }
}
.audience-line {
  font-family: var(--font-display);
  font-weight: 350;
  font-size: clamp(34px, 5vw, 64px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0 auto 36px;
  max-width: 880px;
  color: var(--bone);
  font-variation-settings: 'opsz' 96;
}
:deep(.audience-rotator) {
  display: inline-block;
  font-style: italic;
  color: var(--ember);
  background: linear-gradient(180deg, var(--ember) 0%, var(--ember-deep) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  min-width: 5ch;
}
.badges {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  max-width: 700px;
  margin: 0 auto;
}
.chip {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--bone-soft);
  text-transform: uppercase;
  padding: 7px 14px;
  border: 1px solid var(--rule-strong);
  border-radius: 2px;
  transition: color 200ms ease, border-color 200ms ease;
  &:hover { color: var(--ember); border-color: var(--ember); }
}

/* ── 05 FINAL ────────────────────────────────────────────────────── */
.section--final {
  padding-top: 160px;
  padding-bottom: 160px;
  text-align: center;
  border-bottom: 0;
  background:
    radial-gradient(ellipse at center, rgba(255, 122, 69, 0.08) 0%, transparent 60%),
    var(--ink);
}
.final-meta {
  display: inline-flex;
  gap: 16px;
  font-family: var(--font-mono);
  margin-bottom: 32px;
}
.final-headline {
  font-family: var(--font-display);
  font-weight: 350;
  font-size: clamp(72px, 12vw, 180px);
  line-height: 0.9;
  letter-spacing: -0.045em;
  margin: 0 0 24px 0;
  color: var(--bone);
  font-variation-settings: 'opsz' 144;
  em {
    font-style: italic;
    color: var(--ember);
    font-weight: 400;
  }
}
.final-lede {
  font-size: 16px;
  color: var(--bone-soft);
  margin: 0 auto 40px;
  max-width: 480px;
}

/* ── FOOTER ──────────────────────────────────────────────────────── */
.footer {
  position: relative;
  z-index: 2;
  border-top: 1px solid var(--rule);
  padding: 64px 32px 28px;
  background: var(--ink);
}
.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 40px;
  @media (max-width: 900px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
}
.footer-col p, .footer-col a {
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.7;
  color: var(--bone-soft);
  text-decoration: none;
  display: block;
  transition: color 180ms ease;
}
.footer-col a:hover { color: var(--ember); }
.footer-title {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--ash);
  text-transform: uppercase;
  margin-bottom: 14px;
}
.footer-blurb { margin: 16px 0 0 0; max-width: 320px; }
.footer-col--colophon p em {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--bone);
}
.footer-bottom {
  max-width: 1280px;
  margin: 48px auto 0;
  padding-top: 20px;
  border-top: 1px solid var(--rule);
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--ash);
  text-transform: uppercase;
}
.footer-frame { color: var(--ember); }
.brand--footer {
  margin-bottom: 0;
}

/* ── MODAL ───────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 9, 8, 0.78);
  backdrop-filter: blur(10px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.modal-card {
  position: relative;
  background: var(--ink-soft);
  border: 1px solid var(--rule-strong);
  border-radius: 4px;
  max-width: 460px;
  width: 100%;
  padding: 40px 36px 32px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border: 1px solid rgba(255, 122, 69, 0.18);
    margin: 6px;
    border-radius: 2px;
  }
}
.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: transparent;
  border: none;
  color: var(--ash);
  width: 28px;
  height: 28px;
  font-size: 22px;
  cursor: pointer;
  transition: color 180ms ease;
  &:hover { color: var(--ember); }
}
.modal-head {
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.modal-num { color: var(--ember); }
.modal-tag { color: var(--ash); }
.modal-title {
  font-family: var(--font-display);
  font-weight: 350;
  font-size: 32px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 10px 0;
  color: var(--bone);
  font-variation-settings: 'opsz' 48;
  em { font-style: italic; color: var(--ember); }
}
.modal-lede {
  font-size: 14px;
  color: var(--bone-soft);
  margin: 0 0 24px 0;
  line-height: 1.6;
}
.modal-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--ash);
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
}
.modal-input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.modal-input {
  flex: 1;
  background: var(--ink);
  border: 1px solid var(--rule-strong);
  color: var(--bone);
  font-family: var(--font-mono);
  font-size: 13px;
  padding: 12px 14px;
  border-radius: 2px;
  outline: none;
  transition: border-color 180ms ease;
  &:focus { border-color: var(--ember); }
  &::placeholder { color: var(--ash-deep); }
}
.modal-eye {
  background: var(--ink);
  border: 1px solid var(--rule-strong);
  color: var(--bone-soft);
  width: 44px;
  border-radius: 2px;
  cursor: pointer;
  transition: color 180ms ease, border-color 180ms ease;
  &:hover { color: var(--ember); border-color: var(--ember); }
}
.modal-help {
  font-size: 12px;
  color: var(--ash);
  margin: 0 0 22px 0;
  a { color: var(--ember); text-decoration: none; &:hover { text-decoration: underline; } }
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 240ms ease;
  .modal-card { transition: transform 280ms cubic-bezier(0.2, 0.7, 0.2, 1); }
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  .modal-card { transform: translateY(20px); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
