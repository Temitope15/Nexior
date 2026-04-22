<template>
  <div class="scroll-stack-card">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ScrollStackItem'
});
</script>

<style scoped lang="scss">
.scroll-stack-card {
  transform-origin: top center;
  will-change: transform, filter;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  height: 20rem;
  width: 100%;
  margin: 30px 0;
  padding: 3rem;
  border-radius: 40px;
  box-sizing: border-box;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  position: relative;
  background: rgba(26, 29, 46, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.1);

  @media (max-width: 768px) {
    height: 16rem;
    padding: 2rem;
    border-radius: 24px;
  }
}
</style>
