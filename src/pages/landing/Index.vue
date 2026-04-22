<template>
  <div class="landing">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-container">
        <div class="nav-logo">🎬 Nexior</div>
        <div class="nav-links">
          <a href="#features" class="nav-link">How it works</a>
          <a href="#pricing" class="nav-link">Pricing</a>
          <router-link to="/studio" class="nav-cta">Try it now</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="text-write">Write your idea.</span>
            <span class="text-transform">We create your video.</span>
          </h1>
          <p class="hero-subtitle">
            Convert your wildest thoughts into stunning short-form videos with music, voiceover, and professional editing—instantly and affordably.
          </p>
          <div class="hero-ctas">
            <button class="btn btn-primary" @click="showApiKeyModal = true">
              <span>Start Creating</span>
              <span class="btn-icon">→</span>
            </button>
            <a href="https://hub.acedata.cloud" target="_blank" rel="noopener" class="btn btn-secondary">
              <span>Learn about Ace Data Cloud</span>
            </a>
          </div>
        </div>

        <!-- Animated visualization -->
        <div class="hero-visual">
          <div class="visual-container">
            <!-- Input field animation -->
            <div class="input-box">
              <div class="input-cursor" />
              <div class="input-text">
                <span class="text-line">The one habit that separates</span>
                <span class="text-line">top 1% founders from everyone else</span>
              </div>
            </div>

            <!-- Transformation pipes -->
            <div class="pipe-container">
              <div class="pipe pipe-1" />
              <div class="pipe-label">Script</div>
            </div>

            <div class="pipe-container">
              <div class="pipe pipe-2" />
              <div class="pipe-label">Music</div>
            </div>

            <div class="pipe-container">
              <div class="pipe pipe-3" />
              <div class="pipe-label">Voiceover</div>
            </div>

            <!-- Output video frame -->
            <div class="output-box">
              <div class="video-frame">
                <div class="frame-content">
                  <div class="frame-gradient" />
                  <div class="play-icon">▶</div>
                </div>
              </div>
              <div class="output-label">Ready to Post</div>
            </div>
          </div>

          <!-- Floating elements -->
          <div class="float-element element-1">
            <div class="float-badge">📝 Script</div>
          </div>
          <div class="float-element element-2">
            <div class="float-badge">🎵 Suno Music</div>
          </div>
          <div class="float-element element-3">
            <div class="float-badge">🎙️ Voiceover</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
      <div class="features-header">
        <h2>Powered by cutting-edge AI</h2>
        <p>Every component of your video is intelligently generated and optimized</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🤖</div>
          <h3>AI-Generated Script</h3>
          <p>Turn your raw idea into a compelling, hook-driven script optimized for engagement.</p>
          <div class="feature-tech">Claude AI</div>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎵</div>
          <h3>Original Music</h3>
          <p>Suno creates unique, royalty-free background music that matches your vibe perfectly.</p>
          <div class="feature-tech">Suno AI</div>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎙️</div>
          <h3>Natural Voiceover</h3>
          <p>Professional-quality narration with your choice of voice style and tone.</p>
          <div class="feature-tech">Producer API</div>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎬</div>
          <h3>Video Composition</h3>
          <p>Visuals, effects, and transitions automatically choreographed to your audio.</p>
          <div class="feature-tech">Sunooperator.mp4</div>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Blazing Fast</h3>
          <p>Your complete video generated in minutes, not hours. No waiting, no hassle.</p>
          <div class="feature-tech">Parallel Processing</div>
        </div>

        <div class="feature-card">
          <div class="feature-icon">💰</div>
          <h3>Transparent Pricing</h3>
          <p>Pay only for what you use. No subscriptions. Perfect for creators on any budget.</p>
          <div class="feature-tech">x402 Solana Payments</div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing" id="pricing">
      <div class="pricing-header">
        <h2>Affordable video creation</h2>
        <p>The most cost-effective way to create professional short-form videos</p>
      </div>

      <div class="pricing-comparison">
        <div class="comparison-item traditional">
          <div class="comparison-title">Traditional Approach</div>
          <div class="comparison-price">$30/month</div>
          <div class="comparison-list">
            <div class="comparison-point">
              <span class="x-mark">✕</span>
              <span>Subscription requirement</span>
            </div>
            <div class="comparison-point">
              <span class="x-mark">✕</span>
              <span>Limited generations</span>
            </div>
            <div class="comparison-point">
              <span class="x-mark">✕</span>
              <span>No customization</span>
            </div>
            <div class="comparison-point">
              <span class="x-mark">✕</span>
              <span>Manual work required</span>
            </div>
          </div>
        </div>

        <div class="comparison-item nexior">
          <div class="badge-featured">🎯 Recommended</div>
          <div class="comparison-title">Nexior</div>
          <div class="comparison-price"><span class="currency">$</span>0.38<span class="subtext">per video</span></div>
          <div class="comparison-list">
            <div class="comparison-point">
              <span class="check-mark">✓</span>
              <span>Pay per generation</span>
            </div>
            <div class="comparison-point">
              <span class="check-mark">✓</span>
              <span>Unlimited creative freedom</span>
            </div>
            <div class="comparison-point">
              <span class="check-mark">✓</span>
              <span>Music, voice, script included</span>
            </div>
            <div class="comparison-point">
              <span class="check-mark">✓</span>
              <span>100% automated</span>
            </div>
          </div>
          <div class="comparison-cta">
            <router-link to="/studio" class="btn btn-primary btn-small">Start Free</router-link>
          </div>
        </div>

        <div class="comparison-item solana">
          <div class="comparison-title">With x402 Solana</div>
          <div class="comparison-price"><span class="currency">$</span>0.36<span class="subtext">per video</span></div>
          <div class="comparison-list">
            <div class="comparison-point">
              <span class="check-mark">✓</span>
              <span>Everything in Nexior</span>
            </div>
            <div class="comparison-point">
              <span class="check-mark">✓</span>
              <span>5% discount with x402</span>
            </div>
            <div class="comparison-point">
              <span class="check-mark">✓</span>
              <span>Hold $ACE for more savings</span>
            </div>
            <div class="comparison-point">
              <span class="check-mark">✓</span>
              <span>Blockchain transparent</span>
            </div>
          </div>
          <div class="comparison-cta">
            <a href="https://platform.acedata.cloud" target="_blank" rel="noopener" class="btn btn-secondary btn-small">Use x402</a>
          </div>
        </div>
      </div>

      <div class="pricing-note">
        ✨ New accounts start with 5 free credits. Purchase more platform credits using x402 on Solana or Base for 5% off.
      </div>
    </section>

    <!-- How It Works -->
    <section class="process">
      <h2>The process is simple</h2>

      <div class="process-steps">
        <div class="process-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Write your idea</h3>
            <p>Share your concept, no matter how rough. A paragraph is enough.</p>
          </div>
        </div>

        <div class="process-arrow">→</div>

        <div class="process-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Choose your style</h3>
            <p>Pick music style, voice type, and any special preferences.</p>
          </div>
        </div>

        <div class="process-arrow">→</div>

        <div class="process-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>We do the rest</h3>
            <p>AI handles script, music, voiceover, and video—ready to post in minutes.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Hackathon Section -->
    <section class="hackathon">
      <div class="hackathon-content">
        <h2>Built for the Ace Data Cloud hackathon</h2>
        <p>
          Nexior is a live demonstration of what's possible when you combine cutting-edge AI tools:
          Dify workflows, Suno music generation, Producer voiceovers, and transparent x402 payments.
          Built and submitted to the #BuildWithAce campaign.
        </p>
        <div class="hackathon-badges">
          <div class="badge">Dify Workflow</div>
          <div class="badge">Suno Music</div>
          <div class="badge">x402 Payments</div>
          <div class="badge">Solana Integration</div>
          <div class="badge">Ace Data Cloud</div>
        </div>
        <a href="https://x.com" target="_blank" rel="noopener" class="btn btn-secondary">
          See submission on X
        </a>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-final">
      <h2>Ready to create?</h2>
      <p>Turn your ideas into videos. No experience required.</p>
      <router-link to="/studio" class="btn btn-primary btn-large">
        Launch Video Studio
      </router-link>
    </section>

    <!-- API Key Modal -->
    <div v-if="showApiKeyModal" class="modal-overlay" @click.self="showApiKeyModal = false">
      <div class="modal-content">
        <button class="modal-close" @click="showApiKeyModal = false">✕</button>
        <h2>Get Started with Nexior</h2>
        <p>Enter your Ace Data Cloud API key to start creating videos</p>

        <div class="form-group">
          <label>Ace Data Cloud API Key</label>
          <div class="input-wrapper">
            <input
              v-model="apiKeyInput"
              :type="showApiKeyInputValue ? 'text' : 'password'"
              placeholder="sk-…"
              @keyup.enter="submitApiKey"
              class="api-input"
            />
            <button
              class="visibility-toggle"
              @click="showApiKeyInputValue = !showApiKeyInputValue"
            >
              {{ showApiKeyInputValue ? '🙈' : '👁' }}
            </button>
          </div>
          <p class="help-text">
            Don't have one? Get a free API key at
            <a href="https://hub.acedata.cloud" target="_blank" rel="noopener">hub.acedata.cloud</a>
          </p>
        </div>

        <button
          class="btn btn-primary"
          :disabled="!apiKeyInput.trim() || submitting"
          @click="submitApiKey"
        >
          <span v-if="!submitting">Continue to Studio →</span>
          <span v-else class="spinner">...</span>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-title">Nexior</div>
          <p>AI video creation platform built on Ace Data Cloud</p>
        </div>
        <div class="footer-section">
          <div class="footer-title">Links</div>
          <a href="https://hub.acedata.cloud" target="_blank" rel="noopener">Ace Data Cloud Hub</a>
          <a href="https://platform.acedata.cloud" target="_blank" rel="noopener">Ace Platform</a>
        </div>
        <div class="footer-section">
          <div class="footer-title">Follow</div>
          <a href="https://twitter.com" target="_blank" rel="noopener">Twitter/X</a>
          <a href="https://discord.gg" target="_blank" rel="noopener">Discord</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 Nexior. Built with magic and AI.</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LandingIndex',
  data() {
    return {
      showApiKeyModal: false,
      apiKeyInput: '',
      showApiKeyInputValue: false,
      submitting: false
    };
  },
  mounted() {
    this.observeElements();
    const existingKey = this.$store.state.videoStudio?.apiKey;
    if (existingKey) {
      this.apiKeyInput = existingKey;
    }
  },
  methods: {
    observeElements() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.feature-card, .process-step, .comparison-item').forEach((el) => {
        observer.observe(el);
      });
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
// ============================================================================
// LANDING PAGE: Text → Video Transformation
// ============================================================================

$brand-primary: #8b5cf6;
$brand-primary-dark: #7c3aed;
$brand-primary-light: #a78bfa;
$bg-dark: #0b0d17;
$bg-darker: #05060c;
$surface: #111427;
$surface-light: #1a1d2e;
$text-primary: #ffffff;
$text-secondary: #a0a0a0;
$accent-success: #00d084;
$accent-warning: #f5a623;
$border-color: #252840;

* { box-sizing: border-box; }

.landing {
  background: linear-gradient(135deg, $bg-darker 0%, $bg-dark 100%);
  color: $text-primary;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow-x: hidden;
}

// ────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ────────────────────────────────────────────────────────────────────────────

.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(11, 13, 23, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba($brand-primary, 0.1);
  padding: 14px 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-link {
  font-size: 14px;
  color: $text-secondary;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: $brand-primary;
  }
}

.nav-cta {
  @extend .nav-link;
  color: $brand-primary;
  font-weight: 600;
  padding: 8px 16px;
  border: 1px solid rgba($brand-primary, 0.3);
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: rgba($brand-primary, 0.1);
    border-color: $brand-primary;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// ────────────────────────────────────────────────────────────────────────────

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba($brand-primary, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    animation: float 20s ease-in-out infinite;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(40px) translateX(-20px); }
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.hero-text {
  animation: slideIn 0.8s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin: 0 0 24px 0;
}

.text-write {
  display: block;
  animation: fadeInUp 0.8s ease-out;
}

.text-transform {
  display: block;
  background: linear-gradient(135deg, $brand-primary 0%, $brand-primary-light 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.8s ease-out 0.1s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-subtitle {
  font-size: 18px;
  color: $text-secondary;
  line-height: 1.6;
  margin: 0 0 32px 0;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-ctas {
  display: flex;
  gap: 16px;
  animation: fadeInUp 0.8s ease-out 0.3s both;

  @media (max-width: 480px) {
    flex-direction: column;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  justify-content: center;

  &-primary {
    background: linear-gradient(135deg, $brand-primary 0%, $brand-primary-dark 100%);
    color: white;
    box-shadow: 0 8px 24px rgba($brand-primary, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba($brand-primary, 0.4);
    }

    .btn-icon {
      transition: transform 0.3s;
    }

    &:hover .btn-icon {
      transform: translateX(4px);
    }
  }

  &-secondary {
    background: transparent;
    color: $text-secondary;
    border: 1px solid rgba($brand-primary, 0.3);

    &:hover {
      color: $brand-primary;
      border-color: $brand-primary;
      background: rgba($brand-primary, 0.05);
    }
  }

  &-small {
    padding: 10px 20px;
    font-size: 14px;
  }

  &-large {
    padding: 18px 40px;
    font-size: 18px;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// HERO VISUAL: Animated transformation
// ────────────────────────────────────────────────────────────────────────────

.hero-visual {
  position: relative;
  height: 500px;
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.visual-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.input-box {
  background: rgba($surface, 0.6);
  border: 1px solid rgba($brand-primary, 0.2);
  border-radius: 12px;
  padding: 20px;
  animation: slideUp 0.8s ease-out;

  .input-cursor {
    display: inline-block;
    width: 2px;
    height: 20px;
    background: $brand-primary;
    animation: blink 1s infinite;
    margin-right: 4px;
  }

  @keyframes blink {
    0%, 49%, 100% { opacity: 1; }
    50%, 99% { opacity: 0; }
  }

  .input-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: $text-secondary;
    font-size: 14px;
    line-height: 1.5;
  }

  .text-line {
    animation: typewriter 0.5s ease-out forwards;

    &:nth-child(1) { animation-delay: 0.2s; }
    &:nth-child(2) { animation-delay: 0.6s; }
  }

  @keyframes typewriter {
    from {
      opacity: 0;
      width: 0;
    }
    to {
      opacity: 1;
      width: 100%;
    }
  }
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

.pipe-container {
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideUp 0.8s ease-out;

  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.3s; }
}

.pipe {
  flex: 1;
  height: 4px;
  background: linear-gradient(90deg, rgba($brand-primary, 0) 0%, $brand-primary 50%, rgba($brand-primary, 0) 100%);
  border-radius: 2px;
  animation: flow 2s ease-in-out infinite;

  &-1 { animation-delay: 0s; }
  &-2 { animation-delay: 0.3s; }
  &-3 { animation-delay: 0.6s; }
}

@keyframes flow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.pipe-label {
  font-size: 12px;
  color: $brand-primary;
  font-weight: 600;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.output-box {
  background: rgba($surface, 0.6);
  border: 2px solid rgba($brand-primary, 0.4);
  border-radius: 12px;
  padding: 20px;
  animation: slideUp 0.8s ease-out 0.4s both;

  .video-frame {
    aspect-ratio: 9 / 16;
    background: rgba($brand-primary, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    overflow: hidden;
    position: relative;

    .frame-content {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .frame-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba($brand-primary, 0.3) 0%, rgba($brand-primary, 0.05) 100%);
      animation: shimmerGradient 3s ease-in-out infinite;
    }

    @keyframes shimmerGradient {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    .play-icon {
      position: relative;
      z-index: 2;
      font-size: 48px;
      color: $brand-primary;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
      }
    }
  }

  .output-label {
    text-align: center;
    font-size: 12px;
    color: $accent-success;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.float-element {
  position: absolute;
  animation: floatParticle 4s ease-in-out infinite;

  &-1 {
    top: 20%;
    right: -80px;
    animation-delay: 0s;
  }

  &-2 {
    top: 50%;
    right: -120px;
    animation-delay: 0.5s;
  }

  &-3 {
    bottom: 15%;
    right: -100px;
    animation-delay: 1s;
  }

  @keyframes floatParticle {
    0% {
      opacity: 0;
      transform: translateX(0) translateY(0);
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateX(-200px) translateY(-30px);
    }
  }
}

.float-badge {
  background: rgba($brand-primary, 0.15);
  border: 1px solid rgba($brand-primary, 0.3);
  color: $brand-primary;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  backdrop-filter: blur(10px);
}

// ────────────────────────────────────────────────────────────────────────────
// FEATURES SECTION
// ────────────────────────────────────────────────────────────────────────────

.features {
  padding: 120px 20px;
  background: linear-gradient(180deg, rgba($brand-primary, 0.02) 0%, transparent 100%);
}

.features-header {
  text-align: center;
  margin-bottom: 80px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  h2 {
    font-size: 42px;
    font-weight: 800;
    margin: 0 0 16px 0;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 18px;
    color: $text-secondary;
    margin: 0;
    line-height: 1.6;
  }
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.feature-card {
  background: rgba($surface, 0.5);
  border: 1px solid rgba($brand-primary, 0.1);
  border-radius: 12px;
  padding: 32px 24px;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);

  &.in-view {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    background: rgba($surface, 0.8);
    border-color: rgba($brand-primary, 0.3);
    transform: translateY(-8px);
  }

  .feature-icon {
    font-size: 40px;
    margin-bottom: 16px;
    display: block;
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 12px 0;
    color: $text-primary;
  }

  p {
    font-size: 14px;
    color: $text-secondary;
    margin: 0 0 16px 0;
    line-height: 1.6;
  }

  .feature-tech {
    font-size: 12px;
    color: $brand-primary;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// PRICING SECTION
// ────────────────────────────────────────────────────────────────────────────

.pricing {
  padding: 120px 20px;
}

.pricing-header {
  text-align: center;
  margin-bottom: 80px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  h2 {
    font-size: 42px;
    font-weight: 800;
    margin: 0 0 16px 0;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 18px;
    color: $text-secondary;
    margin: 0;
    line-height: 1.6;
  }
}

.pricing-comparison {
  max-width: 1200px;
  margin: 0 auto 60px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.comparison-item {
  background: rgba($surface, 0.5);
  border: 1px solid rgba($brand-primary, 0.1);
  border-radius: 12px;
  padding: 32px;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
  position: relative;

  &.in-view {
    opacity: 1;
    transform: translateY(0);
  }

  &.nexior {
    border-color: rgba($brand-primary, 0.4);
    background: linear-gradient(135deg, rgba($brand-primary, 0.1) 0%, rgba($brand-primary, 0.05) 100%);
    transform: scale(1.02);

    &.in-view {
      transform: scale(1.02) translateY(0);
    }
  }

  .badge-featured {
    position: absolute;
    top: 16px;
    right: 16px;
    background: $brand-primary;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
  }

  .comparison-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 12px 0;
    margin-top: 20px;
  }

  .comparison-price {
    font-size: 36px;
    font-weight: 800;
    color: $brand-primary;
    margin: 16px 0 32px 0;
    letter-spacing: -0.01em;

    .currency {
      font-size: 20px;
    }

    .subtext {
      font-size: 14px;
      color: $text-secondary;
      display: block;
      margin-top: 4px;
    }
  }

  .comparison-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 32px;
  }

  .comparison-point {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    color: $text-secondary;
    line-height: 1.5;

    .check-mark {
      color: $accent-success;
      font-weight: 700;
      flex-shrink: 0;
    }

    .x-mark {
      color: #666;
      font-weight: 700;
      flex-shrink: 0;
    }
  }

  .comparison-cta {
    display: flex;
    gap: 12px;
  }
}

.pricing-note {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  font-size: 14px;
  color: $text-secondary;
  background: rgba($brand-primary, 0.05);
  border: 1px solid rgba($brand-primary, 0.1);
  border-radius: 8px;
  padding: 16px;
}

// ────────────────────────────────────────────────────────────────────────────
// PROCESS SECTION
// ────────────────────────────────────────────────────────────────────────────

.process {
  padding: 120px 20px;
  background: linear-gradient(180deg, transparent 0%, rgba($brand-primary, 0.02) 100%);
}

.process > h2 {
  text-align: center;
  font-size: 42px;
  font-weight: 800;
  margin: 0 0 80px 0;
  letter-spacing: -0.02em;
}

.process-steps {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
}

.process-step {
  flex: 1;
  min-width: 250px;
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s ease-out forwards;

  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(3) { animation-delay: 0.1s; }
  &:nth-child(5) { animation-delay: 0.2s; }

  .step-number {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, $brand-primary 0%, $brand-primary-dark 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 800;
    color: white;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
    line-height: 1.6;
  }
}

.process-arrow {
  font-size: 32px;
  color: $brand-primary;
  opacity: 0.4;

  @media (max-width: 768px) {
    transform: rotate(90deg);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// HACKATHON SECTION
// ────────────────────────────────────────────────────────────────────────────

.hackathon {
  padding: 120px 20px;
  background: linear-gradient(135deg, rgba($brand-primary, 0.08) 0%, rgba($brand-primary, 0.04) 100%);
}

.hackathon-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;

  h2 {
    font-size: 36px;
    font-weight: 800;
    margin: 0 0 24px 0;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 16px;
    color: $text-secondary;
    line-height: 1.8;
    margin: 0 0 32px 0;
  }
}

.hackathon-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 32px;
}

.badge {
  background: rgba($brand-primary, 0.15);
  border: 1px solid rgba($brand-primary, 0.3);
  color: $brand-primary;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

// ────────────────────────────────────────────────────────────────────────────
// FINAL CTA SECTION
// ────────────────────────────────────────────────────────────────────────────

.cta-final {
  padding: 120px 20px;
  text-align: center;

  h2 {
    font-size: 48px;
    font-weight: 800;
    margin: 0 0 16px 0;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 18px;
    color: $text-secondary;
    margin: 0 0 40px 0;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// FOOTER
// ────────────────────────────────────────────────────────────────────────────

.footer {
  background: rgba($surface, 0.5);
  border-top: 1px solid rgba($brand-primary, 0.1);
  padding: 60px 20px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section {
  .footer-title {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $brand-primary;
    margin-bottom: 12px;
  }

  p {
    font-size: 13px;
    color: $text-secondary;
    margin: 0;
    line-height: 1.6;
  }

  a {
    display: block;
    font-size: 13px;
    color: $text-secondary;
    text-decoration: none;
    margin-bottom: 8px;
    transition: color 0.2s;

    &:hover {
      color: $brand-primary;
    }
  }
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  border-top: 1px solid rgba($brand-primary, 0.1);
  padding-top: 20px;
  text-align: center;

  p {
    font-size: 12px;
    color: $text-secondary;
    margin: 0;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// RESPONSIVE
// ────────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────
// MODAL: API KEY ONBOARDING
// ────────────────────────────────────────────────────────────────────────────

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  background: $bg-dark;
  border: 1px solid rgba($brand-primary, 0.2);
  border-radius: 16px;
  padding: 40px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: slideUp 0.3s ease-out;
  position: relative;

  h2 {
    font-size: 24px;
    font-weight: 800;
    margin: 0 0 8px 0;
    color: $text-primary;
  }

  p {
    font-size: 14px;
    color: $text-secondary;
    margin: 0 0 28px 0;
    line-height: 1.6;
  }
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: $text-secondary;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: $brand-primary;
  }
}

.form-group {
  margin-bottom: 28px;

  label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $text-secondary;
    margin-bottom: 8px;
  }
}

.input-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.api-input {
  flex: 1;
  background: rgba($surface, 0.8);
  border: 1px solid rgba($brand-primary, 0.2);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  color: $text-primary;
  outline: none;
  transition: all 0.2s;
  font-family: 'Courier New', monospace;

  &::placeholder {
    color: $text-secondary;
  }

  &:focus {
    border-color: $brand-primary;
    background: rgba($surface, 1);
    box-shadow: 0 0 12px rgba($brand-primary, 0.15);
  }
}

.visibility-toggle {
  background: rgba($surface, 0.8);
  border: 1px solid rgba($brand-primary, 0.2);
  border-radius: 8px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  color: $text-secondary;

  &:hover {
    border-color: $brand-primary;
    color: $brand-primary;
  }
}

.help-text {
  font-size: 11px;
  color: $text-secondary;
  margin: 0;
  line-height: 1.5;

  a {
    color: $brand-primary;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.spinner {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .modal-content {
    padding: 32px 24px;
  }

  .hero-title {
    font-size: 36px;
  }

  .features-header h2,
  .pricing-header h2 {
    font-size: 28px;
  }

  .process > h2 {
    font-size: 28px;
  }

  .cta-final h2 {
    font-size: 32px;
  }
}
</style>
