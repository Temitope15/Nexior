<template>
  <div class="scroll-stack" ref="containerRef">
    <div class="scroll-stack-cards">
      <slot></slot>
    </div>
    <div class="scroll-stack-end"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Lenis from 'lenis';

export default defineComponent({
  name: 'ScrollStack',
  props: {
    itemDistance: {
      type: Number,
      default: 100
    },
    itemScale: {
      type: Number,
      default: 0.03
    },
    itemStackDistance: {
      type: Number,
      default: 30
    },
    stackPosition: {
      type: String,
      default: '20%'
    },
    scaleEndPosition: {
      type: String,
      default: '10%'
    },
    baseScale: {
      type: Number,
      default: 0.85
    },
    rotationAmount: {
      type: Number,
      default: 0
    },
    blurAmount: {
      type: Number,
      default: 0
    },
    stackPosition: {
      type: String,
      default: '20%'
    },
    scaleEndPosition: {
      type: String,
      default: '10%'
    }
  },
  data() {
    return {
      lenis: null as Lenis | null,
      animationFrameId: null as number | null,
      cardsRef: [] as HTMLElement[],
      lastTransforms: new Map() as Map<number, any>
    };
  },
  methods: {
    parsePercentage(value: string, containerHeight: number): number {
      if (typeof value === 'string' && value.includes('%')) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return parseFloat(value);
    },
    getElementOffset(element: HTMLElement): number {
      const rect = element.getBoundingClientRect();
      return rect.top + window.scrollY;
    },
    calculateProgress(scrollTop: number, start: number, end: number): number {
      if (scrollTop < start) return 0;
      if (scrollTop > end) return 1;
      return (scrollTop - start) / (end - start);
    },
    updateCardTransforms() {
      if (this.cardsRef.length === 0) return;

      const scrollTop = window.scrollY;
      const containerHeight = window.innerHeight;
      const stackPositionPx = this.parsePercentage(this.stackPosition, containerHeight);
      const scaleEndPositionPx = this.parsePercentage(this.scaleEndPosition, containerHeight);

      const endElement = document.querySelector('.scroll-stack-end') as HTMLElement;
      const endElementTop = endElement ? this.getElementOffset(endElement) : 0;

      this.cardsRef.forEach((card, i) => {
        if (!card) return;

        const cardTop = this.getElementOffset(card);
        const triggerStart = cardTop - stackPositionPx - this.itemStackDistance * i;
        const triggerEnd = cardTop - scaleEndPositionPx;
        const pinStart = cardTop - stackPositionPx - this.itemStackDistance * i;
        const pinEnd = endElementTop - containerHeight / 2;

        const scaleProgress = this.calculateProgress(scrollTop, triggerStart, triggerEnd);
        const targetScale = this.baseScale + i * this.itemScale;
        const scale = 1 - scaleProgress * (1 - targetScale);
        const rotation = this.rotationAmount ? i * this.rotationAmount * scaleProgress : 0;

        let blur = 0;
        if (this.blurAmount) {
          let topCardIndex = 0;
          for (let j = 0; j < this.cardsRef.length; j++) {
            const jCardTop = this.getElementOffset(this.cardsRef[j]);
            const jTriggerStart = jCardTop - stackPositionPx - this.itemStackDistance * j;
            if (scrollTop >= jTriggerStart) {
              topCardIndex = j;
            }
          }

          if (i < topCardIndex) {
            const depthInStack = topCardIndex - i;
            blur = Math.max(0, depthInStack * this.blurAmount);
          }
        }

        let translateY = 0;
        const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

        if (isPinned) {
          translateY = scrollTop - cardTop + stackPositionPx + this.itemStackDistance * i;
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackPositionPx + this.itemStackDistance * i;
        }

        const newTransform = {
          translateY: Math.round(translateY * 100) / 100,
          scale: Math.round(scale * 1000) / 1000,
          rotation: Math.round(rotation * 100) / 100,
          blur: Math.round(blur * 100) / 100
        };

        const lastTransform = this.lastTransforms.get(i);
        const hasChanged =
          !lastTransform ||
          Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
          Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
          Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
          Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

        if (hasChanged) {
          const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
          const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

          card.style.transform = transform;
          card.style.filter = filter;

          this.lastTransforms.set(i, newTransform);
        }
      });
    },
    handleScroll() {
      this.updateCardTransforms();
    }
  },
  mounted() {
    const container = this.$refs.containerRef as HTMLElement;
    const cards = Array.from(container.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    this.cardsRef = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${this.itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      (card.style as any).webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      (card.style as any).webkitPerspective = '1000px';
    });

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.$nextTick(() => {
      this.updateCardTransforms();
    });
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.cardsRef = [];
    this.lastTransforms.clear();
  }
});
</script>

<style scoped lang="scss">
.scroll-stack {
  position: relative;
  width: 100%;
}

.scroll-stack-cards {
  position: relative;
  width: 100%;
}

.scroll-stack-end {
  width: 100%;
  height: 1px;
  visibility: hidden;
}
</style>
