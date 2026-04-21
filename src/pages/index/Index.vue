<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="container flex justify-between items-center py-6">
        <div class="logo-wrapper">
          <img :src="site?.logo" class="h-10" />
        </div>
        <div class="nav-links hidden md:flex items-center gap-8">
          <a href="#features" class="nav-link">{{ $t('index.nav.features') }}</a>
          <a href="#pricing" class="nav-link">{{ $t('index.nav.pricing') }}</a>
          <a href="#pipeline" class="nav-link">{{ $t('index.nav.pipeline') }}</a>
          <el-button type="primary" round class="px-8 shadow-glow" @click="$router.push('/studio')">
            {{ $t('index.button.launchStudio') }}
          </el-button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero-section">
      <div class="container grid md:grid-cols-2 gap-12 items-center pt-20 pb-32">
        <div class="hero-content" v-motion-fade-visible-once>
          <div class="badge mb-6">{{ $t('index.hero.badge') }}</div>
          <h1 class="hero-title mb-6">
            {{ $t('index.hero.title') }}
            <span class="gradient-text">{{ $t('index.hero.titleHighlight') }}</span>
          </h1>
          <p class="hero-subtitle mb-10">
            {{ $t('index.hero.subtitle') }}
          </p>
          <div class="flex flex-wrap gap-4">
            <el-button type="primary" size="large" round class="px-10 h-14 text-lg shadow-glow" @click="$router.push('/studio')">
              {{ $t('index.button.startCreating') }}
            </el-button>
            <el-button size="large" round class="px-10 h-14 text-lg glass-button" @click="$router.push('/site')">
              {{ $t('index.button.deployStudio') }}
            </el-button>
          </div>
        </div>
        <div class="hero-image-wrapper" v-motion-slide-visible-once-right>
          <div class="image-glow"></div>
          <img src="@/assets/images/dashboard-preview.png" class="dashboard-img shadow-2xl rounded-2xl border border-white/10" />
        </div>
      </div>
    </header>

    <!-- Pipeline Section -->
    <section id="pipeline" class="pipeline-section py-32 bg-section-dark">
      <div class="container">
        <div class="text-center mb-20">
          <h2 class="section-title mb-4">{{ $t('index.pipeline.title') }}</h2>
          <p class="section-subtitle">{{ $t('index.pipeline.subtitle') }}</p>
        </div>
        <div class="grid md:grid-cols-4 gap-6">
          <div v-for="(step, index) in steps" :key="index" class="pipeline-card" v-motion-fade-visible-once :delay="index * 100">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="icon-box mb-6">
              <font-awesome-icon :icon="step.icon" />
            </div>
            <h3 class="card-title mb-3">{{ step.title }}</h3>
            <p class="card-text">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Comparison Section -->
    <section id="pricing" class="pricing-section py-32">
      <div class="container">
        <div class="comparison-card p-10 md:p-20 rounded-3xl relative overflow-hidden">
          <div class="bg-blur"></div>
          <div class="grid md:grid-cols-2 gap-16 relative z-10">
            <div class="traditional">
              <h4 class="text-white/50 uppercase tracking-widest text-sm mb-4 font-bold">{{ $t('index.pricing.traditionalLabel') }}</h4>
              <h2 class="text-4xl md:text-5xl font-extrabold mb-8 text-white/80 line-through decoration-red-500 decoration-4">$2,500.00</h2>
              <ul class="space-y-4">
                <li class="flex items-center gap-3 text-white/40">
                  <font-awesome-icon icon="fa-solid fa-circle-xmark" />
                  {{ $t('index.pricing.traditionalItem1') }}
                </li>
                <li class="flex items-center gap-3 text-white/40">
                  <font-awesome-icon icon="fa-solid fa-circle-xmark" />
                  {{ $t('index.pricing.traditionalItem2') }}
                </li>
                <li class="flex items-center gap-3 text-white/40">
                  <font-awesome-icon icon="fa-solid fa-circle-xmark" />
                  {{ $t('index.pricing.traditionalItem3') }}
                </li>
              </ul>
            </div>
            <div class="voirax">
              <h4 class="gradient-text uppercase tracking-widest text-sm mb-4 font-bold">{{ $t('index.pricing.voiraxLabel') }}</h4>
              <h2 class="text-5xl md:text-7xl font-extrabold mb-8 text-white">$15.00</h2>
              <ul class="space-y-4 mb-10">
                <li class="flex items-center gap-3 text-white">
                  <font-awesome-icon icon="fa-solid fa-circle-check" class="text-purple-400" />
                  {{ $t('index.pricing.voiraxItem1') }}
                </li>
                <li class="flex items-center gap-3 text-white">
                  <font-awesome-icon icon="fa-solid fa-circle-check" class="text-purple-400" />
                  {{ $t('index.pricing.voiraxItem2') }}
                </li>
                <li class="flex items-center gap-3 text-white">
                  <font-awesome-icon icon="fa-solid fa-circle-check" class="text-purple-400" />
                  {{ $t('index.pricing.voiraxItem3') }}
                </li>
              </ul>
              <el-button type="primary" size="large" round class="w-full h-16 text-xl shadow-glow" @click="$router.push('/studio')">
                {{ $t('index.button.getStarted') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer CTA -->
    <footer class="footer py-20 bg-black">
      <div class="container text-center">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-10">{{ $t('index.footer.title') }}</h2>
        <div class="flex justify-center gap-6 mb-20">
          <el-button type="primary" size="large" round class="px-12 h-14 text-lg" @click="$router.push('/studio')">
            {{ $t('index.button.launchNow') }}
          </el-button>
        </div>
        <div class="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="logo-wrapper opacity-50">
            <img :src="site?.logo" class="h-8" />
          </div>
          <p class="text-white/30 text-sm">© {{ new Date().getFullYear() }} {{ site?.title }}. All rights reserved.</p>
          <div class="social-links flex gap-6">
            <a href="#" class="text-white/30 hover:text-white"><font-awesome-icon icon="fa-brands fa-twitter" /></a>
            <a href="#" class="text-white/30 hover:text-white"><font-awesome-icon icon="fa-brands fa-github" /></a>
            <a href="#" class="text-white/30 hover:text-white"><font-awesome-icon icon="fa-brands fa-discord" /></a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElButton, ElImage, ElRow, ElCol, ElCard } from 'element-plus';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'Index',
  components: {
    ElButton,
    ElRow,
    ElCol,
    ElCard,
    ElImage,
    FontAwesomeIcon
  },
  computed: {
    site() {
      return this.$store.state.site;
    },
    steps() {
      return [
        {
          title: this.$t('index.pipeline.step1Title'),
          description: this.$t('index.pipeline.step1Desc'),
          icon: 'fa-solid fa-pen-nib'
        },
        {
          title: this.$t('index.pipeline.step2Title'),
          description: this.$t('index.pipeline.step2Desc'),
          icon: 'fa-solid fa-microphone-lines'
        },
        {
          title: this.$t('index.pipeline.step3Title'),
          description: this.$t('index.pipeline.step3Desc'),
          icon: 'fa-solid fa-film'
        },
        {
          title: this.$t('index.pipeline.step4Title'),
          description: this.$t('index.pipeline.step4Desc'),
          icon: 'fa-solid fa-wand-magic-sparkles'
        }
      ];
    }
  }
});
</script>

<style lang="scss" scoped>
.landing-page {
  background-color: #0b0d17;
  color: #ffffff;
  min-height: 100vh;
  overflow-x: hidden;
  font-family: 'Outfit', 'Inter', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.nav-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  &:hover {
    color: #ffffff;
  }
}

.hero-section {
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    right: -10%;
    width: 60%;
    height: 80%;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
    filter: blur(100px);
    pointer-events: none;
  }
}

.hero-title {
  font-size: 4.5rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.04em;
  @media (max-width: 767px) {
    font-size: 3rem;
  }
}

.gradient-text {
  background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  line-height: 1.6;
}

.badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 99px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #a78bfa;
}

.shadow-glow {
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.3);
  &:hover {
    box-shadow: 0 0 50px rgba(124, 58, 237, 0.5);
  }
}

.glass-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.hero-image-wrapper {
  position: relative;
  .image-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%);
    z-index: -1;
  }
  .dashboard-img {
    width: 100%;
    transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
    transition: transform 0.5s;
    &:hover {
      transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
    }
  }
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.section-subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.5);
}

.pipeline-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 40px;
  border-radius: 24px;
  position: relative;
  transition: all 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(124, 58, 237, 0.3);
    transform: translateY(-10px);
    .icon-box {
      background: #7c3aed;
      color: #ffffff;
    }
  }
  .step-number {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 3rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.05);
    line-height: 1;
  }
  .icon-box {
    width: 60px;
    height: 60px;
    background: rgba(124, 58, 237, 0.1);
    color: #a78bfa;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    transition: all 0.3s;
  }
  .card-title {
    font-size: 1.25rem;
    font-weight: 700;
  }
  .card-text {
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.5;
  }
}

.comparison-card {
  background: #111427;
  border: 1px solid rgba(255, 255, 255, 0.05);
  .bg-blur {
    position: absolute;
    top: -20%;
    right: -20%;
    width: 60%;
    height: 140%;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%);
    filter: blur(80px);
  }
}

.voirax {
  background: rgba(255, 255, 255, 0.03);
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(124, 58, 237, 0.2);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
  border: none;
}
</style>
