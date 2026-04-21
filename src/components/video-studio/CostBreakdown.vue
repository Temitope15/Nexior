<template>
  <div class="cost-breakdown">
    <div class="cost-title">Cost Breakdown</div>
    <div class="cost-rows">
      <div v-for="step in steps" :key="step.id" class="cost-row">
        <span class="cost-label">{{ step.label }}</span>
        <span class="cost-value">${{ step.costUsd.toFixed(3) }}</span>
      </div>
    </div>
    <div class="cost-divider" />
    <div class="cost-total-row">
      <span class="cost-total-label">This generation</span>
      <span class="cost-total-value" :class="{ 'cost-total-value--green': totalCostUsd < 1 }">
        ${{ totalCostUsd.toFixed(3) }}
      </span>
    </div>
    <div class="cost-compare">
      <div class="cost-compare-tag">vs ${{ subscriptionMonthly }}/mo subscription</div>
      <div class="cost-savings">
        Pay only <strong>${{ totalCostUsd.toFixed(3) }}</strong> instead of
        ${{ (subscriptionMonthly / 30).toFixed(2) }}/day &mdash;
        <span class="savings-highlight">{{ savingsPercent }}% cheaper per generation</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { IPipelineStep } from '@/models';
import { SUBSCRIPTION_MONTHLY_USD } from '@/constants/videoStudio';

export default defineComponent({
  name: 'CostBreakdown',
  props: {
    steps: {
      type: Array as PropType<IPipelineStep[]>,
      required: true
    },
    totalCostUsd: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const subscriptionMonthly = SUBSCRIPTION_MONTHLY_USD;
    const savingsPercent = computed(() => {
      const dailyCost = SUBSCRIPTION_MONTHLY_USD / 30;
      if (dailyCost <= 0) return 0;
      return Math.round(((dailyCost - props.totalCostUsd) / dailyCost) * 100);
    });
    return { subscriptionMonthly, savingsPercent };
  }
});
</script>

<style scoped lang="scss">
.cost-breakdown {
  padding: 16px;
  background: #0d0d0d;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
}

.cost-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 12px;
}

.cost-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cost-label {
  font-size: 12px;
  color: #666;
}

.cost-value {
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  color: #888;
}

.cost-divider {
  height: 1px;
  background: #1a1a1a;
  margin-bottom: 10px;
}

.cost-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.cost-total-label {
  font-size: 13px;
  font-weight: 500;
  color: #e5e5e5;
}

.cost-total-value {
  font-size: 15px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: #e5e5e5;

  &--green { color: #00d084; }
}

.cost-compare {
  background: #111;
  border: 1px solid #1f1f1f;
  border-radius: 6px;
  padding: 10px 12px;
}

.cost-compare-tag {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #444;
  margin-bottom: 4px;
}

.cost-savings {
  font-size: 11px;
  color: #666;
  line-height: 1.5;
}

.savings-highlight {
  color: #00d084;
  font-weight: 600;
}
</style>
