<template>
  <div class="pipeline-tracker">
    <div
      v-for="(step, index) in steps"
      :key="step.id"
      class="step-item"
      :class="`step-item--${step.status}`"
    >
      <div class="step-connector" v-if="index > 0" :class="`connector--${steps[index - 1].status}`" />
      <div class="step-row">
        <div class="step-icon">
          <svg v-if="step.status === 'done'" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
            <path d="M4.5 8l2.5 2.5 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else-if="step.status === 'error'" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
            <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span v-else-if="step.status === 'running' || step.status === 'polling'" class="spinner" />
          <span v-else class="step-number">{{ index + 1 }}</span>
        </div>
        <div class="step-content">
          <div class="step-header">
            <span class="step-label">{{ step.label }}</span>
            <span class="step-cost">${{ step.costUsd.toFixed(3) }}</span>
          </div>
          <div class="step-description">{{ step.description }}</div>
          <div v-if="step.status === 'polling'" class="step-status-text step-status-text--polling">
            Generating&hellip;
          </div>
          <div v-if="step.status === 'error' && step.error" class="step-status-text step-status-text--error">
            {{ step.error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IPipelineStep } from '@/models';

export default defineComponent({
  name: 'PipelineTracker',
  props: {
    steps: {
      type: Array as PropType<IPipelineStep[]>,
      required: true
    }
  }
});
</script>

<style scoped lang="scss">
.pipeline-tracker {
  display: flex;
  flex-direction: column;
}

.step-item {
  position: relative;
  padding: 18px 0;

  & + .step-item { border-top: 1px solid var(--vx-rule); }

  &--done .step-icon {
    color: var(--vx-ember);
    border-color: var(--vx-ember);
    background: rgba(255, 122, 69, 0.06);
  }
  &--running .step-icon,
  &--polling .step-icon {
    color: var(--vx-ember);
    border-color: var(--vx-ember);
  }
  &--error .step-icon {
    color: var(--vx-err);
    border-color: var(--vx-err);
  }
  &--idle .step-icon {
    color: var(--vx-ash-deep);
    border-color: var(--vx-rule-strong);
  }
}

.step-connector {
  position: absolute;
  left: 15px;
  top: -18px;
  width: 1px;
  height: 18px;
  background: var(--vx-rule-strong);

  &.connector--done { background: var(--vx-ember); }
  &.connector--running,
  &.connector--polling {
    background: linear-gradient(to bottom, var(--vx-ember), var(--vx-rule-strong));
  }
  &.connector--error { background: var(--vx-err); }
}

.step-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.step-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--vx-rule-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vx-ash-deep);
  transition: color 220ms ease, border-color 220ms ease, background 220ms ease;

  svg { width: 14px; height: 14px; }
}

.step-number {
  font-family: var(--vx-font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
}

.spinner {
  display: block;
  width: 12px;
  height: 12px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.step-content {
  flex: 1;
  min-width: 0;
  padding-top: 5px;
}

.step-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.step-label {
  font-family: var(--vx-font-display);
  font-weight: 400;
  font-size: 17px;
  letter-spacing: -0.01em;
  color: var(--vx-bone);
  font-variation-settings: 'opsz' 18;
}

.step-cost {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--vx-ash);
}

.step-description {
  font-family: var(--vx-font-sans);
  font-size: 12px;
  color: var(--vx-bone-soft);
  line-height: 1.5;
}

.step-status-text {
  font-family: var(--vx-font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &--polling {
    color: var(--vx-ember);
    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--vx-ember);
      box-shadow: 0 0 0 4px rgba(255, 122, 69, 0.2);
      animation: pulse 1.4s ease-in-out infinite;
    }
  }
  &--error {
    color: var(--vx-err);
    text-transform: none;
    letter-spacing: 0.02em;
    font-family: var(--vx-font-sans);
    font-size: 11px;
  }
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(255, 122, 69, 0.18); }
  50% { box-shadow: 0 0 0 7px rgba(255, 122, 69, 0.04); }
}
</style>
