<template>
  <span class="rotating-text" :class="mainClass">
    <span class="rotating-text-sr-only">{{ texts[currentIndex] }}</span>
    <TransitionGroup name="rotating-char" tag="span" class="rotating-text-content" aria-hidden="true">
      <span
        v-for="(char, i) in currentCharacters"
        :key="`${currentIndex}-${i}`"
        class="rotating-char"
        :style="{ transitionDelay: `${i * staggerDuration}ms` }"
      >
        {{ char }}
      </span>
    </TransitionGroup>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RotatingText',
  props: {
    texts: {
      type: Array as () => string[],
      required: true
    },
    rotationInterval: {
      type: Number,
      default: 2000
    },
    mainClass: {
      type: String,
      default: ''
    },
    staggerDuration: {
      type: Number,
      default: 25
    },
    splitBy: {
      type: String,
      default: 'characters'
    }
  },
  data() {
    return {
      currentIndex: 0,
      intervalId: null as NodeJS.Timeout | null
    };
  },
  computed: {
    currentCharacters(): string[] {
      const text = this.texts[this.currentIndex] || '';
      if (this.splitBy === 'characters') {
        return this.splitIntoCharacters(text);
      }
      return [text];
    }
  },
  methods: {
    splitIntoCharacters(text: string): string[] {
      if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
        const segmenter = new ((Intl as any).Segmenter)('en', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(text), (segment: any) => segment.segment);
      }
      return Array.from(text);
    },
    next() {
      const nextIndex = this.currentIndex === this.texts.length - 1 ? 0 : this.currentIndex + 1;
      this.currentIndex = nextIndex;
    },
    startRotation() {
      if (this.intervalId) clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        this.next();
      }, this.rotationInterval);
    },
    stopRotation() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  },
  mounted() {
    this.startRotation();
  },
  beforeUnmount() {
    this.stopRotation();
  }
});
</script>

<style scoped lang="scss">
.rotating-text {
  display: inline;
  position: relative;
}

.rotating-text-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.rotating-text-content {
  display: inline;
  white-space: nowrap;
}

.rotating-char {
  display: inline-block;
  transform-origin: center;
}

// Transition animations
.rotating-char-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.rotating-char-enter-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease;
}

.rotating-char-leave-to {
  opacity: 0;
  transform: translateY(-120%);
}

.rotating-char-leave-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
