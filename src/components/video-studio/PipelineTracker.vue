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
  gap: 0;
}

.step-item {
  position: relative;
  padding: 16px 0;

  &--done .step-icon {
    color: #00d084;
    border-color: #00d084;
  }
  &--running .step-icon,
  &--polling .step-icon {
    color: #0070f3;
    border-color: #0070f3;
  }
  &--error .step-icon {
    color: #ff4444;
    border-color: #ff4444;
  }
  &--idle .step-icon {
    color: #555;
    border-color: #333;
  }
}

.step-connector {
  position: absolute;
  left: 15px;
  top: -16px;
  width: 1px;
  height: 16px;
  background: #333;

  &.connector--done { background: #00d084; }
  &.connector--running,
  &.connector--polling { background: #0070f3; }
  &.connector--error { background: #ff4444; }
}

.step-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.step-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #555;
  transition: color 0.2s, border-color 0.2s;

  svg {
    width: 16px;
    height: 16px;
  }
}

.step-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}

.spinner {
  display: block;
  width: 14px;
  height: 14px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.step-content {
  flex: 1;
  min-width: 0;
  padding-top: 5px;
}

.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 2px;
}

.step-label {
  font-size: 13px;
  font-weight: 500;
  color: #e5e5e5;
}

.step-cost {
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: #555;
}

.step-description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.step-status-text {
  font-size: 11px;
  margin-top: 4px;

  &--polling { color: #0070f3; }
  &--error { color: #ff4444; }
}
</style>
